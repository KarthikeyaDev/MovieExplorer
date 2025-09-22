

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const { mode } = useThemeContext();
  const darkMode = mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  // Forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    try {
      const data = await forgotPassword(forgotEmail);
      setForgotMsg(`Reset link sent: ${data.resetUrl}`);
    } catch (err) {
      setForgotMsg(err.message || "Failed to send reset link");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500"
                : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-blue-500"
            }`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-blue-500"
                : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-blue-500"
            }`}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setForgotOpen(!forgotOpen);
              setForgotMsg("");
              setForgotEmail("");
            }}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Forgot Password Form */}
        {forgotOpen && (
          <div
            className={`mt-4 p-4 rounded-xl border ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-green-500"
                    : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-green-500"
                }`}
              />
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Send Reset Link
              </button>
            </form>
            {forgotMsg && (
              <p className="text-sm mt-2 text-blue-400 break-words">{forgotMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
