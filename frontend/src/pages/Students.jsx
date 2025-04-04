import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    name: "",
    matric_number: "",
    department: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await axios.get("https://your-backend.com/api/students/");
    setStudents(response.data);
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://your-backend.com/api/students/${id}/`);
    fetchStudents();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStudent.id) {
      await axios.put(
        `https://your-backend.com/api/students/${currentStudent.id}/`,
        currentStudent
      );
    } else {
      await axios.post(
        "https://your-backend.com/api/students/",
        currentStudent
      );
    }
    setShow(false);
    fetchStudents();
  };

  return (
    <div>
      <h3>Manage Students</h3>
      <div className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Search students..."
          className="me-2"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setShow(true)}>Add Student</Button>
      </div>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Matric Number</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
            .map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.matric_number}</td>
                <td>{student.department}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentStudent.id ? "Edit Student" : "Add Student"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentStudent.name}
                onChange={(e) =>
                  setCurrentStudent({ ...currentStudent, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
                required
              />
            </Form.Group>
            <Button type="submit">
              {currentStudent.id ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Students;
