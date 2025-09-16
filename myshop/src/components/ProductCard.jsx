import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={product.img} alt={product.name} className="object-cover w-full h-full" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">₹{product.price}</div>
          <button
            onClick={() => onAdd(product)}
            className="px-3 py-1 bg-brand-500 text-white rounded hover:opacity-95"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
