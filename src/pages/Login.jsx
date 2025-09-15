

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

const AdminLogin = () => {
  const { mode, toggleTheme } = useThemeContext();
  const darkMode = mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email !== "admin@example.com") {
        setError("Not authorized as admin");
        return;
      }
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-sm">{darkMode ? "Dark" : "Light"}</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 cursor-pointer"
            />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-800 px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;


