// src/pages/Cart.jsx
import React, { useState, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showBillPreview, setShowBillPreview] = useState(false);

  const navigate = useNavigate();
  const billRef = useRef();

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    updateQty(id, newQty);
  };

  const total = cart.reduce((sum, c) => {
    const price = c.item?.price ?? c.product?.price ?? c.price ?? 0;
    return sum + price * c.qty;
  }, 0);

  const formatINR = (v) =>
    Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const downloadPDF = async () => {
    if (!billRef.current) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Could not generate PDF. CORS issue on images might cause this.");
    }
  };

  const handleCheckout = async () => {
    if (!address || !phoneNumber) {
      setMessage("❌ Please provide both address and phone number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("❌ Please enter a valid 10-digit phone number");
      return;
    }

    if (cart.length === 0) {
      setMessage("❌ Your cart is empty.");
      return;
    }

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
      setMessage("❌ Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0)
    return <p className="text-center mt-5 text-gray-600">🛒 Your cart is empty.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {/* Cart Items */}
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
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
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
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center mt-2 sm:mt-0 gap-1">
                <button
                  onClick={() => handleQtyChange(cartItem.id, cartItem.qty - 1)}
                  className="bg-gray-300 px-3 py-1 rounded-l hover:bg-gray-400"
                >
                  -
                </button>
                <input
                  type="number"
                  value={cartItem.qty}
                  min={1}
                  className="w-16 text-center border-t border-b border-gray-300"
                  onChange={(e) =>
                    handleQtyChange(cartItem.id, parseInt(e.target.value) || 1)
                  }
                />
                <button
                  onClick={() => handleQtyChange(cartItem.id, cartItem.qty + 1)}
                  className="bg-gray-300 px-3 py-1 rounded-r hover:bg-gray-400"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(cartItem.id)}
                className="mt-2 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      {/* Total */}
      <p className="mt-4 font-bold text-lg">Total (including all charges): ₹{formatINR(total)}</p>

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
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="ml-2 border px-2 py-1 rounded w-full"
            placeholder="Enter 10-digit phone number"
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

      {/* Buttons */}
      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          onClick={() => setShowBillPreview(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Preview Bill
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      {message && <p className="mt-4 text-red-600">{message}</p>}

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
            <button
              onClick={() => setShowBillPreview(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
            >
              ✖
            </button>
            <div ref={billRef}>
              <h2 className="text-xl font-bold mb-2">🛍️ Gupta Hosiery and Crockery Store Invoice </h2>
              <table className="w-full border-collapse mb-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Item</th>
                    <th className="border px-2 py-1 text-center">Qty</th>
                    <th className="border px-2 py-1 text-right">Price</th>
                    <th className="border px-2 py-1 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, i) => {
                    const product = c.item ?? c.product ?? c;
                    const name = product?.name ?? product?.title ?? "Unknown";
                    const price = Number(product?.price ?? product?.cost ?? 0);
                    return (
                      <tr key={c.id ?? product?.id ?? i}>
                        <td className="border px-2 py-1">{name}</td>
                        <td className="border px-2 py-1 text-center">{c.qty}</td>
                        <td className="border px-2 py-1 text-right">₹{formatINR(price)}</td>
                        <td className="border px-2 py-1 text-right">₹{formatINR(price * c.qty)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-right font-bold text-lg">
                Total (including all charges): ₹{formatINR(total)}
              </div>

              <div className="mt-4">
                <p>Address: {address}</p>
                <p>Phone: {phoneNumber}</p>
                <p>Payment: {paymentMethod}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download PDF
              </button>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Place Order
              </button>
              <button
                onClick={() => setShowBillPreview(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
