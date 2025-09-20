import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: get token and role
  const getAuth = () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return { token, isAdmin };
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const { token, isAdmin } = getAuth();
      if (!token || isAdmin) {
        setCart([]);
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(
        "https://demo-deployment-ervl.onrender.com/cart",
        { headers }
      );
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (itemId, qty = 1) => {
    try {
      const { token, isAdmin } = getAuth();
      if (!token) {
        alert("Please login to add items to cart.");
        return false;
      }
      if (isAdmin) {
        alert("Admins cannot use cart.");
        return false;
      }
      if (!itemId) {
        console.error("addToCart called without itemId");
        return false;
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        "https://demo-deployment-ervl.onrender.com/cart",
        { itemId, qty },
        { headers }
      );

      await fetchCart();
      return true;
    } catch (err) {
      console.error("Failed to add to cart", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add to cart. Check your login.");
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const { token, isAdmin } = getAuth();
      if (!token || isAdmin) return;

      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(
        `https://demo-deployment-ervl.onrender.com/cart/item/${cartItemId}`,
        { headers }
      );

      await fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  // Update quantity
  const updateQty = async (cartItemId, qty) => {
    try {
      const { token, isAdmin } = getAuth();
      if (!token || isAdmin) return;

      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `https://demo-deployment-ervl.onrender.com/cart/item/${cartItemId}?qty=${qty}`,
        null,
        { headers }
      );

      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update quantity.");
    }
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
