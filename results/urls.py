from django.urls import path, include
from rest_framework.routers import DefaultRouter

from results.views import download_transcript, student_transcript
from .viewsets import StudentViewSet, CourseViewSet, ResultViewSet, TranscriptViewSet

router = DefaultRouter()
router.register(r"students", StudentViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"results", ResultViewSet)
router.register(r"transcripts", TranscriptViewSet)

urlpatterns = [
     path("transcripts/pdf/<int:student_id>/", download_transcript, name="download_transcript"),
     path("transcripts/<int:student_id>/", student_transcript, name="student_transcript"),
    path("api/", include(router.urls)),
]
