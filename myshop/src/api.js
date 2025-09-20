const API_BASE = "https://demo-deployment-ervl.onrender.com";

/* ------------------------ AUTH ------------------------ */

// Admin login
export async function loginAdmin(credentials) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Admin login failed");
  }
  return res.json(); // returns { token, ... }
}

/* ------------------------ ITEMS CRUD ------------------------ */

// Create or update an item
export async function saveItem(id, payload, token) {
  const url = id ? `/admin/items/${id}` : "/admin/items";

  const res = await fetch(`${API_BASE}${url}`, {
    method: id ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to save item");
  }

  return res.json();
}

// Upload item image
export async function uploadItemImage(itemId, file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/admin/items/${itemId}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to upload image");
  }

  return res.json();
}

// Get a single item
export async function getItem(id, token) {
  const res = await fetch(`${API_BASE}/admin/items/get/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch item");
  }

  return res.json();
}

// Get all items
export async function getAllItems(token) {
  const res = await fetch(`${API_BASE}/admin/items/getall`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch items");
  }

  return res.json();
}

// Delete item
export async function deleteItem(id, token) {
  const res = await fetch(`${API_BASE}/admin/items/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to delete item");
  }

  return true; // DELETE returns 204, no JSON
}

/* ------------------------ OFFERS CRUD ------------------------ */

// Public: get all offers
export async function getAllOffers() {
  const res = await fetch(`${API_BASE}/offers/public/all`);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch offers");
  }
  return res.json();
}

// Admin: create or update offer
export async function saveOffer(id, payload, token) {
  const url = id ? `/admin/offers/${id}` : "/admin/offers";
  const method = id ? "PUT" : "POST";

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to save offer");
  }

  return res.json();
}

// Admin: delete offer
export async function deleteOffer(id, token) {
  const res = await fetch(`${API_BASE}/admin/offers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to delete offer");
  }

  return true; // 204 No Content
}

// Admin: upload offer image
export async function uploadOfferImage(offerId, file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/admin/offers/${offerId}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to upload image");
  }

  return res.json();
}
