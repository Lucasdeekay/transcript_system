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

const API_URL = "http://localhost:8000/api/students/";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(false);
      setCurrentStudent({
        id: null,
        name: "",
        matric_number: "",
        department: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

   return (
     <Container className="mt-4">
       <Card className="shadow-lg p-4 rounded-4">
         <Card.Body>
           <div className="d-flex justify-content-between align-items-center mb-3">
             <h3 className="text-primary">Students</h3>
             <Button variant="primary" onClick={() => setShow(true)}>
               + Add Student
             </Button>
           </div>

           <Table bordered hover responsive className="text-center">
             <thead className="table-primary">
               <tr>
                 <th>Name</th>
                 <th>Email</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {students.map((student) => (
                 <tr key={student.id}>
                   <td>{student.name}</td>
                   <td>{student.email}</td>
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
         </Card.Body>
       </Card>

       {/* Modal for Add/Edit */}
       <Modal show={show} onHide={() => setShow(false)} centered>
         <Modal.Header closeButton>
           <Modal.Title>
             {currentStudent.id ? "Edit Student" : "Add New Student"}
           </Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <Form onSubmit={handleSubmit}>
             <Form.Group className="mb-3">
               <Form.Label>Full Name</Form.Label>
               <Form.Control
                 type="text"
                 placeholder="Enter full name"
                 value={currentStudent.name}
                 onChange={(e) =>
                   setCurrentStudent({
                     ...currentStudent,
                     name: e.target.value,
                   })
                 }
                 required
               />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>Email Address</Form.Label>
               <Form.Control
                 type="email"
                 placeholder="Enter email"
                 value={currentStudent.email}
                 onChange={(e) =>
                   setCurrentStudent({
                     ...currentStudent,
                     email: e.target.value,
                   })
                 }
                 required
               />
             </Form.Group>
             <div className="d-grid">
               <Button variant="success" type="submit">
                 {currentStudent.id ? "Update Student" : "Add Student"}
               </Button>
             </div>
           </Form>
         </Modal.Body>
       </Modal>
     </Container>
   );
};

export default Students;
