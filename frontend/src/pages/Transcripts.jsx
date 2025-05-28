import React, { useState, useEffect, createContext, useContext } from "react";
import AdminSidebar from "../components/Sidebar";

const API_BASE = "http://127.0.0.1:8000/api";

const Transcripts = () => {
  const [students, setStudents] = useState([]); // State to hold student data for the dropdown
  const [search, setSearch] = useState(""); // Search input for students
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] =
    useState(""); // New state for selected student ID
  const [selectedStudentDisplayName, setSelectedStudentDisplayName] =
    useState(""); // New state for displaying selected student's name
  const [showSuggestions, setShowSuggestions] = useState(false); // State to control visibility of suggestions
  // New state for notifications
  const [notification, setNotification] = useState({
    message: "",
    type: "", // 'success' or 'error'
    isVisible: false,
  });

  useEffect(() => {
    fetchStudents(); // Fetch students when component mounts
  }, []);

  // Function to show a notification toast
  const showNotification = (message, type) => {
    setNotification({ message, type, isVisible: true });
    // Hide the notification after 3 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "", isVisible: false });
    }, 3000);
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      showNotification(
        "Failed to fetch students for transcript generation.",
        "error"
      );
    }
  };

  const handleGenerateTranscript = () => {
    if (selectedStudentForTranscript) {
      // Construct the URL using the base API and the specific endpoint
      window.open(
        `http://127.0.0.1:8000/transcript/pdf/${selectedStudentForTranscript}/`,
        "_blank"
      );
      showNotification(
        "Transcript generation initiated! Check your downloads.",
        "success"
      );
      setSelectedStudentForTranscript(""); // Reset selected student ID
      setSelectedStudentDisplayName(""); // Reset displayed name
      setSearch(""); // Reset search input
    } else {
      showNotification(
        "Please select a student to generate transcript.",
        "error"
      );
    }
  };

  // Filter students based on search input
  const filteredStudents = students.filter(
    (student) =>
      (student.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.last_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.matric_number || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Main layout container for the Transcripts page
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-start">
        {" "}
        {/* Adjusted centering */}
        {/* Header section with title */}
        <div className="flex flex-col items-center justify-center mb-10 w-full">
          <h2 className="text-4xl font-extrabold text-gray-700 flex items-center mb-6">
            {/* FileAlt icon */}
            <svg
              className="h-10 w-10 mr-3 text-gray-600"
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
            Generate Student Transcripts
          </h2>
        </div>
        {/* Notification Toast */}
        {notification.isVisible && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white font-bold transition-all duration-300 transform ${
              notification.type === "success" ? "bg-green-600" : "bg-red-600"
            } ${
              notification.isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
            role="alert"
            style={{ zIndex: 1000 }} // Ensure it's above other elements
          >
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                onClick={() =>
                  setNotification({ ...notification, isVisible: false })
                }
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        {/* Transcript Generation Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Generate Transcript
          </h3>
          <div className="mb-4 relative">
            {" "}
            {/* Added relative for positioning suggestions */}
            <label
              htmlFor="searchStudent"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Search Student:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <input
                type="text"
                id="searchStudent"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 outline-none"
                placeholder="Search by name or matric number..."
                value={selectedStudentDisplayName || search} // Display selected name or current search
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedStudentForTranscript(""); // Clear selected ID when typing
                  setSelectedStudentDisplayName(""); // Clear displayed name when typing
                  setShowSuggestions(true); // Always show suggestions when typing
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click on suggestions
              />
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && search && filteredStudents.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      // Use onMouseDown to prevent onBlur from firing too early
                      setSelectedStudentForTranscript(s.id);
                      setSelectedStudentDisplayName(
                        `${s.first_name} ${s.last_name} (${s.matric_number})`
                      );
                      setSearch(
                        `${s.first_name} ${s.last_name} (${s.matric_number})`
                      ); // Update search to reflect selection
                      setShowSuggestions(false);
                    }}
                  >
                    {s.first_name} {s.last_name} ({s.matric_number})
                  </div>
                ))}
              </div>
            )}
            {showSuggestions && search && filteredStudents.length === 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 px-4 py-2 text-gray-500">
                No students found.
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center"
              onClick={handleGenerateTranscript}
              disabled={!selectedStudentForTranscript} // Disable if no student is selected
            >
              {/* FileAlt icon for transcript */}
              <svg
                className="h-5 w-5 mr-2"
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
              Generate Transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcripts;
