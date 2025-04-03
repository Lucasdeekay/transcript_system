from rest_framework import serializers
from .models import Student, Course, Result, Transcript

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = "__all__"

class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = "__all__"
