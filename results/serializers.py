from rest_framework import serializers
from .models import Student, Course, Result, Transcript
from django.contrib.auth.models import User

# serializers.py
class StudentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Student
        fields = [
            "id", "matric_number", "department", "level",
            "first_name", "last_name", "email",  # from User
        ]

    def create(self, validated_data):
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")
        email = validated_data.pop("email")

        user = User.objects.create(
            username=email,  # using email as username
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        student = Student.objects.create(user=user, **validated_data)
        return student


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
