import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Results from "./pages/Results";
import Transcripts from "./pages/Transcripts";

const isAuthenticated = () =>
  localStorage.getItem("isAuthenticated") === "true";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        isAuthenticated() ? <Navigate to="/admin/students" /> : <Login />
      }
    />

    <Route
      path="/admin"
      element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
    >
      <Route path="students" element={<Students />} />
      <Route path="courses" element={<Courses />} />
      <Route path="results" element={<Results />} />
      <Route path="transcripts" element={<Transcripts />} />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
