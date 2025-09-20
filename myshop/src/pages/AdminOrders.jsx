import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusById, setStatusById] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://demo-deployment-ervl.onrender.com/admin/orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();

        // Sort descending by createdAt
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedData);

        const map = {};
        (sortedData || []).forEach((o) => {
          map[o.id] = o.status;
        });
        setStatusById(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (order) => {
    const newStatus = statusById[order.id] || order.status;
    if (newStatus === order.status) return;
    if (!window.confirm(`Change order #${order.id} status to ${newStatus}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://demo-deployment-ervl.onrender.com/admin/orders/${order.id}/status?status=${encodeURIComponent(newStatus)}`,
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setStatusById((s) => ({ ...s, [order.id]: updated.status }));
    } catch (err) {
      console.error(err);
      alert("Could not update order status.");
    }
  };

  const formatTime = (isoString) => {
    const dt = new Date(isoString);
    // IST offset +5:30
    const istOffset = 5.5 * 60;
    const localTime = new Date(dt.getTime() + istOffset * 60 * 1000);

    return localTime.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (!orders.length) return <p className="p-6">No orders yet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order.id} className="border rounded-lg shadow p-4 space-y-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <span className="font-semibold">Order #{order.id}</span>
                <p className="text-sm text-gray-600">
                  Placed at: {formatTime(order.createdAt)}
                </p>
                <p className="text-sm">Payment: {order.paymentMethod}</p>
                <p className="text-sm">Address: {order.address}</p>
                <p className="text-sm">Phone: {order.phoneNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusById[order.id] || order.status}
                  onChange={(e) =>
                    setStatusById((s) => ({ ...s, [order.id]: e.target.value }))
                  }
                  className="border rounded px-2 py-1 bg-white text-sm"
                >
                  <option value="NEW">NEW</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="ON_THE_WAY">ON_THE_WAY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <button
                  onClick={() => updateStatus(order)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                >
                  Update
                </button>
              </div>
            </div>

            <ul className="pl-4 list-disc mt-2">
              {order.items.map((oi, idx) => (
                <li key={idx}>
                  {oi.itemName} × {oi.qty} = ₹{oi.price * oi.qty}
                </li>
              ))}
            </ul>
            <p className="font-bold">
              Total: ₹{order.items.reduce((sum, i) => sum + i.price * i.qty, 0)}
            </p>

            <div className="mt-1">
              <span
                className={`px-3 py-1 rounded text-white ${
                  order.status === "DELIVERED"
                    ? "bg-green-600"
                    : order.status === "ON_THE_WAY"
                    ? "bg-blue-500"
                    : order.status === "CANCELLED"
                    ? "bg-gray-500"
                    : "bg-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;
