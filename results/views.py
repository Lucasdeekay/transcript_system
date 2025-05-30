from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

from results.models import GRADE_POINTS, Result, Student, Transcript
from .utils import generate_transcript

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            # Optional: create token or session
            print(user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def download_transcript(request, student_id):
    return generate_transcript(student_id)

@api_view(['GET'])
def student_transcript(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    Result.update_transcript(student)  # Ensure fresh data
    transcript = get_object_or_404(Transcript, student=student)
    results = Result.objects.filter(student=student).select_related('course')

    transcript_data = []
    for result in results:
        transcript_data.append({
            'course_code': result.course.code,
            'course_title': result.course.title,
            'units': result.course.unit,
            'grade': result.grade,
            'grade_point': GRADE_POINTS.get(result.grade, 0.0),
            'points_earned': result.course.unit * GRADE_POINTS.get(result.grade, 0.0)
        })

    return JsonResponse({
        'student': student.name,
        'matric_number': student.matric_number,
        'courses': transcript_data,
        'total_grade_points': transcript.total_grade_points,
        'total_units': transcript.total_units,
        'cgpa': transcript.cgpa,
        'calculation': f"{transcript.total_grade_points} / {transcript.total_units} = {transcript.cgpa}"
    })