from django.contrib import admin
from .models import Student, Course, Result, Transcript

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("user", "matric_number", "department", "level")
    search_fields = ("user__username", "matric_number", "department")
    list_filter = ("department", "level")

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("course_code", "course_title", "credit_unit")
    search_fields = ("course_code", "course_title")

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "grade", "semester", "session")
    search_fields = ("student__matric_number", "course__course_code", "semester", "session")
    list_filter = ("semester", "session", "grade")

@admin.register(Transcript)
class TranscriptAdmin(admin.ModelAdmin):
    list_display = ("student", "generated_at", "total_units", "total_grade_points", "cgpa")
    search_fields = ("student__matric_number",)
