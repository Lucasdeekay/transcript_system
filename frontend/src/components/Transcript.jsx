import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Transcript = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await axios.get(
          `https://your-backend.com/api/students/${studentId}/`
        );
        setStudent(response.data);
        setResults(response.data.results);
      } catch (error) {
        console.error("Error fetching transcript:", error);
      }
    };

    fetchTranscript();
  }, [studentId]);

  return (
    <div className="container mt-4 p-4 bg-light shadow rounded">
      <h2 className="text-dark">Transcript</h2>
      <Button variant="primary" onClick={() => setShow(true)}>
        View Transcript
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Name:</strong> {student?.name}
          </p>
          <p>
            <strong>Matric Number:</strong> {student?.matric_number}
          </p>
          <p>
            <strong>Department:</strong> {student?.department}
          </p>

          <h5 className="mt-3">Results</h5>
          <table className="table table-bordered">
            <thead>
              <tr className="table-dark">
                <th>Course</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.course.course_code}</td>
                  <td>{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transcript;
