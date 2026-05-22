from django.db.models import Count, Exists, OuterRef, Prefetch, Q
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Genre, Language, Movie, Show, Theater
from .serializers import (
    GenreSerializer,
    LanguageSerializer,
    MovieListSerializer,
    MovieWriteSerializer,
    ShowSerializer,
    TheaterSerializer,
)


def _parse_int_list(query_params, key: str) -> list[int]:
    """
    Parse multi-select query params like:
      ?genres=1,2,3
      ?genres=1&genres=2
    """
    raw_values = query_params.getlist(key)
    if not raw_values:
        return []

    tokens: list[str] = []
    for raw in raw_values:
        raw = (raw or "").strip()
        if not raw:
            continue
        tokens.extend([t.strip() for t in raw.split(",") if t.strip()])

    try:
        parsed = [int(t) for t in tokens]
    except ValueError as exc:
        raise ValidationError({key: "Must be a list of integers (comma-separated or repeated)."}) from exc

    # De-duplicate while keeping order.
    seen = set()
    out: list[int] = []
    for item in parsed:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("name", "slug")
    ordering_fields = ("name", "slug")
    ordering = ("name",)


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("name", "code")
    ordering_fields = ("name", "code")
    ordering = ("name",)


class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("name", "slug", "city", "address")
    ordering_fields = ("name", "city", "created_at")
    ordering = ("city", "name")


class MovieViewSet(viewsets.ModelViewSet):
    queryset = (
        Movie.objects.all()
        .prefetch_related(
            Prefetch("genres", queryset=Genre.objects.order_by("name")),
            Prefetch("languages", queryset=Language.objects.order_by("name")),
        )
        .order_by("-release_date", "title")
    )
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("title", "slug", "synopsis")
    ordering_fields = ("title", "rating", "release_date", "duration_minutes", "created_at")
    ordering = ("-release_date",)

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return MovieWriteSerializer
        return MovieListSerializer

    @action(detail=False, methods=["get"], url_path="filter")
    def filter_movies(self, request):
        """
        Faceted movie filtering endpoint.

        Query params:
          - genres: multi-select genre IDs (comma-separated or repeated)
          - languages: multi-select language IDs (comma-separated or repeated)
          - sort: rating_desc|rating_asc|release_date_desc|release_date_asc
          - limit: page size (max 100)
          - offset: pagination offset
        """
        genre_ids = _parse_int_list(request.query_params, "genres")
        language_ids = _parse_int_list(request.query_params, "languages")

        sort = (request.query_params.get("sort") or "rating_desc").strip()
        sort_map = {
            "rating_desc": ("-rating", "-release_date", "title"),
            "rating_asc": ("rating", "-release_date", "title"),
            "release_date_desc": ("-release_date", "title"),
            "release_date_asc": ("release_date", "title"),
        }
        if sort not in sort_map:
            raise ValidationError({"sort": "Invalid. Use rating_desc|rating_asc|release_date_desc|release_date_asc"})

        try:
            limit = int(request.query_params.get("limit", 20))
            offset = int(request.query_params.get("offset", 0))
        except (TypeError, ValueError) as exc:
            raise ValidationError({"limit": "limit/offset must be integers."}) from exc

        if limit <= 0 or limit > 100:
            raise ValidationError({"limit": "limit must be between 1 and 100."})
        if offset < 0:
            raise ValidationError({"offset": "offset must be >= 0."})

        base_qs = Movie.objects.filter(is_active=True)

        # Use EXISTS subqueries to avoid join explosion / duplicates for multi-select filters.
        if genre_ids:
            genres_through = Movie.genres.through
            base_qs = base_qs.filter(
                Exists(
                    genres_through.objects.filter(
                        movie_id=OuterRef("pk"),
                        genre_id__in=genre_ids,
                    )
                )
            )
        if language_ids:
            languages_through = Movie.languages.through
            base_qs = base_qs.filter(
                Exists(
                    languages_through.objects.filter(
                        movie_id=OuterRef("pk"),
                        language_id__in=language_ids,
                    )
                )
            )

        total = base_qs.count()

        ordering = sort_map[sort]
        results_qs = (
            base_qs.order_by(*ordering)
            .prefetch_related(
                Prefetch("genres", queryset=Genre.objects.order_by("name")),
                Prefetch("languages", queryset=Language.objects.order_by("name")),
            )[offset : offset + limit]
        )
        results = MovieListSerializer(results_qs, many=True, context={"request": request}).data

        # Facet counts exclude the facet's own filter dimension (genres excluded for genre counts,
        # languages excluded for language counts) while still applying the other dimension.
        genre_count_q = Q(movies__is_active=True)
        if language_ids:
            genre_count_q &= Q(movies__languages__id__in=language_ids)

        genres_facets_qs = (
            Genre.objects.annotate(count=Count("movies", distinct=True, filter=genre_count_q))
            .filter(count__gt=0)
            .order_by("name")
        )

        language_count_q = Q(movies__is_active=True)
        if genre_ids:
            language_count_q &= Q(movies__genres__id__in=genre_ids)

        languages_facets_qs = (
            Language.objects.annotate(count=Count("movies", distinct=True, filter=language_count_q))
            .filter(count__gt=0)
            .order_by("name")
        )

        genres_facets = list(genres_facets_qs.values("id", "name", "slug", "count"))
        languages_facets = list(languages_facets_qs.values("id", "name", "code", "count"))

        has_next = offset + limit < total
        has_previous = offset > 0

        return Response(
            {
                "limit": limit,
                "offset": offset,
                "total": total,
                "has_next": has_next,
                "next_offset": offset + limit if has_next else None,
                "has_previous": has_previous,
                "previous_offset": max(0, offset - limit) if has_previous else None,
                "results": results,
                "facets": {"genres": genres_facets, "languages": languages_facets},
            }
        )


class ShowViewSet(viewsets.ModelViewSet):
    queryset = (
        Show.objects.select_related("movie", "theater")
        .all()
        .order_by("starts_at")
    )
    serializer_class = ShowSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("screen_label", "movie__title", "theater__name", "theater__city")
    ordering_fields = ("starts_at", "ends_at", "base_price", "created_at")
    ordering = ("starts_at",)
