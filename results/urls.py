from django.urls import path, include
from rest_framework.routers import DefaultRouter

from results.views import LoginAPIView, download_transcript, student_transcript
from .viewsets import StudentViewSet, CourseViewSet, ResultViewSet, TranscriptViewSet

router = DefaultRouter()
router.register(r"students", StudentViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"results", ResultViewSet)
router.register(r"transcripts", TranscriptViewSet)

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
     path("transcript/pdf/<int:student_id>/", download_transcript, name="download_transcript"),
     path("transcript/<int:student_id>/", student_transcript, name="student_transcript"),
    path("api/", include(router.urls)),
]
