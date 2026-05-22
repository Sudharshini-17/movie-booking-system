from decimal import Decimal

from rest_framework import serializers

from .models import Genre, Language, Movie, Show, Theater


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ("id", "name", "slug")


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ("id", "name", "code")


class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = (
            "id",
            "name",
            "slug",
            "city",
            "address",
            "pin_code",
            "latitude",
            "longitude",
            "total_screens",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "created_at", "updated_at")


class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = (
            "id",
            "title",
            "slug",
            "synopsis",
            "duration_minutes",
            "rating",
            "certification",
            "release_date",
            "trailer_url",
            "poster",
            "poster_url",
            "genres",
            "languages",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("slug", "created_at", "updated_at")

    def get_poster_url(self, obj):
        if not obj.poster:
            return None
        request = self.context.get("request")
        url = obj.poster.url
        if request:
            return request.build_absolute_uri(url)
        return url


class MovieWriteSerializer(serializers.ModelSerializer):
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        required=False,
        write_only=True,
        source="genres",
    )
    language_ids = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all(),
        many=True,
        required=False,
        write_only=True,
        source="languages",
    )

    class Meta:
        model = Movie
        fields = (
            "id",
            "title",
            "slug",
            "synopsis",
            "duration_minutes",
            "rating",
            "certification",
            "release_date",
            "trailer_url",
            "poster",
            "genre_ids",
            "language_ids",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at", "rating")

    def to_representation(self, instance):
        return MovieListSerializer(instance, context=self.context).data

    def create(self, validated_data):
        genres = validated_data.pop("genres", [])
        languages = validated_data.pop("languages", [])
        movie = Movie.objects.create(**validated_data)
        if genres:
            movie.genres.set(genres)
        if languages:
            movie.languages.set(languages)
        return movie

    def update(self, instance, validated_data):
        genres = validated_data.pop("genres", None)
        languages = validated_data.pop("languages", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if genres is not None:
            instance.genres.set(genres)
        if languages is not None:
            instance.languages.set(languages)
        return instance


class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="movie.title", read_only=True)
    theater_name = serializers.CharField(source="theater.name", read_only=True)

    class Meta:
        model = Show
        fields = (
            "id",
            "movie",
            "movie_title",
            "theater",
            "theater_name",
            "screen_label",
            "starts_at",
            "ends_at",
            "base_price",
            "seat_capacity",
            "is_cancelled",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def validate(self, attrs):
        starts = attrs.get("starts_at") or getattr(self.instance, "starts_at", None)
        ends = attrs.get("ends_at") or getattr(self.instance, "ends_at", None)
        if starts and ends and ends <= starts:
            raise serializers.ValidationError({"ends_at": "Must be after starts_at."})
        base_price = attrs.get("base_price")
        if base_price is not None and base_price < Decimal("0"):
            raise serializers.ValidationError({"base_price": "Must be non-negative."})
        return attrs
