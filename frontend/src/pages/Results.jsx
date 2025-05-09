import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  FaFileAlt,
} from "react-icons/fa";
import AdminSidebar from "../components/Sidebar";

const API_BASE = "http://127.0.0.1:8000/api";

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentResult, setCurrentResult] = useState({
    id: null,
    student: "",
    course: "",
    grade: "",
    semester: "",
    session: "",
  });


  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchCourses();
  }, []);

  const generateSessions = () => {
    const sessions = [];
    for (let year = 2010; year <= 2029; year++) {
      sessions.push(`${year}/${year + 1}`);
    }
    return sessions;
  };


  const fetchResults = async () => {
    const res = await axios.get(`${API_BASE}/results/`);
    setResults(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get(`${API_BASE}/students/`);
    setStudents(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get(`${API_BASE}/courses/`);
    setCourses(res.data);
  };

  const handleEdit = (result) => {
    setCurrentResult(result);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      await axios.delete(`${API_BASE}/results/${id}/`);
      fetchResults();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...payload } = currentResult;
    if (id) {
      await axios.put(`${API_BASE}/results/${id}/`, payload);
    } else {
      await axios.post(`${API_BASE}/results/`, payload);
    }
    setShowModal(false);
    fetchResults();
    setCurrentResult({ id: null, student: "", course: "", grade: "" });
  };

  const filteredResults = results.filter((r) => {
    const text = search.toLowerCase();
    return (
      r.student_name?.toLowerCase().includes(text) ||
      r.course_title?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Container className="mt-4">
        <Row className="mt-2 mb-3 align-items-center">
          <Col>
            <h2 className="fw-bold text-primary">
              <FaFileAlt className="me-2" /> Result Management
            </h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              ➕ Add Result
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="🔍 Search by Student or Course"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

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
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
                  <Form.Select
                    value={currentResult.grade}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        grade: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </Form.Select>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select
                    value={currentResult.semester}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        semester: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </Form.Select>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Label>Session</Form.Label>
                  <Form.Select
                    value={currentResult.session}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        session: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Session</option>
                    {generateSessions().map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </Form.Select>
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
    </div>
  );
};

export default Results;
