from django.urls import path, include
from rest_framework.routers import DefaultRouter

from results.views import download_transcript
from .viewsets import StudentViewSet, CourseViewSet, ResultViewSet, TranscriptViewSet

router = DefaultRouter()
router.register(r"students", StudentViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"results", ResultViewSet)
router.register(r"transcripts", TranscriptViewSet)

urlpatterns = [
     path("transcripts/download/<int:student_id>/", download_transcript, name="download_transcript"),
    path("api/", include(router.urls)),
]
