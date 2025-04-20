from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matric_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    level = models.IntegerField()
    
    def __str__(self):
        return self.user.username

class Course(models.Model):
    course_code = models.CharField(max_length=10, unique=True)
    course_title = models.CharField(max_length=100)
    credit_unit = models.IntegerField()
    
    def __str__(self):
        return self.course_code

GRADE_CHOICES = [("A", "A"), ("B", "B"), ("C", "C"), ("D", "D"), ("E", "E"), ("F", "F"),]

class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    grade = models.CharField(max_length=2,choices=GRADE_CHOICES)
    semester = models.CharField(max_length=20)
    session = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.student.matric_number} - {self.course.course_code}"

class Transcript(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to="transcripts/")

    def __str__(self):
        return f"Transcript for {self.student.matric_number}"
