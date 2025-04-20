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

const API_URL = "http://127.0.0.1:8000/api/students/";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    matric_number: "",
    department: "",
    level: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentStudent.id) {
        await axios.put(`${API_URL}${currentStudent.id}/`, currentStudent);
      } else {
        await axios.post(API_URL, currentStudent);
      }
      fetchStudents(); // refresh list
      setShowModal(false);
      setCurrentStudent({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        matric_number: "",
        department: "",
        level: "",
      });
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  // Inside Students.js

  const filteredStudents = students.filter((s) => {
    const searchText = search.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(searchText) ||
      s.last_name.toLowerCase().includes(searchText) ||
      s.email.toLowerCase().includes(searchText) ||
      s.matric_number.toLowerCase().includes(searchText) ||
      s.department.toLowerCase().includes(searchText) ||
      s.level.toString().includes(searchText)
    );
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="container-fluid p-4">
        <Row className="mt-2 mb-3 align-items-center">
          <Col>
            <h2 className="fw-bold text-primary">👨‍🎓 Student Management</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              ➕ Add Student
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="🔍 Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        <Table bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Matric No</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.matric_number}</td>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.level}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(student)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(student.id)}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentStudent.id ? "Edit Student" : "Add New Student"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentStudent.first_name}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      first_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentStudent.last_name}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      last_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={currentStudent.email}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      email: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Matric Number</Form.Label>
                <Form.Control
                  type="text"
                  value={currentStudent.matric_number}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      matric_number: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  value={currentStudent.department}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      department: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="number"
                  value={currentStudent.level}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      level: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <div className="text-end">
                <Button variant="primary" type="submit">
                  {currentStudent.id ? "Update Student" : "Add Student"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Students;
