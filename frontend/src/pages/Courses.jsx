import React, { useState, useEffect, createContext, useContext } from "react";
import AdminSidebar from "../components/Sidebar";

const API_URL = "http://127.0.0.1:8000/api/courses/";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    course_code: "",
    course_title: "",
    credit_unit: "",
  });
  // New state for notifications
  const [notification, setNotification] = useState({
    message: "",
    type: "", // 'success' or 'error'
    isVisible: false,
  });

  useEffect(() => {
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

  const fetchCourses = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showNotification("Failed to fetch courses.", "error");
    }
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setCourseToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}${courseToDelete}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchCourses(); // Re-fetch courses after deletion
      showNotification("Course deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting course:", error);
      showNotification("Failed to delete course.", "error");
    } finally {
      setShowConfirmModal(false);
      setCourseToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = currentCourse.id ? "PUT" : "POST";
      const url = currentCourse.id ? `${API_URL}${currentCourse.id}/` : API_URL;

      console.log(url);
      console.log(method);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCourse),
      });

      if (!response.ok) {
        // Attempt to read error message from backend if available
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            errorData.course_code ||
            `HTTP error! status: ${response.status}`
        );
      }

      setShowModal(false);
      setCurrentCourse({
        id: null,
        course_code: "",
        course_title: "",
        credit_unit: "",
      });
      fetchCourses(); // Re-fetch courses after saving
      showNotification(
        `Course ${method === "POST" ? "added" : "updated"} successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error saving course:", error);
      showNotification(`Failed to save course: ${error.message}`, "error");
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      (c.course_title || "").toLowerCase().includes(search.toLowerCase()) || // Filter by course_title
      (c.course_code || "").toLowerCase().includes(search.toLowerCase()) // Also filter by course_code
  );

  return (
    // Main layout container for the Courses page
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Header section with title and Add Course button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-green-700 flex items-center">
            {/* Book icon */}
            <svg
              className="h-10 w-10 mr-3 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2h4.586A2 2 0 0112 3.414L14.586 6A2 2 0 0115 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 9a1 1 0 100-2 1 1 0 000 2zm-3-2a1 1 0 100-2 1 1 0 000 2zm9-1V7a1 1 0 00-1-1h-1.586l-2-2H6a1 1 0 00-1 1v10a1 1 0 001 1h7a1 1 0 001-1v-4.586l-2-2H10a1 1 0 00-1 1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Course Management
          </h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            onClick={() => {
              setCurrentCourse({
                id: null,
                course_code: "",
                course_title: "",
                credit_unit: "",
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
            Add Course
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
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Search by title or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Course Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Unit
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
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.course_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.course_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.credit_unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-colors duration-200 shadow-md"
                        onClick={() => handleEdit(course)}
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
                        onClick={() => handleDeleteClick(course.id)}
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
                    colSpan="4"
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Course Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {currentCourse.id ? "Edit Course" : "Add New Course"}
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
                    htmlFor="course_code"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Course Code
                  </label>
                  <input
                    type="text"
                    id="course_code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., CSC101"
                    value={currentCourse.course_code}
                    onChange={(e) =>
                      setCurrentCourse({
                        ...currentCourse,
                        course_code: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="course_title"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Course Title
                  </label>
                  <input
                    type="text"
                    id="course_title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Introduction to Computer Science"
                    value={currentCourse.course_title}
                    onChange={(e) =>
                      setCurrentCourse({
                        ...currentCourse,
                        course_title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="unit"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Course Unit
                  </label>
                  <input
                    type="number"
                    id="unit"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 3"
                    value={currentCourse.credit_unit}
                    onChange={(e) =>
                      setCurrentCourse({
                        ...currentCourse,
                        credit_unit: e.target.value,
                      })
                    }
                    required
                  />
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
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {currentCourse.id ? "Update Course" : "Add Course"}
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
                Are you sure you want to delete this course?
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

export default Courses;
