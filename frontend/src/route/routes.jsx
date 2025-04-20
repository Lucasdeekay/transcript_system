import React from "react";
import { Route, Switch } from "wouter";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Redirect from "../components/Redirect";
import { useAuth } from "../functions/Auth"; // updated path

import Students from "../pages/Students";
import Courses from "../pages/Courses";
import Results from "../pages/Results";
import Transcripts from "../pages/Transcripts";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Redirect to="/admin" /> : <Login />}
      </Route>

      <Route path="/admin">
        {isAuthenticated ? <Dashboard /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/students">
        {isAuthenticated ? <Students /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/courses">
        {isAuthenticated ? <Courses /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/results">
        {isAuthenticated ? <Results /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/transcripts">
        {isAuthenticated ? <Transcripts /> : <Redirect to="/" />}
      </Route>

      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default AppRoutes;
