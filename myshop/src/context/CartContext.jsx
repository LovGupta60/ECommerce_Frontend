import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token || isAdmin) {
        setCart([]); // ✅ Don't fetch for admins
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get("https://demo-deployment-ervl.onrender.com/cart", { headers });
      setCart(res.data.items);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const addToCart = async (itemId, qty = 1) => {
    try {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token || isAdmin) {
        alert("Admins cannot use cart.");
        return false;
      }
      const headers = { Authorization: `Bearer ${token}` };
  await axios.post(`https://demo-deployment-ervl.onrender.com/cart`, { itemId, qty }, { headers });
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to add to cart", err);
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token || isAdmin) return;

      const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`https://demo-deployment-ervl.onrender.com/cart/item/${cartItemId}`, { headers });
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const updateQty = async (cartItemId, qty) => {
    try {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token || isAdmin) return;

      const headers = { Authorization: `Bearer ${token}` };
  await axios.put(`https://demo-deployment-ervl.onrender.com/cart/item/${cartItemId}?qty=${qty}`, null, { headers });
      await fetchCart();
    } catch (err) {
      console.error("Failed to update qty", err);
    }
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
