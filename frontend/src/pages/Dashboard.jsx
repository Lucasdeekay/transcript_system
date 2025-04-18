import React from "react";
import { Link, useLocation } from "wouter";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaSignOutAlt,
  FaUserGraduate,
  FaBook,
  FaFileAlt,
} from "react-icons/fa";

const Dashboard = () => {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setLocation("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-4 vh-100"
        style={{ width: "250px", boxShadow: "2px 0 10px rgba(0,0,0,0.1)" }}
      >
        <h4 className="text-center mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link
              href="/admin/students"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaUserGraduate className="me-2" /> Manage Students
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              href="/admin/courses"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaBook className="me-2" /> Manage Courses
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              href="/admin/results"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaFileAlt className="me-2" /> Manage Results
            </Link>
          </li>
          <li className="nav-item mb-4">
            <Link
              href="/admin/transcripts"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaFileAlt className="me-2" /> Generate Transcripts
            </Link>
          </li>
          <li className="nav-item mt-3">
            <Button
              variant="danger"
              className="w-100"
              onClick={handleLogout}
              style={{ boxShadow: "0 4px 10px rgba(255, 0, 0, 0.2)" }}
            >
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="container-fluid p-4">
        <Row>
          <Col md={12}>
            <Card className="shadow-lg">
              <Card.Body>
                <h2 className="text-primary">Welcome to the Dashboard</h2>
                <p>Select a section from the sidebar to manage records.</p>
                <Row className="mt-4">
                  <Col md={3} className="mb-3">
                    <Card className="text-center shadow-lg">
                      <Card.Body>
                        <FaUserGraduate size={40} />
                        <h5 className="mt-2">Manage Students</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Card className="text-center shadow-lg">
                      <Card.Body>
                        <FaBook size={40} />
                        <h5 className="mt-2">Manage Courses</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Card className="text-center shadow-lg">
                      <Card.Body>
                        <FaFileAlt size={40} />
                        <h5 className="mt-2">Manage Results</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Card className="text-center shadow-lg">
                      <Card.Body>
                        <FaFileAlt size={40} />
                        <h5 className="mt-2">Generate Transcripts</h5>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
