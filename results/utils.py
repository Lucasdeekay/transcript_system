from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from django.http import FileResponse
import io
import os
from .models import GRADE_POINTS, Student, Result, Transcript # Assuming GRADE_POINTS is directly accessible here
from django.conf import settings
from datetime import datetime # Import datetime for the generation date

def generate_transcript(student_id):
    # Get student and their results
    student = Student.objects.get(id=student_id)
    # Order results by session and semester for proper grouping
    results = Result.objects.filter(student=student).select_related('course').order_by('session', 'semester', 'course__course_code')

    # Data structure to hold semester-wise results and calculations
    semester_data = {} # Format: {session: {semester: {'courses': [], 'total_units': 0, 'total_points': 0.0, 'gpa': 0.0}}}

    total_units_overall = 0
    total_grade_points_overall = 0.0

    for result in results:
        session = result.session
        semester = result.semester
        units = result.course.credit_unit
        grade_point = GRADE_POINTS.get(result.grade.upper(), 0.0) # Ensure grade is uppercase for lookup
        points_earned = units * grade_point

        # Initialize session and semester if they don't exist
        if session not in semester_data:
            semester_data[session] = {}
        if semester not in semester_data[session]:
            semester_data[session][semester] = {
                'courses': [],
                'total_units': 0,
                'total_points': 0.0,
                'gpa': 0.0
            }

        # Add course details to the current semester
        semester_data[session][semester]['courses'].append({
            'course_code': result.course.course_code,
            'course_title': result.course.course_title,
            'units': units,
            'grade': result.grade,
            'grade_point': grade_point,
            'points_earned': points_earned
        })

        # Update semester totals
        semester_data[session][semester]['total_units'] += units
        semester_data[session][semester]['total_points'] += points_earned

        # Update overall totals
        total_units_overall += units
        total_grade_points_overall += points_earned

    # Calculate GPA for each semester
    for session, semesters in semester_data.items():
        for semester, data in semesters.items():
            if data['total_units'] > 0:
                data['gpa'] = round(data['total_points'] / data['total_units'], 2)
            else:
                data['gpa'] = 0.0

    cgpa = round(total_grade_points_overall / total_units_overall, 2) if total_units_overall > 0 else 0.0

    # Create PDF buffer
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=50, leftMargin=50,
                            topMargin=50, bottomMargin=50) # Added margins

    # Create styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        alignment=1, # CENTER
        spaceAfter=20,
        fontName='Helvetica-Bold'
    )
    heading2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )
    heading3_style = ParagraphStyle(
        'Heading3',
        parent=styles['Heading3'],
        fontSize=12,
        spaceAfter=5,
        fontName='Helvetica-Bold'
    )
    normal_style = styles['Normal']
    normal_bold_style = ParagraphStyle(
        'NormalBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold'
    )
    
    # Define table header style
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=normal_bold_style,
        fontSize=10,
        alignment=1, # CENTER
    )
    # Define table cell style
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=normal_style,
        fontSize=9,
        alignment=0, # LEFT
    )
    table_cell_center_style = ParagraphStyle(
        'TableCellCenter',
        parent=normal_style,
        fontSize=9,
        alignment=1, # CENTER
    )


    # Create content
    content = []

    # Add title
    content.append(Paragraph(f"ACADEMIC TRANSCRIPT", title_style))
    content.append(Spacer(1, 0.1 * inch))

    # Add student information
    content.append(Paragraph(f"<b>Name:</b> {student.user.get_full_name() or student.user.username}", normal_bold_style))
    content.append(Paragraph(f"<b>Matric Number:</b> {student.matric_number}", normal_bold_style))
    content.append(Paragraph(f"<b>Department:</b> {student.department}", normal_bold_style))
    content.append(Paragraph(f"<b>Level:</b> {student.level}", normal_bold_style))
    content.append(Spacer(1, 0.2 * inch))

    content.append(Paragraph("<b>Course Results:</b>", heading2_style))
    content.append(Spacer(1, 0.1 * inch))

    # Iterate through sessions and semesters to display results and GPA
    for session, semesters in sorted(semester_data.items()): # Sort sessions
        content.append(Paragraph(f"<u>Session: {session}</u>", heading3_style))
        content.append(Spacer(1, 0.1 * inch))
        for semester, data in sorted(semesters.items(), key=lambda item: 0 if item[0] == 'Harmattan' else 1): # Sort semesters
            content.append(Paragraph(f"<b>Semester: {semester}</b>", heading3_style))
            content.append(Spacer(1, 0.05 * inch))

            # Create results table for the current semester
            semester_table_data = [
                [
                    Paragraph('Course Code', table_header_style), 
                    Paragraph('Course Title', table_header_style), 
                    Paragraph('Units', table_header_style), 
                    Paragraph('Grade', table_header_style), 
                    Paragraph('Grade Points', table_header_style), 
                    Paragraph('Points Earned', table_header_style)
                ]
            ]
            for course_res in data['courses']:
                semester_table_data.append([
                    Paragraph(course_res['course_code'], table_cell_style),
                    Paragraph(course_res['course_title'], table_cell_style),
                    Paragraph(str(course_res['units']), table_cell_center_style),
                    Paragraph(course_res['grade'], table_cell_center_style),
                    Paragraph(f"{course_res['grade_point']:.1f}", table_cell_center_style),
                    Paragraph(f"{course_res['points_earned']:.1f}", table_cell_center_style)
                ])
            
            table = Table(semester_table_data, colWidths=[1.1*inch, 2.3*inch, 0.7*inch, 0.7*inch, 1*inch, 1.1*inch]) # Adjust column widths as needed
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E0E0E0')), # Lighter grey header
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('TOPPADDING', (0, 0), (-1, 0), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white), # White rows
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey), # Lighter grid lines
                ('LEFTPADDING', (0,0), (-1,-1), 3),
                ('RIGHTPADDING', (0,0), (-1,-1), 3),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ]))
            content.append(table)
            content.append(Spacer(1, 0.1 * inch))
            content.append(Paragraph(f"<b>Semester GPA:</b> {data['gpa']:.2f}", normal_bold_style))
            content.append(Spacer(1, 0.3 * inch)) # More space between semesters

    content.append(Paragraph("<br/>", styles['Normal']))

    # Add overall summary information
    content.append(Paragraph("<b>Overall Summary:</b>", heading2_style))
    content.append(Spacer(1, 0.1 * inch))
    content.append(Paragraph(f"<b>Total Units:</b> {total_units_overall}", normal_bold_style))
    content.append(Paragraph(f"<b>Total Grade Points:</b> {total_grade_points_overall:.2f}", normal_bold_style))
    content.append(Paragraph(f"<b>Cumulative Grade Point Average (CGPA):</b> {cgpa:.2f}", normal_bold_style))
    content.append(Spacer(1, 0.5 * inch))

    # Add signature line and date
    content.append(Paragraph("_________________________ ", normal_bold_style))
    content.append(Paragraph("Registrar's Signature ", normal_style))
    content.append(Spacer(1, 0.1 * inch))
    content.append(Paragraph(f"<i>Date Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</i>", styles['Italic']))

    # Build PDF
    doc.build(content)

    # Save the PDF to the Transcript model
    buffer.seek(0)
    filename = f"transcript_{student.matric_number}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf" # Unique filename

    # Create or update transcript record
    # Note: Your model has 'total_units' and 'total_grade_points' directly on Transcript
    transcript, created = Transcript.objects.update_or_create(
        student=student,
        defaults={
            'cgpa': cgpa,
            'total_units': total_units_overall, # Use the overall total units
            'total_grade_points': total_grade_points_overall, # Use the overall total grade points
        }
    )

    # Save the PDF file to the FileField
    # Ensure MEDIA_ROOT and MEDIA_URL are configured in your Django settings
    if transcript.pdf_file:
        # Check if the old file exists and delete it before saving a new one
        if os.path.exists(transcript.pdf_file.path):
            os.remove(transcript.pdf_file.path)
    
    # Save the new PDF
    transcript.pdf_file.save(filename, buffer)
    transcript.save() # This will update `updated_at` field too

    # Return the PDF response
    buffer.seek(0)
    return FileResponse(
        buffer,
        as_attachment=True,
        filename=filename,
        content_type='application/pdf'
    )