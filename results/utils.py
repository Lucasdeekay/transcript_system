from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import FileResponse
import io
from .models import Student, Result

def generate_transcript(student_id):
    student = Student.objects.get(id=student_id)
    results = Result.objects.filter(student=student)

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle(f"Transcript - {student.matric_number}")

    pdf.drawString(100, 750, f"Transcript for {student.user.username}")
    pdf.drawString(100, 730, f"Matric Number: {student.matric_number}")
    pdf.drawString(100, 710, f"Department: {student.department}")
    
    y = 690
    for result in results:
        pdf.drawString(100, y, f"{result.course.course_code} - {result.grade}")
        y -= 20
    
    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"transcript_{student.matric_number}.pdf")
