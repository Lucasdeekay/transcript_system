import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
} from "react-bootstrap";
import { useLocation } from "wouter";
import {
  FaFileAlt,
} from "react-icons/fa";
import AdminSidebar from "../components/Sidebar";

const API_BASE = "http://127.0.0.1:8000/api";

const Transcripts = () => {
  const [transcripts, setTranscripts] = useState([]);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/transcripts/`);
      setTranscripts(res.data);
    } catch (error) {
      console.error("Failed to fetch transcripts", error);
    }
  };

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    setLocation("/");
  };

  const filteredTranscripts = transcripts.filter((t) =>
    t.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <Container className="mt-4">
        <Row className="mt-2 mb-3 align-items-center">
          <Col>
            <h2 className="fw-bold text-primary">
              <FaFileAlt className="me-2" /> Student Transcripts
            </h2>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="🔍 Search by Student Name"
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
              <th>Matric Number</th>
              <th>Program</th>
              <th>CGPA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTranscripts.length > 0 ? (
              filteredTranscripts.map((transcript) => (
                <tr key={transcript.id}>
                  <td>{transcript.student_name}</td>
                  <td>{transcript.matric_number}</td>
                  <td>{transcript.program}</td>
                  <td>{transcript.cgpa}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `${API_BASE}/transcripts/${transcript.id}/download/`,
                          "_blank"
                        )
                      }
                    >
                      Download PDF
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">
                  No transcripts available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Transcripts;
