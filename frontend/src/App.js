import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import DocumentEditor from "./components/DocumentEditor";

import Login from "./components/Login"; 
import Register from "./components/Register"; 
import ForgotPassword from "./components/ForgotPassword";
import UserProfile from "./components/UserProfile"; 


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/document/:id" element={<DocumentEditor />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;

