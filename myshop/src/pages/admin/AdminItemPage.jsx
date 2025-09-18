import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, saveItem, uploadItemImage } from "../../api"; // your api.js

export default function AdminItemPage() {
  const { id } = useParams(); // undefined → create, defined → edit
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
    image: null,
    imagePath: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch item if editing
  useEffect(() => {
    if (!id || !token) return;

    setLoading(true);
    getItem(id, token)
      .then((data) =>
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
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
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
      const payload = {
        name: formData.name,
        brand: formData.brand,
        type: formData.type,
        description: formData.description,
        warranty: formData.warranty,
        price: formData.price,
        stockQty: formData.stockQty,
      };

      const savedItem = await saveItem(id, payload, token);

      if (formData.image) {
        await uploadItemImage(savedItem.id, formData.image, token);
      }

      navigate("/items"); // go back to items list
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
          src={`https://demo-deployment-ervl.onrender.com${formData.imagePath}`}
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
          placeholder="Type"
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
