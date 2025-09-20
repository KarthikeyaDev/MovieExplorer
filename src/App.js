
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login"; 
import MovieSearch from "./components/MovieSearch";
import { useAuth } from "./context/AuthContext"; 
import { AuthProvider } from "./context/AuthContext"; 
import Register from "./pages/Register";


const PrivateRoute = ({ children, adminOnly }) => {
  const { user, admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-bold text-gray-700 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (adminOnly) {
    return admin ? children : <Navigate to="/login" />;
  }

  return (user || admin) ? children : <Navigate to="/login" />;
};

const App = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (filter) => {
    setFilters((prev) => ({ ...prev, [filter.type]: filter.value }));
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar onFilterChange={handleFilterChange} />
        <Routes>
          <Route path="/" element={<Home filters={filters} />} />
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
