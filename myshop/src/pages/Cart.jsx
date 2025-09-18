import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState(""); // new
  const [phoneNumber, setPhoneNumber] = useState(""); // new
  const navigate = useNavigate();

  const handleQtyChange = (id, qty) => {
    if (qty > 0) updateQty(id, qty);
  };

  const total = cart.reduce((sum, c) => {
    const price = c.item?.price ?? c.product?.price ?? c.price ?? 0;
    return sum + price * c.qty;
  }, 0);

  const handleCheckout = async () => {
    if (!address || !phoneNumber) {
      setMessage("❌ Please provide both address and phone number");
      return;
    }

    if (paymentMethod === "ONLINE") {
      navigate("/payment", { state: { total, cart } });
      return;
    }

    // COD checkout
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
  const res = await fetch("https://demo-deployment-ervl.onrender.com/cart/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethod, address, phoneNumber }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      await res.json();
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0)
    return <p className="text-center mt-5">Your cart is empty.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <ul className="space-y-4">
        {cart.map((cartItem) => {
          const product = cartItem.item ?? cartItem.product ?? cartItem;
          const name = product?.name ?? product?.title ?? "Unknown Item";
          const price = product?.price ?? product?.cost ?? 0;
          let image = product?.imagePath ?? product?.image ?? product?.img;
          if (image && image.startsWith("/")) {
            image = `https://demo-deployment-ervl.onrender.com${image}`;
          }
          return (
            <li
              key={cartItem.id || `${product?.id || name}-${Math.random()}`}
              className="flex justify-between items-center border p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-20 h-20 object-contain rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
                <div>
                  <h2 className="font-semibold">{name}</h2>
                  <p>Price: ₹{price}</p>
                  <p>
                    Qty:
                    <input
                      type="number"
                      value={cartItem.qty}
                      min={1}
                      className="w-16 ml-2 border rounded px-1"
                      onChange={(e) =>
                        handleQtyChange(cartItem.id, parseInt(e.target.value))
                      }
                    />
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(cartItem.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 font-bold text-lg">Total: ₹{total}</p>

      {/* Address & Phone */}
      <div className="mt-4 space-y-2">
        <div>
          <label className="font-semibold">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="ml-2 border px-2 py-1 rounded w-full"
            placeholder="Enter your delivery address"
          />
        </div>
        <div>
          <label className="font-semibold">Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="ml-2 border px-2 py-1 rounded w-full"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-4">
        <label className="font-semibold">Payment Method: </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
};

export default Cart;
