import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state || !state.total) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">⚠ Invalid payment session.</p>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go back to Cart
        </button>
      </div>
    );
  }

  const { total, cart } = state;

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/cart/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethod: "ONLINE" }), // mark as online payment
      });

      if (!res.ok) throw new Error("Payment/Checkout failed");

      await res.json();
      navigate("/orders", { replace: true });
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="p-4 sm:p-6 w-full max-w-md mx-auto border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Payment</h1>
      <p className="text-lg font-semibold mb-2">Amount to Pay: ₹{total}</p>
      <p className="text-sm text-gray-600 mb-4">
        This is a dummy payment screen. In future, integrate Razorpay/Stripe here.
      </p>

      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <button
        onClick={() => navigate("/cart")}
        className="w-full mt-3 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
      >
        Cancel & Go Back
      </button>
    </div>
  );
};

export default Payment;
