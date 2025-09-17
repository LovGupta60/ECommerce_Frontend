import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return <h2 className="text-center mt-4">Your cart is empty 🛒</h2>;
  }

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      <div className="row">
        {cartItems.map((item) => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card h-100">
              <img
                src={
                  item.imagePath
                    ? `http://localhost:8080/${item.imagePath}`
                    : "/placeholder.png"
                }
                className="card-img-top"
                alt={item.name}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.qty}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
