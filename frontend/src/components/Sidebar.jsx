import { useLocation, Link } from "wouter";
import { useAuth } from "../functions/Auth";

const AdminSidebar = () => {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/"); // Redirect to home page after logout
  };

  return (
    // Sidebar container with dark background, text color, padding, and fixed width.
    // min-h-screen ensures it takes full viewport height.
    // shadow-xl provides a strong shadow for visual separation.
    <div className="bg-gray-800 text-white p-6 min-h-screen w-64 shadow-xl flex flex-col font-inter">
      {/* Admin Panel heading */}
      <h4 className="text-center text-2xl font-semibold mb-8 text-blue-300">
        Admin Panel
      </h4>

      {/* Navigation list */}
      <ul className="flex flex-col space-y-3 flex-grow">
        {/* Manage Students Link */}
        <li>
          <Link
            href="/admin/students"
            className="flex items-center text-white hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out group"
          >
            {/* Inline SVG for FaUserGraduate */}
            <svg
              className="h-5 w-5 mr-3 text-blue-400 group-hover:text-white transition-colors duration-200"
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
            Manage Students
          </Link>
        </li>

        {/* Manage Courses Link */}
        <li>
          <Link
            href="/admin/courses"
            className="flex items-center text-white hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out group"
          >
            {/* Inline SVG for FaBook */}
            <svg
              className="h-5 w-5 mr-3 text-blue-400 group-hover:text-white transition-colors duration-200"
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
            Manage Courses
          </Link>
        </li>

        {/* Manage Results Link */}
        <li>
          <Link
            href="/admin/results"
            className="flex items-center text-white hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out group"
          >
            {/* Inline SVG for FaFileAlt */}
            <svg
              className="h-5 w-5 mr-3 text-blue-400 group-hover:text-white transition-colors duration-200"
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
            Manage Results
          </Link>
        </li>

        {/* Generate Transcripts Link */}
        <li>
          <Link
            href="/admin/transcripts"
            className="flex items-center text-white hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out group"
          >
            {/* Inline SVG for FaFileAlt */}
            <svg
              className="h-5 w-5 mr-3 text-blue-400 group-hover:text-white transition-colors duration-200"
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
            Generate Transcripts
          </Link>
        </li>
      </ul>

      {/* Logout button */}
      <div className="mt-auto pt-6">
        {" "}
        {/* Use mt-auto to push logout to the bottom */}
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out shadow-lg shadow-red-500/50 flex items-center justify-center"
          onClick={handleLogout}
        >
          {/* Inline SVG for FaSignOutAlt */}
          <svg
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            ></path>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
