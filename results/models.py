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

GRADE_POINTS = {
    'A': 5.0,
    'B': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0,
}

class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    grade = models.CharField(max_length=2,choices=GRADE_CHOICES)
    semester = models.CharField(max_length=20)
    session = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.student.matric_number} - {self.course.course_code}"

    @classmethod
    def calculate_cgpa(cls, student):
        results = cls.objects.filter(student=student)
        total_units = 0
        total_grade_points = 0.0
        
        for result in results:
            units = result.course.credit_unit
            grade_point = GRADE_POINTS.get(result.grade, 0.0)
            
            total_units += units
            total_grade_points += units * grade_point
        
        cgpa = total_grade_points / total_units if total_units > 0 else 0.0
        
        return {
            'cgpa': round(cgpa, 2),
            'total_grade_points': total_grade_points,
            'total_units': total_units
        }
    
    def save(self, *args, **kwargs):
        # First save the result
        super().save(*args, **kwargs)
        # Update the student's transcript
        self.__class__.update_transcript(self.student)
    
    def delete(self, *args, **kwargs):
        # Get student before deletion
        student = self.student
        # Delete the result
        super().delete(*args, **kwargs)
        # Update the transcript
        self.__class__.update_transcript(student)
    
    @classmethod
    def update_transcript(cls, student):
        results = cls.objects.filter(student=student)
        total_units = 0
        total_grade_points = 0.0
        grades_mapping = {'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0}

        for result in results:
            unit = result.course.credit_unit
            grade_point = grades_mapping.get(result.grade, 0.0)
            total_units += unit
            total_grade_points += unit * grade_point

        cgpa = round(total_grade_points / total_units, 2) if total_units > 0 else 0.00
        
        # Update or create the transcript
        transcript, created = Transcript.objects.update_or_create(
            student=student,
            defaults={
                'cgpa': cgpa,
                'total_units': total_units,
                'total_grade_points': total_grade_points
            }
        )
class Transcript(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_units = models.PositiveIntegerField(default=0)
    total_grade_points = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pdf_file = models.FileField(upload_to="transcripts/", null=True, blank=True)

    def __str__(self):
        return f"Transcript for {self.student.matric_number} (CGPA: {self.cgpa})"
