import React from "react";
import { useLocation, Link } from "wouter";
import {
  FaUserGraduate,
  FaBook,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useAuth } from "../functions/Auth";


const AdminSidebar = () => {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
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
  );
};

export default AdminSidebar;
