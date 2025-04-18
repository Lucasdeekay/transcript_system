from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

from results.models import Result, Student
from .utils import generate_transcript

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            # Optional: create token or session
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def download_transcript(request, student_id):
    return generate_transcript(student_id)

@api_view(['GET'])
def student_transcript(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    results = Result.objects.filter(student=student)

    total_units = 0
    total_points = 0
    grades_mapping = {'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0}

    transcript_data = []
    for result in results:
        course = result.course
        grade = result.grade
        unit = course.unit
        point = grades_mapping.get(grade, 0)

        total_units += unit
        total_points += unit * point

        transcript_data.append({
            'course': course.title,
            'course_code': course.code,
            'unit': unit,
            'grade': grade,
            'point': point,
        })

    cgpa = round(total_points / total_units, 2) if total_units > 0 else 0.00

    return JsonResponse({'student': student.name, 'transcript': transcript_data, 'cgpa': cgpa})