import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h4>Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/students">
              Manage Students
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/courses">
              Manage Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/results">
              Manage Results
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/transcripts">
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

      {/* Main Content */}
      <div className="container-fluid p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
