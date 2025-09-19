// src/components/FeaturedItemsSlider.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedItemsSlider = ({ featuredItems }) => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // default for desktop
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1, // ✅ show only 1 on mobile
        },
      },
    ],
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
        Hot Deals
      </h2>

      <Slider {...settings}>
        {featuredItems.map((item, index) => (
          <div key={index} className="p-2">
            <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
              <img
                src={
                  item.imagePath?.startsWith("http")
                    ? item.imagePath
                    : "/placeholder.png" // fallback image
                }
                alt={item.name}
                className="h-32 md:h-40 w-full object-contain mb-2 bg-gray-100 rounded"
              />
              <h3 className="font-semibold text-sm md:text-base text-center line-clamp-2">
                {item.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 text-center line-clamp-1">
                {item.brand} - {item.type}
              </p>
              <p className="text-xs md:text-sm text-center line-clamp-2">
                {item.description}
              </p>
              <span className="text-green-600 font-bold mt-2">
                ₹{item.price}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedItemsSlider;
