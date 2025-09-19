// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemsDetails"; // ✅ Ensure filename matches exactly
import About from "./pages/About";
import Contact from "./pages/Contact";
import CartPage from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Auth from "./pages/Auth";
import Profile from "./pages/ProfilePage";

// Admin pages
import AdminItemPage from "./pages/admin/AdminItemPage.jsx"; // ✅ Default export
import AdminOrders from "./pages/AdminOrders.jsx"; // ✅ Default export
import Payment from "./pages/Payment.jsx"; // ✅ Default export

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/payment" element={<Payment />} />

            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin routes */}
            <Route path="/admin/items" element={<AdminItemPage />} />
            <Route path="/admin/items/edit/:id" element={<AdminItemPage />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} MyShop — Your friendly neighborhood shop
        </div>
      </footer>
    </div>
  );
}
