import React from "react";
import AppRoutes from "./route/routes";
import { Router } from "wouter";

 function App(){
   return (
     <Router>
       <AppRoutes />
     </Router>
   );
 }

export default App;
