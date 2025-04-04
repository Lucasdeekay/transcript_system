import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const [currentResult, setCurrentResult] = useState({
    id: null,
    student: "",
    course: "",
    grade: "",
  });

  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchResults = async () => {
    const response = await axios.get("https://your-backend.com/api/results/");
    setResults(response.data);
  };

  const fetchStudents = async () => {
    const response = await axios.get("https://your-backend.com/api/students/");
    setStudents(response.data);
  };

  const fetchCourses = async () => {
    const response = await axios.get("https://your-backend.com/api/courses/");
    setCourses(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentResult.id) {
      await axios.put(
        `https://your-backend.com/api/results/${currentResult.id}/`,
        currentResult
      );
    } else {
      await axios.post("https://your-backend.com/api/results/", currentResult);
    }
    setShow(false);
    fetchResults();
  };

  return (
    <div>
      <h3>Manage Results</h3>
      <Button onClick={() => setShow(true)}>Add Result</Button>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.student_name}</td>
              <td>{result.course_title}</td>
              <td>{result.grade}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Update */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentResult.id ? "Edit Result" : "Add Result"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Student</Form.Label>
              <Form.Select
                value={currentResult.student}
                onChange={(e) =>
                  setCurrentResult({
                    ...currentResult,
                    student: e.target.value,
                  })
                }
                required
              >
                <option>Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={currentResult.course}
                onChange={(e) =>
                  setCurrentResult({ ...currentResult, course: e.target.value })
                }
                required
              >
                <option>Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Grade</Form.Label>
              <Form.Control
                type="text"
                value={currentResult.grade}
                onChange={(e) =>
                  setCurrentResult({ ...currentResult, grade: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit">{currentResult.id ? "Update" : "Add"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Results;
