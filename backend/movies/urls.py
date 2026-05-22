from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GenreViewSet, LanguageViewSet, MovieViewSet, ShowViewSet, TheaterViewSet

router = DefaultRouter()
router.register(r"genres", GenreViewSet)
router.register(r"languages", LanguageViewSet)
router.register(r"theaters", TheaterViewSet)
router.register(r"movies", MovieViewSet)
router.register(r"shows", ShowViewSet)

urlpatterns = [
    path("", include(router.urls)),
]