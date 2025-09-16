import React from "react";

export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      <button
        className={`px-3 py-1 rounded ${active === "All" ? "bg-brand-500 text-white" : "bg-white border" }`}
        onClick={() => onChange("All")}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          className={`px-3 py-1 rounded ${active === cat ? "bg-brand-500 text-white" : "bg-white border" }`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
