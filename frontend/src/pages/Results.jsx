import React, { useState, useEffect, createContext, useContext } from "react";
import AdminSidebar from "../components/Sidebar";

const API_BASE = "http://127.0.0.1:8000/api";

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);
  const [currentResult, setCurrentResult] = useState({
    id: null,
    student: "",
    course: "",
    grade: "",
    semester: "",
    session: "",
  });
  // New state for notifications
  const [notification, setNotification] = useState({
    message: "",
    type: "", // 'success' or 'error'
    isVisible: false,
  });

  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchCourses();
  }, []);

  // Function to show a notification toast
  const showNotification = (message, type) => {
    setNotification({ message, type, isVisible: true });
    // Hide the notification after 3 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "", isVisible: false });
    }, 3000);
  };

  const generateSessions = () => {
    const sessions = [];
    for (let year = 2010; year <= 2029; year++) {
      sessions.push(`${year}/${year + 1}`);
    }
    return sessions;
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE}/results/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      showNotification("Failed to fetch results.", "error");
    }
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
      showNotification("Failed to fetch students for dropdown.", "error");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/courses/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showNotification("Failed to fetch courses for dropdown.", "error");
    }
  };

  const handleEdit = (result) => {
    setCurrentResult(result);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setResultToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_BASE}/results/${resultToDelete}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchResults();
      showNotification("Result deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting result:", error);
      showNotification("Failed to delete result.", "error");
    } finally {
      setShowConfirmModal(false);
      setResultToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...payload } = currentResult;
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_BASE}/results/${id}/` : `${API_BASE}/results/`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      setShowModal(false);
      fetchResults();
      setCurrentResult({
        id: null,
        student: "",
        course: "",
        grade: "",
        semester: "",
        session: "",
      });
      showNotification(
        `Result ${method === "POST" ? "added" : "updated"} successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error saving result:", error);
      showNotification(`Failed to save result: ${error.message}`, "error");
    }
  };

  const filteredResults = results.filter((r) => {
    const text = search.toLowerCase();
    return (
      (r.student_name || "").toLowerCase().includes(text) ||
      (r.course_title || "").toLowerCase().includes(text) ||
      (r.grade || "").toLowerCase().includes(text) ||
      (r.semester || "").toLowerCase().includes(text) ||
      (r.session || "").toLowerCase().includes(text)
    );
  });

  return (
    // Main layout container for the Results page
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Header section with title and Add Result button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-purple-700 flex items-center">
            {/* FileAlt icon */}
            <svg
              className="h-10 w-10 mr-3 text-purple-600"
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
            Result Management
          </h2>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            onClick={() => {
              setCurrentResult({
                id: null,
                student: "",
                course: "",
                grade: "",
                semester: "",
                session: "",
              });
              setShowModal(true);
            }}
          >
            {/* Plus icon */}
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Add Result
          </button>
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

        {/* Search input */}
        <div className="mb-6 w-full md:w-1/2">
          <div className="relative">
            {/* Search icon */}
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
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Search by Student or Course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Semester
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Session
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.student_matric_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.course_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.session}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-colors duration-200 shadow-md"
                        onClick={() => handleEdit(result)}
                      >
                        {/* Edit icon */}
                        <svg
                          className="h-4 w-4 inline-block mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-7.793 7.793-2.828.707.707-2.828 7.793-7.793zM14.95 6.05L14 7l-2-2 .95-.95a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        onClick={() => handleDeleteClick(result.id)}
                      >
                        {/* Delete icon */}
                        <svg
                          className="h-4 w-4 inline-block mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Result Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {currentResult.id ? "Edit Result" : "Add New Result"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    className="h-6 w-6"
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

              {/* Modal Body (Form) */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="student"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Student
                  </label>
                  <select
                    id="student"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={currentResult.student}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        student: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} ({s.matric_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="course"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Course
                  </label>
                  <select
                    id="course"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={currentResult.course}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        course: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.course_title} ({c.course_code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="grade"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Grade
                  </label>
                  <select
                    id="grade"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={currentResult.grade}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        grade: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="semester"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Semester
                  </label>
                  <select
                    id="semester"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={currentResult.semester}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        semester: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="session"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Session
                  </label>
                  <select
                    id="session"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={currentResult.session}
                    onChange={(e) =>
                      setCurrentResult({
                        ...currentResult,
                        session: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Session</option>
                    {generateSessions().map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Modal Footer (Buttons) */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 transition-colors duration-200"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {currentResult.id ? "Update Result" : "Add Result"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Deletion */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Confirm Deletion
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <svg
                    className="h-6 w-6"
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
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this result?
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 transition-colors duration-200"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;