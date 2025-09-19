import { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react"; // for nice arrows

// Utility to get random items
function getRandomItems(arr, count) {
  if (!Array.isArray(arr)) return [];
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Custom Arrow components
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-100"
  >
    <ChevronRight className="w-6 h-6 text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10 hover:bg-gray-100"
  >
    <ChevronLeft className="w-6 h-6 text-gray-700" />
  </button>
);

export default function FeaturedItemsSlider() {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("https://demo-deployment-ervl.onrender.com/items/public");
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.content || [];
        setFeatured(getRandomItems(items, 6));
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    }
    fetchItems();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1, // ✅ always show 1 at a time (desktop & mobile)
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div style={{ bottom: "-30px" }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-gray-400 rounded-full hover:bg-gray-600" />
    ),
  };

  return (
    <div className="relative p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Hot Deals</h2>
      <Slider {...settings}>
        {featured.map((item) => (
          <div key={item.id} className="p-2">
            <div className="border rounded-lg p-3 md:p-4 shadow hover:shadow-lg transition bg-white flex flex-col items-center">
              {item.imagePath && (
                <img
                  src={
                    item.imagePath.startsWith("http")
                      ? item.imagePath
                      : `https://res.cloudinary.com/YOUR_CLOUD_NAME/${encodeURIComponent(item.imagePath)}`
                  }
                  alt={item.name}
                  className="h-32 md:h-40 w-full object-contain mb-2 bg-gray-100 rounded"
                />
              )}
              <h3 className="font-semibold text-sm md:text-base text-center truncate w-full">
                {item.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 text-center truncate w-full">
                {item.brand} - {item.type}
              </p>
              <p className="text-xs md:text-sm text-center truncate w-full">
                {item.description}
              </p>
              <p className="font-medium mt-1 text-center">₹{item.price}</p>

              <div className="flex flex-col sm:flex-row gap-2 mt-3 w-full">
                <button
                  onClick={async () => {
                    const ok = await addToCart(item.id, 1);
                    if (!ok)
                      alert("Failed to add item to cart. Please login and try again.");
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex-1"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/items/${item.id}`)}
                  className="bg-yellow-500 text-blue-800 px-3 py-1 rounded hover:bg-yellow-400 text-sm flex-1"
                >
                  See More
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
