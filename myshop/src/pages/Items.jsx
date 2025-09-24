import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";
import { useCart } from "../context/CartContext";

export default function Items() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");
 useEffect(() => {
  if (!token) {
    localStorage.clear();
    navigate("/login");
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      // Token expired
      localStorage.clear();
      navigate("/login");
    }
  } catch (err) {
    // Invalid token
    console.error("Invalid token", err);
    localStorage.clear();
    navigate("/login");
  }
}, [token, navigate]);

  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const priceOptions = [
    { label: "Under ₹500", value: 500 },
    { label: "Under ₹1000", value: 1000 },
    { label: "Under ₹2000", value: 2000 },
    { label: "Under ₹4000", value: 4000 },
    { label: "Under ₹10000", value: 10000 },
    { label: "Under ₹15000", value: 15000 },
    { label: "Under ₹20000", value: 20000 },
  ];

  // Check token for admin
  useEffect(() => {
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(
          Array.isArray(payload.roles)
            ? payload.roles.includes("ROLE_ADMIN")
            : payload.roles.toUpperCase() === "ROLE_ADMIN"
        );
      }
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, [token]);

  // Fetch items
  const fetchItems = async (query = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);

      const url = isAdmin
        ? "https://demo-deployment-ervl.onrender.com/admin/items/getall"
        : `https://demo-deployment-ervl.onrender.com/items/public?${params.toString()}`;

      const headers = isAdmin ? { Authorization: `Bearer ${token}` } : {};
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

  // Use searchQuery from Home page
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchInput(location.state.searchQuery);
      fetchItems(location.state.searchQuery);
    } else {
      fetchItems();
    }
  }, [location.state, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setSearch(searchInput);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      fetchItems(searchInput);
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, isAdmin]);

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const categories = useMemo(() => {
    const set = new Set(
      products
        .map((p) => (p.type || "Other").trim().toLowerCase())
        .filter((t) => t !== "all")
    );
    return Array.from(set).map(
      (t) => t.charAt(0).toUpperCase() + t.slice(1)
    );
  }, [products]);

  // Filter products based on category, search, price, and stock
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        active === "All" ||
        (p.type || "Other").trim().toLowerCase() === active.toLowerCase();

      const matchSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

      const matchPrice = !priceFilter || p.price <= Number(priceFilter);

      const matchStock = isAdmin || true; // Show out-of-stock items for users

      return matchCategory && matchSearch && matchPrice && matchStock;
    });
  }, [products, active, search, priceFilter, isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(
        `https://demo-deployment-ervl.onrender.com/admin/items/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      fetchItems(searchInput);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">Loading items...</div>
    );
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Items</h2>
        {isAdmin && (
          <button
            onClick={() => navigate("/admin/items")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Create Item
          </button>
        )}
      </div>

      <input
        type="text"
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search by product name or brand..."
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {/* Toggle Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filters (hidden until clicked) */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <CategoryTabs
            categories={categories}
            active={active}
            onChange={setActive}
          />

          {/* Price Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {priceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceFilter(opt.value)}
                className={`px-3 py-1 rounded border text-sm ${
                  priceFilter == opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
            {priceFilter && (
              <button
                onClick={() => setPriceFilter("")}
                className="px-3 py-1 rounded border bg-red-100 hover:bg-red-200 text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`border rounded-lg p-4 bg-white shadow-md relative ${
              p.stockQty === 0 ? "opacity-80" : ""
            }`}
          >
            {/* 🔴 Out of Stock Badge */}
            {p.stockQty === 0 && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </div>
            )}

            {p.imagePath && (
              <img
                src={
                  p.imagePath.startsWith("http")
                    ? p.imagePath
                    : `https://demo-deployment-ervl.onrender.com${p.imagePath}`
                }
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
                    onClick={() => navigate(`/admin/items/edit/${p.id}`)}
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
                  {p.stockQty > 0 ? (
                    <button
                      onClick={() => {
                        if (!token) {
                          navigate("/auth");
                          return;
                        }
                        addToCart(p.id, 1);
                      }}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="text-red-600 font-semibold self-center">
                      Out of Stock
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/items/${p.id}`)}
                    className="bg-yellow-500 text-blue-800 px-2 py-1 rounded hover:bg-yellow-400 text-sm"
                  >
                    Get Details
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
