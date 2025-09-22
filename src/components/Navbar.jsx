

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import FilterBar from "./FilterBar";
import { useSearchToggle } from "../context/SearchToggleContext";

const Navbar = ({ onFilterChange }) => {
  const { user, admin, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const darkMode = mode === "dark";
  const { toggleSearch } = useSearchToggle(); 

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg p-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-yellow-300 transition"
          >
            Movie Explorer
          </Link>
        </div>

        
        <div className="flex flex-1 items-center justify-center space-x-4 w-full md:w-auto">
          <Link to="/" className="hover:text-yellow-300 transition font-medium">
            Home
          </Link>

          
          <button
            onClick={toggleSearch} 
            className="hover:text-yellow-300 transition font-medium"
          >
            Search
          </button>

          <div className="w-40">
            <FilterBar onFilterChange={onFilterChange} />
          </div>

          {admin && (
            <Link
              to="/admin-dashboard"
              className="hover:text-yellow-300 transition font-medium"
            >
              Admin Dashboard
            </Link>
          )}
        </div>

        
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white text-gray-700 hover:scale-110 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!user && !admin ? (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-400 text-gray-900 font-medium rounded-lg hover:bg-green-500 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {user ? user.name : admin?.role}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
