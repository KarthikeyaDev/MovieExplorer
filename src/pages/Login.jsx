
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();
  const darkMode = mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);

      
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
