from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .utils import generate_transcript

@api_view(["GET"])
def download_transcript(request, student_id):
    return generate_transcript(student_id)
