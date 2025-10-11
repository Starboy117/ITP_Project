import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    // Not admin → redirect to home
    return <Navigate to="/" replace />;
  }

  return children; // User is allowed → render the component
};

export default ProtectedRoute;
