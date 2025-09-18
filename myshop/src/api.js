// src/api.js

// Base URL for the deployed backend. Use this for constructing API endpoints.
const API_BASE = "https://demo-deployment-ervl.onrender.com";
export default API_BASE;

// 🔹 User authentication
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

// 🔹 Admin item management (for AdminItemPage.jsx)
export async function getItem(id, token) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch item");
  return res.json();
}

export async function saveItem(id, data, token) {
  const method = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}/items/${id}` : `${API_BASE}/items`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save item");
  return res.json();
}

export async function uploadItemImage(id, file, token) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/items/${id}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return res.json();
}
