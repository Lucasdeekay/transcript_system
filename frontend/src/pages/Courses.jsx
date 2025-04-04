import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    code: "",
    title: "",
    unit: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await axios.get("https://your-backend.com/api/courses/");
    setCourses(response.data);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://your-backend.com/api/courses/${id}/`);
    fetchCourses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentCourse.id) {
      await axios.put(
        `https://your-backend.com/api/courses/${currentCourse.id}/`,
        currentCourse
      );
    } else {
      await axios.post("https://your-backend.com/api/courses/", currentCourse);
    }
    setShow(false);
    fetchCourses();
  };

  return (
    <div>
      <h3>Manage Courses</h3>
      <div className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Search courses..."
          className="me-2"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setShow(true)}>Add Course</Button>
      </div>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses
            .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
            .map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.unit}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
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
            {currentCourse.id ? "Edit Course" : "Add Course"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                type="text"
                value={currentCourse.code}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, code: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                value={currentCourse.title}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Course Unit</Form.Label>
              <Form.Control
                type="number"
                value={currentCourse.unit}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, unit: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit">{currentCourse.id ? "Update" : "Add"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Courses;
