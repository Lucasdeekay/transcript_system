import React, { useState, useEffect, createContext, useContext } from "react";
import AdminSidebar from "../components/Sidebar";

const API_URL = "http://127.0.0.1:8000/api/students/";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    matric_number: "",
    department: "",
    level: "",
  });
  // New state for notifications
  const [notification, setNotification] = useState({
    message: "",
    type: "", // 'success' or 'error'
    isVisible: false,
  });

  useEffect(() => {
    fetchStudents();
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
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      showNotification("Failed to fetch students.", "error");
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setStudentToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}${studentToDelete}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchStudents(); // Re-fetch students after deletion
      showNotification("Student deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting student:", error);
      showNotification("Failed to delete student.", "error");
    } finally {
      setShowConfirmModal(false);
      setStudentToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = currentStudent.id ? "PUT" : "POST";
      const url = currentStudent.id
        ? `${API_URL}${currentStudent.id}/`
        : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentStudent),
      });

      if (!response.ok) {
        // Attempt to read error message from backend if available
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            errorData.email ||
            `HTTP error! status: ${response.status}`
        );
      }

      fetchStudents(); // refresh list
      setShowModal(false);
      setCurrentStudent({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        matric_number: "",
        department: "",
        level: "",
      });
      showNotification(
        `Student ${method === "POST" ? "added" : "updated"} successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error saving student:", error);
      showNotification(`Failed to save student: ${error.message}`, "error");
    }
  };

  const filteredStudents = students.filter((s) => {
    const searchText = search.toLowerCase();

    if (!s) {
      return false;
    }

    const firstName = s.first_name || "";
    const lastName = s.last_name || "";
    const email = s.email || "";
    const matricNumber = s.matric_number || "";
    const department = s.department || "";
    const level =
      s.level !== null && s.level !== undefined ? String(s.level) : "";

    return (
      firstName.toLowerCase().includes(searchText) ||
      lastName.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      matricNumber.toLowerCase().includes(searchText) ||
      department.toLowerCase().includes(searchText) ||
      level.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold text-blue-700 flex items-center">
            <svg
              className="h-10 w-10 mr-3 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
            Student Management
          </h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
            onClick={() => {
              setCurrentStudent({
                id: null,
                first_name: "",
                last_name: "",
                email: "",
                matric_number: "",
                department: "",
                level: "",
              });
              setShowModal(true);
            }}
          >
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
            Add Student
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

        <div className="mb-6 w-full md:w-1/2">
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
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Search by name, email, matric no, department, or level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Matric No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  First Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Last Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Level
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
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.matric_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-colors duration-200 shadow-md"
                        onClick={() => handleEdit(student)}
                      >
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
                        onClick={() => handleDeleteClick(student.id)}
                      >
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
                    colSpan="7"
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Student Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {currentStudent.id ? "Edit Student" : "Add New Student"}
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

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="first_name"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={currentStudent.first_name}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        first_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="last_name"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={currentStudent.last_name}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        last_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={currentStudent.email}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="matric_number"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Matric Number
                  </label>
                  <input
                    type="text"
                    id="matric_number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={currentStudent.matric_number}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        matric_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="department"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={currentStudent.department}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        department: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="level"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Level
                  </label>
                  <input
                    type="number"
                    id="level"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={currentStudent.level}
                    onChange={(e) =>
                      setCurrentStudent({
                        ...currentStudent,
                        level: e.target.value,
                      })
                    }
                    required
                  />
                </div>
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
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {currentStudent.id ? "Update Student" : "Add Student"}
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
                Are you sure you want to delete this student?
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

export default Students;
