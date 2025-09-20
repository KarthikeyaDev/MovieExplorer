
import React, { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   
  const [admin, setAdmin] = useState(null); 
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (token && userData && role) {
      const parsedUser = JSON.parse(userData);
      if (role === "admin") {
        setAdmin(parsedUser);
        setUser(null);
      } else {
        setUser(parsedUser);
        setAdmin(null);
      }
    }
    setLoading(false);
  }, []);

  
  const register = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return data; // registration success
    } catch (err) {
      console.error("Register error:", err.message);
      throw err;
    }
  };

  
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role); 

      
      if (data.user.role === "admin") {
        setAdmin(data.user);
        setUser(null);
      } else {
        setUser(data.user);
        setAdmin(null);
      }

      return data.user;
    } catch (err) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
