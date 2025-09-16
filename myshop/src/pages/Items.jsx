import React, { useEffect, useMemo, useState, useRef } from "react";
import CategoryTabs from "../components/CategoryTabs";
import { useCart } from "../context/CartContext";

export default function Items() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const token = localStorage.getItem("token");

  // Check admin
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

  // Fetch items from API (always full list)
  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/items/public`;
      let headers = {};

      if (isAdmin) {
        url = `http://localhost:8080/admin/items/getall`;
        headers = { Authorization: `Bearer ${token}` };
      }

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Failed to fetch items");

      const data = await res.json();
      setProducts(data.content || data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle live search with debounce (frontend filter only)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  // Compute categories dynamically
  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => (p.type || "Other").trim())
        .map((type) => type.toLowerCase())
        .filter((type) => type !== "all")
    );
    return Array.from(set).map((t) => t.charAt(0).toUpperCase() + t.slice(1));
  }, [products]);

  // ✅ Apply both search + category filter
  const filtered = products.filter((p) => {
    const matchCategory =
      active === "All" ||
      (p.type || "Other").trim().toLowerCase() === active.toLowerCase();

    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    return matchCategory && matchSearch;
  });

  // Delete item (admin)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:8080/admin/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchItems(); // refetch full list
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <div className="p-10 text-center animate-pulse">Loading items...</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Items</h2>
        {isAdmin && (
          <button
            onClick={() => (window.location.href = "/admin/items")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Create Item
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by product name..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <CategoryTabs categories={categories} active={active} onChange={setActive} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 bg-white shadow-md relative"
          >
            {p.imagePath && (
              <img
                src={`http://localhost:8080${encodeURI(p.imagePath)}`}
                alt={p.name}
                className="w-full h-52 object-contain mb-2 rounded bg-gray-100"
              />
            )}
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600">
              {p.brand} - {p.type}
            </p>
            <p className="text-sm">{p.description}</p>
            <p className="mt-1 font-medium">₹{p.price}</p>
            <p className="text-xs text-gray-500">Stock: {p.stockQty}</p>

            <div className="flex gap-2 mt-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/items/edit/${p.id}`)
                    }
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => (window.location.href = `/items/${p.id}`)}
                    className="bg-yellow-500 text-blue-800 px-2 py-1 rounded hover:bg-yellow-400 text-sm"
                  >
                    See More
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
