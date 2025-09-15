

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/Login";
import MovieSearch from "./components/MovieSearch";

const App = () => {
  const [filters, setFilters] = useState({}); // Filter state lifted here

  const handleFilterChange = (filter) => {
    setFilters((prev) => ({ ...prev, [filter.type]: filter.value }));
  };

  return (
    <Router>
      <Navbar onFilterChange={handleFilterChange} />
      <Routes>
        <Route path="/" element={<Home filters={filters} />} />
        <Route path="/search" element={<MovieSearch />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
