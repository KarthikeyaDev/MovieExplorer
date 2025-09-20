
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, admin, loading } = useAuth();

  if (loading) return null; 

  if (adminOnly) {
    return admin ? children : <Navigate to="/login" />;
  }

  return user || admin ? children : <Navigate to="/login" />;
}
