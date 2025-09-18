// Base URL for the deployed backend. Use this for constructing API endpoints.
const API_BASE = "https://demo-deployment-ervl.onrender.com";

export default API_BASE;

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const text = await response.text();
  try {
    return JSON.parse(text); // if backend sends JSON
  } catch {
    return text; // fallback plain string ("Registered")
  }
}

export async function loginAdmin(credentials) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}
