import React from "react";
import { Link } from "react-router-dom";
import BrandSlider from "../components/BrandSlider";
import BrandMarquee from "../components/BrandMarquee";

const outlets = [
  {
    id: 1,
    name: "Gupta Hosiery & Crockery - Main Branch",
    address: "Kaiper Ganj, Kotwali Road, Rae Bareli",
    description:
      "Our flagship store, offering the full range of products with personalized and friendly service.",
    photo: "images/GH.png",
    openOn: "Mon - Sat: 9:00 AM - 8:00 PM",
    since: "1970",
  },
  {
    id: 2,
    name: "Gupta Luggage",
    address: "Sabzi Mandi road,infront of top shop, Rae Bareli",
    description:
      "Ideal for stylish and durable bags, offering a curated selection perfect for every occasion and lifestyle.",
    photo: "data:image/jpeg;base64,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",
    openOn: "Wed - Mon: 10:00 AM - 9:00 PM",
    since: "2011",
  },
  {
    id: 3,
    name: "Gupta Kitchen Appliances",
    address: "Caanal road,infront of Vishal Mega Mart,Rae bareli",
    description:
      "A modern, spacious outlet specializing in kitchen appliances and cleaning essentials.",
    photo: "/images/GKA.png",
    openOn: "Wed-Mon: 10:00 AM - 9:00 PM",
    since: "2017",
  },
];

export default function Home() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-8 bg-gray-50 space-y-12">
      {/* Hero Section */}
  <section className="flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-white to-gray-100 p-6 rounded-lg shadow-lg">
        <div className="text-center lg:text-left max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 leading-tight">
            Welcome to{" "}
            <span className="text-brand-500 underline decoration-brand-300 decoration-4">
              Gupta Hosiery and Crockery Store
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-gray-700 text-base sm:text-lg md:text-lg leading-relaxed tracking-wide">
            Small shop. Big heart. Discover our curated selection of kitchen
            appliances, hosiery, and home goods designed to brighten your daily
            life.
          </p>
          <div className="mt-6 sm:mt-8">
            <Link
              to="/items"
              className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 transition rounded-lg text-white font-semibold shadow-lg"
            >
              Browse Items
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end w-full lg:w-auto">
          <img
            src="images/logo2.png"
            alt="shop"
            className="w-full sm:w-72 md:w-80 lg:w-96 max-w-xs sm:max-w-none rounded-2xl shadow-2xl object-cover"
          />
        </div>
      </section>

      {/* Brand Marquee */}
      <section>
        <BrandMarquee speed={60} />
      </section>

      {/* Our Outlets Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-blue-800 border-b-2 border-brand-500 pb-2">
          Our Outlets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {outlets.map(
            ({ id, name, address, description, photo, openOn, since }) => (
              <div
                key={id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 duration-300 overflow-hidden"
              >
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-48 sm:h-56 md:h-60 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-lg sm:text-xl text-brand-600">
                    {name}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base font-medium">
                    {address}
                  </p>
                  <p className="text-gray-700 mt-3 text-sm sm:text-base leading-relaxed tracking-wide">
                    {description}
                  </p>
                  <p className="mt-3 text-sm sm:text-base font-semibold text-green-600">
                    <span className="font-bold text-gray-800">Open On:</span>{" "}
                    {openOn}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-700">
                    <span className="font-bold">Since:</span> {since}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Our History */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300">
          <h3 className="font-bold text-xl sm:text-2xl text-brand-500 border-b-4 border-brand-500 pb-2">
            Our History
          </h3>
          <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed tracking-wide">
            Since 1970, we’ve grown from a humble wool shop serving our local
            community into a trusted neighborhood store. We pride ourselves on
            quality products and personalized service.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300">
          <h3 className="font-bold text-xl sm:text-2xl text-brand-500 border-b-4 border-brand-500 pb-2">
            Contact
          </h3>
          <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed tracking-wide space-y-2">
            <span>
              Phone:{" "}
              <a
                href="tel:+919415071592"
                className="text-blue-600 hover:underline"
              >
                +91-9415071592
              </a>
            </span>
            <br />
            <span>
              Email:{" "}
              <a
                href="mailto:sanjay1971.rbl@gmail.com"
                className="text-blue-600 hover:underline"
              >
                sanjay1971.rbl@gmail.com
              </a>
            </span>
          </p>
        </div>

        {/* Visit Us */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300">
          <h3 className="font-bold text-xl sm:text-2xl text-brand-500 border-b-4 border-brand-500 pb-2">
            Visit Us
          </h3>
          <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed tracking-wide">
            Kaiper Ganj, Kotwali Road, Rae Bareli. We’re always ready to
            welcome you with a smile!
          </p>
        </div>
      </section>
    </div>
  );
}
