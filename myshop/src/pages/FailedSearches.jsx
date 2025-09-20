// src/pages/admin/FailedSearches.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FailedSearches() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFailedSearches = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Admin token not found. Please login.");

      const res = await axios.get(
        "https://demo-deployment-ervl.onrender.com/admin/search-history/failed",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSearches(res.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch searches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFailedSearches();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all failed searches?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        "https://demo-deployment-ervl.onrender.com/admin/search-history/failed/clear",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearches([]); // clear frontend state
    } catch (err) {
      console.error(err);
      alert("Failed to clear history: " + (err.message || ""));
    }
  };

  if (loading) return <div className="p-4 text-indigo-700">Loading failed searches...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-indigo-700">Failed Searches</h2>
        {searches.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear History
          </button>
        )}
      </div>

      {searches.length === 0 ? (
        <div className="text-gray-600">No failed searches found.</div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full min-w-[500px] border-collapse">
            <thead className="bg-indigo-100">
              <tr>
                <th className="p-3 border-b text-left">#</th>
                <th className="p-3 border-b text-left">Keyword</th>
                <th className="p-3 border-b text-left">Searched At</th>
              </tr>
            </thead>
            <tbody>
              {searches
                .sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt))
                .map((search, index) => (
                  <tr key={search.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{search.keyword}</td>
                    <td className="p-3 border-b">{new Date(search.searchedAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
