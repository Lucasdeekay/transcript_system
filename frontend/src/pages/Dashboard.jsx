import React from "react";
import { Link, useLocation } from "wouter";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setLocation("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h4>Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/admin/students" className="nav-link text-white">
              Manage Students
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/courses" className="nav-link text-white">
              Manage Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/results" className="nav-link text-white">
              Manage Results
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/transcripts" className="nav-link text-white">
              Generate Transcripts
            </Link>
          </li>
          <li className="nav-item mt-3">
            <button onClick={handleLogout} className="btn btn-danger w-100">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="container-fluid p-4">
        <h2>Welcome to the Dashboard</h2>
        <p>Select a section from the sidebar to manage records.</p>
      </div>
    </div>
  );
};

export default Dashboard;
