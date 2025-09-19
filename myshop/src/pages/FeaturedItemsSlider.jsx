import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

function getRandomItems(arr, count) {
  if (!Array.isArray(arr)) return [];
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function FeaturedItemsSlider() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("https://demo-deployment-ervl.onrender.com/items/public");
        const data = await res.json();

        const items = Array.isArray(data) ? data : data.content || [];
        const randomItems = getRandomItems(items, 6);
        setFeatured(randomItems);

        console.log("Slider items:", items);
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
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Featured Products</h2>
      <Slider {...settings}>
        {featured.map((item) => (
          <div key={item.id} className="p-2">
            <Link to={`/items/${item.id}`}>
              <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white cursor-pointer">
                {item.imagePath && (
                  <img
                    src={`https://demo-deployment-ervl.onrender.com${encodeURI(item.imagePath)}`}
                    alt={item.name}
                    className="h-40 w-full object-contain mb-2 bg-gray-100 rounded"
                  />
                )}
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.brand} - {item.type}
                </p>
                <p className="text-sm">{item.description}</p>
                <p className="font-medium mt-1">₹{item.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
