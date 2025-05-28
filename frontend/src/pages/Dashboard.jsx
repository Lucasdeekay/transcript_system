import React from "react";

import AdminSidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    // Main container for the dashboard, using flexbox for sidebar and main content layout
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar component */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {" "}
        {/* flex-1 allows it to grow and fill remaining space, p-8 for padding */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          {" "}
          {/* Card equivalent with shadow and rounded corners */}
          <h2 className="text-4xl font-extrabold text-blue-700 mb-4">
            Welcome to the Dashboard
          </h2>
          <p className="text-gray-700 text-lg">
            Select a section from the sidebar to manage records.
          </p>
        </div>
        {/* Dashboard Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          {/* Responsive grid layout */}
          {/* Manage Students Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer">
            {/* Inline SVG for FaUserGraduate */}
            <svg
              className="h-16 w-16 mx-auto text-blue-500 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path d="M10 14a4 4 0 100-8 4 4 0 000 8zM10 16a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
            <h5 className="text-xl font-semibold text-gray-800">
              Manage Students
            </h5>
          </div>
          {/* Manage Courses Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer">
            {/* Inline SVG for FaBook */}
            <svg
              className="h-16 w-16 mx-auto text-green-500 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h5 className="text-xl font-semibold text-gray-800">
              Manage Courses
            </h5>
          </div>
          {/* Manage Results Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer">
            {/* Inline SVG for FaFileAlt */}
            <svg
              className="h-16 w-16 mx-auto text-purple-500 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h5 className="text-xl font-semibold text-gray-800">
              Manage Results
            </h5>
          </div>
          {/* Generate Transcripts Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer">
            {/* Inline SVG for FaFileAlt */}
            <svg
              className="h-16 w-16 mx-auto text-orange-500 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0-3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h5 className="text-xl font-semibold text-gray-800">
              Generate Transcripts
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
