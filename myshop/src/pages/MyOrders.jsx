import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState({});
  const [editing, setEditing] = useState({});
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
  const res = await fetch("https://demo-deployment-ervl.onrender.com/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (!orders.length) return <p className="p-6">You have no orders yet.</p>;

  const cancelOrder = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel order #${id}?`)) return;
    try {
      setCancelling((s) => ({ ...s, [id]: true }));
      const token = localStorage.getItem("token");
  const res = await fetch(`https://demo-deployment-ervl.onrender.com/orders/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to cancel order");
      }
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not cancel the order.");
    } finally {
      setCancelling((s) => ({ ...s, [id]: false }));
    }
  };

  const saveUpdates = async (id) => {
    if (!window.confirm(`Save changes for order #${id}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const { address, phoneNumber } = updates[id];
  const res = await fetch(`https://demo-deployment-ervl.onrender.com/orders/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address, phoneNumber }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setEditing((e) => ({ ...e, [id]: false }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not update order.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <ul className="space-y-6">
        {orders.map((order) => {
          const canEdit = order.status === "NEW" || order.status === "PROCESSING";

          return (
            <li key={order.id} className="border rounded-lg shadow p-4 space-y-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <span className="font-semibold">Order #{order.id}</span>
                  <p className="text-sm text-gray-600">
                    Placed at: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">Payment: {order.paymentMethod}</p>
                  {editing[order.id] ? (
                    <>
                      <p className="text-sm mt-1">
                        Address:{" "}
                        <input
                          type="text"
                          value={updates[order.id]?.address || ""}
                          onChange={(e) =>
                            setUpdates((u) => ({
                              ...u,
                              [order.id]: {
                                ...u[order.id],
                                address: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 w-full md:w-80"
                        />
                      </p>
                      <p className="text-sm mt-1">
                        Phone:{" "}
                        <input
                          type="text"
                          value={updates[order.id]?.phoneNumber || ""}
                          onChange={(e) =>
                            setUpdates((u) => ({
                              ...u,
                              [order.id]: {
                                ...u[order.id],
                                phoneNumber: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 w-full md:w-48"
                        />
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">Address: {order.address}</p>
                      <p className="text-sm">Phone: {order.phoneNumber}</p>
                    </>
                  )}
                </div>

                <div>
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

              <div className="flex gap-2 mt-2 flex-wrap">
                {canEdit && (
                  <>
                    {editing[order.id] ? (
                      <button
                        onClick={() => saveUpdates(order.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing((e) => ({ ...e, [order.id]: true }));
                          setUpdates((u) => ({
                            ...u,
                            [order.id]: {
                              address: order.address,
                              phoneNumber: order.phoneNumber,
                            },
                          }));
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={!!cancelling[order.id]}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      {cancelling[order.id] ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyOrders;
