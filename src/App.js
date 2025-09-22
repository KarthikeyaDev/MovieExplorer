

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SearchToggleProvider } from "./context/SearchToggleContext"; 

const PrivateRoute = ({ children, adminOnly }) => {
  const { user, admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-bold text-gray-700 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (adminOnly) return admin ? children : <Navigate to="/login" />;
  return user || admin ? children : <Navigate to="/login" />;
};

const App = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (filter) => {
    setFilters((prev) => ({ ...prev, [filter.type]: filter.value }));
  };

  return (
    <AuthProvider>
      <SearchToggleProvider>
        <Router>
          <Navbar onFilterChange={handleFilterChange} />

          <Routes>
            {/* Home handles search internally */}
            <Route path="/" element={<Home filters={filters} />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Admin Dashboard protected */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch-all redirects to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </SearchToggleProvider>
    </AuthProvider>
  );
};

export default App;
