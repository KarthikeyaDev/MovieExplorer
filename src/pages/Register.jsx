
import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Register() {
   const {user, admin, login, register, logout } = useAuth(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.token) navigate("/");
    else alert(res.message || "Registration failed");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
