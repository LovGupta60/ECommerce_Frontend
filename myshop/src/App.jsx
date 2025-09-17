import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemsDetails"; // ✅ User "See More" page
import About from "./pages/About";
import Contact from "./pages/Contact";
import CartPage from "./pages/Cart"; // ✅ Cart page
import MyOrders from "./pages/MyOrders"; // ✅ User Orders page
import Auth from "./pages/Auth";
import Profile from "./pages/ProfilePage";
import AdminItemPage from "./pages/admin/AdminItemPage"; // ✅ Admin page
import AdminOrders from "./pages/AdminOrders"; // ✅ Admin Orders page
import Payment from "./pages/Payment"; // ✅ New Payment page

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} /> {/* ✅ Cart */}
            <Route path="/orders" element={<MyOrders />} /> {/* ✅ Orders */}
            <Route path="/payment" element={<Payment />} /> {/* ✅ Payment */}

            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin routes */}
            <Route path="/admin/items" element={<AdminItemPage />} />
            <Route path="/admin/items/edit/:id" element={<AdminItemPage />} />
            <Route path="/admin/orders" element={<AdminOrders />} /> {/* ✅ Admin Orders */}
          </Routes>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto text-center text-sm text-gray-600">
          © {new Date().getFullYear()} MyShop — Your friendly neighborhood shop
        </div>
      </footer>
    </div>
  );
}
