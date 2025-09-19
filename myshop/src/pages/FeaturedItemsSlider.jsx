import { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function getRandomItems(arr, count) {
  if (!Array.isArray(arr)) return [];
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: true, centerPadding: "40px" } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Featured Products</h2>
      <Slider {...settings}>
        {featured.map((item) => (
          <div key={item.id} className="p-2">
            <div className="border rounded-lg p-3 md:p-4 shadow hover:shadow-lg transition bg-white flex flex-col items-center">
              {item.imagePath && (
                <img
                  src={`https://demo-deployment-ervl.onrender.com${encodeURI(item.imagePath)}`}
                  alt={item.name}
                  className="h-32 md:h-40 w-full object-contain mb-2 bg-gray-100 rounded"
                />
              )}
              <h3 className="font-semibold text-sm md:text-base text-center truncate w-full">{item.name}</h3>
              <p className="text-xs md:text-sm text-gray-500 text-center truncate w-full">
                {item.brand} - {item.type}
              </p>
              <p className="text-xs md:text-sm text-center truncate w-full">{item.description}</p>
              <p className="font-medium mt-1 text-center">₹{item.price}</p>

              <div className="flex flex-col sm:flex-row gap-2 mt-3 w-full">
                <button
                  onClick={async () => {
                    const ok = await addToCart(item.id, 1);
                    if (!ok) alert("Failed to add item to cart. Please login and try again.");
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
