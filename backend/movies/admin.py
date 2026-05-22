from django.contrib import admin

from .models import Genre, Language, Movie, Show, Theater


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "slug",
        "release_date",
        "rating",
        "duration_minutes",
        "certification",
        "is_active",
        "updated_at",
    )
    list_filter = ("certification", "is_active", "release_date", "rating")
    search_fields = ("title", "slug", "synopsis")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("genres", "languages")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "city", "total_screens", "is_active")
    list_filter = ("city", "is_active")
    search_fields = ("name", "slug", "city", "address")
    prepopulated_fields = {"slug": ("name", "city")}


@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = (
        "movie",
        "theater",
        "screen_label",
        "starts_at",
        "ends_at",
        "base_price",
        "seat_capacity",
        "is_cancelled",
    )
    list_filter = ("is_cancelled", "theater__city")
    search_fields = ("movie__title", "theater__name", "screen_label")
    autocomplete_fields = ("movie", "theater")
    date_hierarchy = "starts_at"
