import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveItem, uploadItemImage, getItem } from "../../api"; 

export default function AdminItemPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    name: "", brand: "", type: "", description: "", warranty: "",
    price: "", stockQty: "", image: null, imagePath: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!id || !token) return;
    setLoading(true);
    getItem(id, token)
      .then((data) => setFormData({
        ...formData,
        ...data,
        image: null,
        imagePath: data.imagePath || ""
      }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError("Please login again.");
    setLoading(true);
    try {
      const savedItem = await saveItem(id, formData, token);
      if (formData.image) await uploadItemImage(savedItem.id, formData.image, token);
      navigate("/admin/items");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Item" : "Create Item"}</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {formData.imagePath && (
        <img src={formData.imagePath} alt="Preview" className="w-full h-40 object-cover mb-2 rounded" />
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        {["name","brand","type","description","warranty"].map(f => (
          <input key={f} type="text" name={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)}
            value={formData[f]} onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        ))}
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border p-2 w-full rounded"/>
        <input type="number" name="stockQty" placeholder="Stock Qty" value={formData.stockQty} onChange={handleChange} className="border p-2 w-full rounded"/>
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="border p-2 w-full rounded"/>
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {loading ? "Saving..." : id ? "Update Item" : "Create Item"}
        </button>
      </form>
    </div>
  );
}
