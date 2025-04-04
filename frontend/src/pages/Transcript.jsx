import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

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
        `https://your-backend.com/transcript/${studentId}/`
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
    <div>
      <h3>Student Transcript</h3>
      <div className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button className="ms-2" onClick={fetchTranscript} disabled={loading}>
          {loading ? "Loading..." : "Fetch Transcript"}
        </Button>
      </div>

      {transcript.length > 0 && (
        <>
          <h5>Student: {studentName}</h5>
          <Table striped bordered>
            <thead>
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
            href={`https://your-backend.com/transcript/pdf/${studentId}/`}
          >
            Download PDF
          </Button>
        </>
      )}
    </div>
  );
};

export default Transcript;
