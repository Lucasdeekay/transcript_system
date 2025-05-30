from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from django.http import FileResponse
import io
import os
from .models import GRADE_POINTS, Student, Result, Transcript
from django.conf import settings

def generate_transcript(student_id):
    # Get student and their results
    student = Student.objects.get(id=student_id)
    results = Result.objects.filter(student=student).select_related('course')
    
    # Calculate CGPA and totals
    total_units = 0
    total_grade_points = 0.0
    
    # Prepare data for the table
    table_data = [
        ['Course Code', 'Course Title', 'Units', 'Grade', 'Grade Points', 'Points Earned']
    ]
    
    for result in results:
        units = result.course.credit_unit
        grade_point = GRADE_POINTS.get(result.grade, 0.0)
        points_earned = units * grade_point
        
        table_data.append([
            result.course.course_code,
            result.course.course_title,
            str(units),
            result.grade,
            f"{grade_point:.1f}",
            f"{points_earned:.1f}"
        ])
        
        total_units += units
        total_grade_points += points_earned
    
    cgpa = total_grade_points / total_units if total_units > 0 else 0.0
    
    # Create PDF buffer
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    
    # Create styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        alignment=1,
        spaceAfter=20
    )
    
    # Create content
    content = []
    
    # Add title
    content.append(Paragraph(f"ACADEMIC TRANSCRIPT", title_style))
    
    # Add student information
    student_info = [
        f"<b>Name:</b> {student.user.get_full_name() or student.user.username}",
        f"<b>Matric Number:</b> {student.matric_number}",
        f"<b>Department:</b> {student.department}",
        f"<b>Level:</b> {student.level}",
    ]
    
    for info in student_info:
        content.append(Paragraph(info, styles['Normal']))
    
    content.append(Paragraph("<br/><b>Course Results:</b>", styles['Normal']))
    
    # Create results table
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    content.append(table)
    content.append(Paragraph("<br/>", styles['Normal']))
    
    # Add summary information
    summary = [
        f"<b>Total Units:</b> {total_units}",
        f"<b>Total Grade Points:</b> {total_grade_points:.2f}",
        f"<b>CGPA:</b> {cgpa:.2f}",
    ]
    
    for info in summary:
        content.append(Paragraph(info, styles['Normal']))
    
    # Build PDF
    doc.build(content)
    
    # Save the PDF to the Transcript model
    buffer.seek(0)
    filename = f"transcript_{student.matric_number}.pdf"
    
    # Create or update transcript record
    transcript, created = Transcript.objects.update_or_create(
        student=student,
        defaults={
            'cgpa': cgpa,
            'total_units': total_units,
            'total_grade_points': total_grade_points
        }
    )
    
    # Save the PDF file
    if transcript.pdf_file:
        # Remove old file if exists
        old_file = transcript.pdf_file.path
        if os.path.exists(old_file):
            os.remove(old_file)
    
    transcript.pdf_file.save(filename, buffer)
    transcript.save()
    
    # Return the PDF response
    buffer.seek(0)
    return FileResponse(
        buffer,
        as_attachment=True,
        filename=filename,
        content_type='application/pdf'
    )