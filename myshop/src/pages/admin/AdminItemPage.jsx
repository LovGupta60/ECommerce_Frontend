import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminItemPage() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "",
    description: "",
    warranty: "",
    price: "",
    stockQty: "",
    image: null, // file
    imagePath: "", // existing image path
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !token) return;

    setLoading(true);
    fetch(`http://localhost:8080/admin/items/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch item");
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name || "",
          brand: data.brand || "",
          type: data.type || "",
          description: data.description || "",
          warranty: data.warranty || "",
          price: data.price || "",
          stockQty: data.stockQty || "",
          image: null,
          imagePath: data.imagePath || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const itemPayload = {
        name: formData.name,
        brand: formData.brand,
        type: formData.type,
        description: formData.description,
        warranty: formData.warranty,
        price: formData.price,
        stockQty: formData.stockQty,
      };

      const itemRes = await fetch(
        id
          ? `http://localhost:8080/admin/items/${id}`
          : "http://localhost:8080/admin/items",
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemPayload),
        }
      );

      if (!itemRes.ok) {
        const msg = await itemRes.text();
        throw new Error(msg || "Failed to save item");
      }

      const savedItem = await itemRes.json();

      if (formData.image) {
        const data = new FormData();
        data.append("file", formData.image);

        const imgRes = await fetch(
          `http://localhost:8080/admin/items/${savedItem.id}/image`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: data,
          }
        );

        if (!imgRes.ok) {
          const msg = await imgRes.text();
          throw new Error(msg || "Failed to upload image");
        }
      }

      navigate("/items");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="p-4 sm:p-6 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit Item" : "Create Item"}
      </h2>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {formData.imagePath && (
        <img
          src={`http://localhost:8080${formData.imagePath}`}
          alt="Preview"
          className="w-full h-40 object-cover mb-2 rounded"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g. Electronics, Kitchen)"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="warranty"
          placeholder="Warranty"
          value={formData.warranty}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          name="stockQty"
          placeholder="Stock Quantity"
          value={formData.stockQty}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Saving..." : id ? "Update Item" : "Create Item"}
        </button>
      </form>
    </div>
  );
}
