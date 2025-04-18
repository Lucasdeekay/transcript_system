import React, { useState } from "react";
import axios from "axios";
import { Table, Button, Form, Container, Card, Spinner } from "react-bootstrap";

const Transcript = () => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [cgpa, setCgpa] = useState(0.0);
  const [loading, setLoading] = useState(false);

  const fetchTranscript = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/transcript/${studentId}/`
      );
      setStudentName(response.data.student);
      setTranscript(response.data.transcript);
      setCgpa(response.data.cgpa);
    } catch (error) {
      console.error("Error fetching transcript", error);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-4 rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-primary">Student Transcript</h3>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="me-2"
              />
              <Button
                variant="primary"
                onClick={fetchTranscript}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Fetch Transcript"
                )}
              </Button>
            </div>
          </div>

          {transcript.length > 0 && (
            <>
              <h5>Student: {studentName}</h5>
              <Table striped bordered hover responsive className="text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Unit</th>
                    <th>Grade</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.map((record, index) => (
                    <tr key={index}>
                      <td>{record.course_code}</td>
                      <td>{record.course}</td>
                      <td>{record.unit}</td>
                      <td>{record.grade}</td>
                      <td>{record.point}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h4>
                CGPA: <strong>{cgpa}</strong>
              </h4>
              <Button
                variant="success"
                href={`http://localhost:8000/transcript/pdf/${studentId}/`}
              >
                Download PDF
              </Button>
            </>
          )}

          {transcript.length === 0 && !loading && studentId && (
            <p className="text-danger">No transcript found for this student.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transcript;
