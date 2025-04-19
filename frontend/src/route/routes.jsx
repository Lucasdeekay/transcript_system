import React from "react";
import { Route, Switch } from "wouter";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Redirect from "../components/Redirect"; // our custom redirect

import Students from "../pages/Students";
import Courses from "../pages/Courses";
import Results from "../pages/Results";
import Transcripts from "../pages/Transcripts";

const isAuthenticated = () =>
  localStorage.getItem("isAuthenticated") === "true";

const AppRoutes = () => (
  <Switch>
    <Route path="/">
      {isAuthenticated() ? <Redirect to="/admin" /> : <Login />}
    </Route>

    <Route path="/admin">
      {isAuthenticated() ? <Dashboard /> : <Redirect to="/" />}
    </Route>

    {/* You can add these routes later when ready */}

    <Route path="/admin/students" component={Students} />
    <Route path="/admin/courses" component={Courses} />
    <Route path="/admin/results" component={Results} />
    <Route path="/admin/transcripts" component={Transcripts} />

    <Route path="*">
      <Redirect to="/" />
    </Route>
  </Switch>
);

export default AppRoutes;
