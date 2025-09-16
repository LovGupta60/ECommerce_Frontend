import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function ItemDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem("token");
  let isAdmin = false;

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Array.isArray(payload.roles)) {
        isAdmin = payload.roles.includes("ROLE_ADMIN");
      } else if (typeof payload.roles === "string") {
        isAdmin = payload.roles.toUpperCase() === "ROLE_ADMIN";
      }
    }
  } catch (err) {
    console.error("Invalid token", err);
  }

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const url = isAdmin
          ? `http://localhost:8080/admin/items/get/${id}`
          : `http://localhost:8080/items/public/${id}`;
        const headers = isAdmin && token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("Failed to fetch item");

        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, isAdmin, token]);

  if (loading)
    return <div className="p-10 text-center animate-pulse">Loading item...</div>;

  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  if (!item) return <div className="p-10 text-center">Item not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Image */}
      {item.imagePath && (
        <Zoom>
          <img
            src={`http://localhost:8080${encodeURI(item.imagePath)}`}
            alt={item.name}
            className="w-full max-h-[500px] object-contain rounded-lg shadow-md mb-6"
          />
        </Zoom>
      )}

      {/* Item Details */}
      <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Brand:</span> {item.brand}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Type:</span> {item.type}
      </p>
      <p className="text-gray-700 mb-4">{item.description}</p>
      <p className="text-xl font-semibold mb-2">₹{item.price}</p>
      <p className="text-gray-500 mb-4">Stock: {item.stockQty}</p>

      {/* Add to Cart (only for non-admin users) */}
      {!isAdmin && (
        <button
          onClick={() => addToCart(item)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
