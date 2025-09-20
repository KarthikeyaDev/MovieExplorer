
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getProfile(token) {
  const res = await fetch(`${API}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
