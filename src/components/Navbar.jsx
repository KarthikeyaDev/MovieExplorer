
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { user, admin, loginWithGoogle, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            🎬 Movie Explorer
          </Link>

          {/* Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link to="/search" className="hover:text-indigo-500 dark:hover:text-indigo-400">
              Search
            </Link>
            <Link to="/admin-login" className="hover:text-indigo-500 dark:hover:text-indigo-400">
              Admin
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
            >
              {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth Section */}
            {!user && !admin ? (
              <button
                onClick={loginWithGoogle}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">
                  {user ? user.displayName : admin?.email}
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
      </div>
    </nav>
  );
};

export default Navbar;
