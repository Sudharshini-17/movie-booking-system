from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


# ---------------- GENRE ----------------
class Genre(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, db_index=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:140]
        super().save(*args, **kwargs)


# ---------------- LANGUAGE ----------------
class Language(models.Model):
    name = models.CharField(max_length=120, unique=True)
    code = models.CharField(max_length=16, unique=True, db_index=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


# ---------------- MOVIE ----------------
class Movie(models.Model):
    class Certification(models.TextChoices):
        U = "U", "U"
        UA = "UA", "UA"
        A = "A", "A"
        S = "S", "S"

    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, unique=True)
    synopsis = models.TextField(blank=True)
    duration_minutes = models.PositiveSmallIntegerField()

    rating = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0,
        db_index=True,
    )

    certification = models.CharField(
        max_length=8,
        choices=Certification.choices,
        default=Certification.UA,
        db_index=True,
    )

    release_date = models.DateField(db_index=True)
    trailer_url = models.URLField(max_length=500, blank=True)
    poster = models.ImageField(upload_to="movie_posters/%Y/%m/", blank=True, null=True)

    genres = models.ManyToManyField(Genre, related_name="movies", blank=True)
    languages = models.ManyToManyField(Language, related_name="movies", blank=True)

    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-release_date", "title")
        indexes = [
            models.Index(fields=["title"], name="mv_title_idx"),
            models.Index(fields=["-rating"], name="mv_rating_idx"),
            models.Index(
                fields=["-rating", "-release_date", "title"],
                name="mv_mix_idx"
            ),
            models.Index(fields=["-release_date", "title"], name="mv_date_idx"),
            models.Index(
                fields=["release_date"],
                name="mv_active_idx",
                condition=models.Q(is_active=True),
            ),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)[:200]
            self.slug = base or "movie"
        super().save(*args, **kwargs)


# ---------------- THEATER ----------------
class Theater(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300, unique=True, db_index=True)
    city = models.CharField(max_length=120, db_index=True)
    address = models.TextField(blank=True)
    pin_code = models.CharField(max_length=16, blank=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    total_screens = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("city", "name")
        indexes = [
            models.Index(fields=["city", "name"], name="thr_city_idx"),
            models.Index(
                fields=["city"],
                name="thr_active_idx",
                condition=models.Q(is_active=True),
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.city})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.city}")[:300]
        super().save(*args, **kwargs)


# ---------------- SHOW ----------------
class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="shows")
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="shows")

    screen_label = models.CharField(max_length=64, default="Screen 1")

    starts_at = models.DateTimeField(db_index=True)
    ends_at = models.DateTimeField()

    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    seat_capacity = models.PositiveIntegerField(default=0)

    is_cancelled = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("starts_at",)
        indexes = [
            models.Index(fields=["theater", "starts_at"], name="show_thr_idx"),
            models.Index(fields=["movie", "starts_at"], name="show_mv_idx"),
            models.Index(
                fields=["starts_at"],
                name="show_up_idx",
                condition=models.Q(is_cancelled=False),
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(ends_at__gt=models.F("starts_at")),
                name="show_time_chk",
            ),
            models.UniqueConstraint(
                fields=("theater", "starts_at", "screen_label"),
                name="show_unique_slot",
            ),
        ]

    def __str__(self):
        return f"{self.movie.title} @ {self.theater.name} ({self.starts_at})"

    def clean(self):
        if self.ends_at <= self.starts_at:
            raise ValidationError({"ends_at": "Must be after start time"})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)