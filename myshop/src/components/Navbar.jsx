// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const totalQty = cart.reduce((s, p) => s + (p.qty || 1), 0);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <header className="bg-blue-600 shadow-md text-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-md">S</div>
          <div>
            <div className="font-bold text-lg leading-tight">Gupta Hosiery & Crockery</div>
            <div className="text-xs text-blue-200 -mt-0.5">Quality & Service</div>
            <div className="text-xs text-yellow-300 font-semibold mt-0.5">Since 1970</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
          {["/", "/items", "/about", "/contact"].map((path, index) => {
            const labels = ["Home", "Items", "About", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-semibold" : "text-white"}`
                }
              >
                {labels[index]}
              </NavLink>
            );
          })}
        </nav>

        {/* Cart + Auth */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition"
          >
            <FiShoppingCart size={18} />
            <span className="text-sm">Cart</span>
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalQty}
              </span>
            )}
          </Link>

          {!token ? (
            <NavLink
              to="/auth"
              className="bg-yellow-400 text-blue-800 px-4 py-2 rounded-md font-medium hover:bg-yellow-300 transition"
            >
              Login / Register
            </NavLink>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition"
              >
                <FiUser size={18} />
                <span>Profile</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-blue-600 rounded-md shadow-lg overflow-hidden">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-blue-50 transition" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-blue-50 transition" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-blue-50 transition">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
