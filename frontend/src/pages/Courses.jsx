import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import AdminSidebar from "../components/Sidebar";

const API_URL = "http://127.0.0.1:8000/api/courses/";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    course_code: "",
    course_title: "",
    unit: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(API_URL);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse.id) {
        await axios.put(`${API_URL}${currentCourse.id}/`, currentCourse);
      } else {
        await axios.post(API_URL, currentCourse);
      }
      setShowModal(false);
      setCurrentCourse({ id: null, course_code: "", course_title: "", unit: "" });
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="container-fluid p-4">
        <Row className="mt-2 mb-3 align-items-center">
          <Col>
            <h2 className="fw-bold text-success">📘 Course Management</h2>
          </Col>
          <Col className="text-end">
            <Button variant="success" onClick={() => setShowModal(true)}>
              ➕ Add Course
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="🔍 Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        <Table bordered hover responsive className="shadow-sm">
          <thead className="table-success">
            <tr>
              <th>Course Code</th>
              <th>Title</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.unit}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(course)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(course.id)}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentCourse.id ? "Edit Course" : "Add New Course"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Course Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., CSC101"
                  value={currentCourse.course_code}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, course_code: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Course Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Introduction to Computer Science"
                  value={currentCourse.course_title}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      course_title: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Course Unit</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 3"
                  value={currentCourse.unit}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, unit: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <div className="text-end">
                <Button variant="success" type="submit">
                  {currentCourse.id ? "Update Course" : "Add Course"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Courses;
