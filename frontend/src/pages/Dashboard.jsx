import React from "react";
import { useLocation } from "wouter";
import { Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserGraduate,
  FaBook,
  FaFileAlt,
} from "react-icons/fa";
import AdminSidebar from "../components/Sidebar";

const Dashboard = () => {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    setLocation("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar handleLogout={handleLogout} />

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
