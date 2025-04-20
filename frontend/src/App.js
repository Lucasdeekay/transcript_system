import React from "react";
import AppRoutes from "./route/routes";
import { Router } from "wouter";
import { AuthProvider } from "./functions/Auth"; // updated path

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
