import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiClipboard, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const totalQty = cart.reduce((s, p) => s + (p.qty || 1), 0);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/auth");
  };

  const menuRef = useRef(null);
  const mobileRef = useRef(null);
  const mobileButtonRef = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      const clickedOnMobileButton = mobileButtonRef.current && mobileButtonRef.current.contains(e.target);
      if (mobileRef.current && !mobileRef.current.contains(e.target) && !clickedOnMobileButton) setMobileOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="bg-indigo-600 text-white sticky top-0 z-50 shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Mobile hamburger */}
        <div className="md:hidden mr-3 relative z-[9999]">
          <button
            ref={mobileButtonRef}
            type="button"
            onClick={() => setMobileOpen((s) => !s)}
            className="p-3 rounded-md bg-white text-indigo-600 relative"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="hidden sm:flex bg-white text-indigo-600 rounded-full w-10 h-10 sm:items-center sm:justify-center font-bold text-lg shadow-md flex-shrink-0">
            S
          </div>
          <div>
            <div className="font-bold text-lg text-white leading-tight">Gupta Hosiery & Crockery</div>
            <div className="text-xs text-indigo-200 -mt-0.5">Quality & Service</div>
            <div className="text-xs text-yellow-300 font-semibold mt-0.5">Since 1970</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
          {["/", "/items", "/about", "/contact"].map((path, index) => {
            const labels = ["Home", "Items", "About", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `hover:text-yellow-300 transition ${
                    isActive ? "text-yellow-300 font-semibold" : "text-white"
                  }`
                }
              >
                {labels[index]}
              </NavLink>
            );
          })}
        </nav>

        {/* Cart/Admin/Auth Buttons */}
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
            >
              <FiShoppingCart size={18} />
              <span className="text-sm">Cart</span>
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalQty}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
            >
              <FiClipboard size={18} />
              <span className="text-sm">Orders</span>
            </Link>
          )}

          {!token ? (
            <NavLink
              to="/auth"
              className="bg-yellow-400 text-indigo-800 px-4 py-2 rounded-md font-medium hover:bg-yellow-300 transition"
            >
              Login / Register
            </NavLink>
          ) : (
            <div className="hidden md:block relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                aria-expanded={menuOpen}
              >
                <FiUser size={18} />
                <span>Profile</span>
              </button>

              {menuOpen && (
                <div className="absolute right-2 sm:right-0 mt-2 min-w-[140px] max-w-[92vw] sm:w-48 bg-white text-indigo-600 rounded-md shadow-lg overflow-hidden z-[10000]">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  {!isAdmin && (
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div ref={mobileRef} className="md:hidden absolute left-0 right-0 top-full z-[9999] bg-white text-indigo-600 shadow pointer-events-auto">
          <div className="flex flex-col p-4 gap-2">
            <NavLink to="/" onClick={() => setMobileOpen(false)} className="py-2 border-b">Home</NavLink>
            <NavLink to="/items" onClick={() => setMobileOpen(false)} className="py-2 border-b">Items</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className="py-2 border-b">About</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="py-2 border-b">Contact</NavLink>

            {!isAdmin && (
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="py-2 border-b flex items-center gap-2"> 
                <FiShoppingCart /> Cart <span className="ml-auto bg-red-600 text-white text-xs px-2 rounded-full">{totalQty}</span>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin/orders" onClick={() => setMobileOpen(false)} className="py-2 border-b flex items-center gap-2">
                <FiClipboard /> Orders
              </Link>
            )}

            {!token ? (
              <NavLink to="/auth" onClick={() => setMobileOpen(false)} className="py-2 border-b">Login / Register</NavLink>
            ) : (
              <>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="py-2 border-b">My Profile</NavLink>
                {!isAdmin && (
                  <NavLink to="/orders" onClick={() => setMobileOpen(false)} className="py-2 border-b">My Orders</NavLink>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left py-2">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
