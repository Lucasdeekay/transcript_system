import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Card,
} from "react-bootstrap";

const API_URL = "http://localhost:8000/api/courses/";

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
    const response = await axios.get(API_URL);
    setResults(response.data);
  };

  const fetchStudents = async () => {
    const response = await axios.get("http://localhost:8000/api/students/");
    setStudents(response.data);
  };

  const fetchCourses = async () => {
    const response = await axios.get("http://localhost:8000/api/courses/");
    setCourses(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentResult.id) {
      await axios.put(
        `http://localhost:8000/api/results/${currentResult.id}/`,
        currentResult
      );
    } else {
      await axios.post("http://localhost:8000/api/results/", currentResult);
    }
    setShow(false);
    setCurrentResult({ id: null, student: "", course: "", grade: "" });
    fetchResults();
  };

  const handleEdit = (result) => {
    setCurrentResult({
      id: result.id,
      student: result.student,
      course: result.course,
      grade: result.grade,
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      await axios.delete(`http://localhost:8000/api/results/${id}/`);
      fetchResults();
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-4 rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-primary">Student Results</h3>
            <Button variant="primary" onClick={() => setShow(true)}>
              + Add Result
            </Button>
          </div>

          <Table bordered hover responsive className="text-center">
            <thead className="table-primary">
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.student_name}</td>
                  <td>{result.course_title}</td>
                  <td>{result.grade}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(result)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(result.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for Add/Update */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentResult.id ? "Edit Result" : "Add New Result"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
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
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label>Course</Form.Label>
                <Form.Select
                  value={currentResult.course}
                  onChange={(e) =>
                    setCurrentResult({
                      ...currentResult,
                      course: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. A, B+, C"
                  value={currentResult.grade}
                  onChange={(e) =>
                    setCurrentResult({
                      ...currentResult,
                      grade: e.target.value,
                    })
                  }
                  required
                />
              </Col>
            </Row>
            <div className="d-grid">
              <Button variant="success" type="submit">
                {currentResult.id ? "Update Result" : "Add Result"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Results;
