from rest_framework import serializers
from .models import Student, Course, Result, Transcript
from django.contrib.auth.models import User

class StudentSerializer(serializers.ModelSerializer):
    # These fields are now writable, and will be used to create/update the associated User model.
    # We use write_only=False (the default) so they are also included in responses.
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = Student
        fields = [
            "id", "matric_number", "department", "level",
            "first_name", "last_name", "email",  # from User
        ]

    def create(self, validated_data):
        # Extract the 'user' dictionary from validated_data
        # This will contain 'first_name', 'last_name', and 'email' because of source='user.<field_name>'
        user_data = validated_data.pop('user')

        # Create the User instance
        user = User.objects.create(
            username=user_data['email'],  # using email as username
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
        )
        # Create the Student instance, linking it to the newly created user
        student = Student.objects.create(user=user, **validated_data)
        return student

    def update(self, instance, validated_data):
        # Extract the 'user' dictionary from validated_data if present
        user_data = validated_data.pop('user', None)

        # Update Student model fields
        instance.matric_number = validated_data.get('matric_number', instance.matric_number)
        instance.department = validated_data.get('department', instance.department)
        instance.level = validated_data.get('level', instance.level)
        instance.save()

        # Update associated User fields if user_data was provided
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.email = user_data.get('email', user.email)
            user.username = user_data.get('email', user.username) # Keep username in sync with email
            user.save()

        return instance

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class ResultSerializer(serializers.ModelSerializer):
    student_matric_number = serializers.CharField(source='student.matric_number', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Result
        fields = "__all__"

    def create(self, validated_data):
        try:
            # First create the result
            result = super().create(validated_data)
            # Update the transcript
            Result.update_transcript(result.student)
            return result
        except Exception as e:
            raise serializers.ValidationError(str(e))

    def update(self, instance, validated_data):
        try:
            # First update the result
            result = super().update(instance, validated_data)
            # Update the transcript
            Result.update_transcript(result.student)
            return result
        except Exception as e:
            raise serializers.ValidationError(str(e))

class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = "__all__"

