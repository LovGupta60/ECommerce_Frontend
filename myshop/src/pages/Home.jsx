import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  getAllOffers,
  saveOffer,
  deleteOffer,
  uploadOfferImage,
} from "../api";
import OfferForm from "./OfferForm.jsx";
import BrandMarquee from "../components/BrandMarquee.jsx";

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Offers");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingOffer, setViewingOffer] = useState(null); // for read-only details modal

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const offersRef = useRef(null);
  const contactRef = useRef(null);

  // Updated outlets with hardcoded map links
  const outlets = [
    {
      id: 1,
      name: "Gupta Hosiery & Crockery - Main Branch",
      address: "Kaiper Ganj, Kotwali Road, Rae Bareli",
      description:
        "Our flagship store, oldest in the market since 1970, serving you with quality products. Get everything for your household here—from hosiery to crockery, all under one roof!",
      photo: "images/GH.png",
      openOn: "Wed - Mon: 10:00 AM - 9:00 PM",
      since: "1970",
      phone: "9415071592",
      email: "sanjay1971.rbl@gmail.com",
      mapLink: "https://www.google.com/maps/dir/?api=1&destination=26.228279294890175, 81.23618549542488",
    },
    {
      id: 2,
      name: "Gupta Luggage",
      address: "Sabzi Mandi road, in front of top shop, Rae Bareli",
      description:
        "Opened in 2011, Gupta Luggage offers a wide variety of stylish and durable bags. Perfect for every occasion and lifestyle, available at the cheapest rates in the market and online!",
      photo: "images/GL.png",
      openOn: "Tue - Sun: 11:00 AM - 8:30 PM",
      since: "2011",
      phone: "9415071592",
      email: "sanjay1971.rbl@gmail.com",
      mapLink: "https://www.google.com/maps/dir/?api=1&destination=26.228279294890175, 81.23618549542488",
    },
    {
      id: 3,
      name: "Gupta Kitchen Appliances",
      address: "Caanal road, in front of Vishal Mega Mart, Rae Bareli",
      description:
        "Our newest store, specializing in modern and unique kitchen appliances and crockery you won't find anywhere else. Affordable, high-quality products for all your household needs, available both in-store and online.",
      photo: "images/GKA.png",
      openOn: "Wed-Mon: 10:00 AM - 9:00 PM",
      since: "2017",
      phone: "9415071592",
      email: "sanjay1971.rbl@gmail.com",
      mapLink: "https://www.google.com/maps/dir/?api=1&destination=26.218367401106622, 81.24252717645338",
    },
  ];

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const data = await getAllOffers();
        setOffers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleSaveOffer = async (formData) => {
    try {
      const saved = await saveOffer(
        editingOffer?.id || null,
        {
          title: formData.title,
          description: formData.description,
          validTill: formData.validTill,
          imageUrl: editingOffer?.imageUrl || "",
        },
        token
      );

      if (formData.file) {
        const uploaded = await uploadOfferImage(saved.id, formData.file, token);
        saved.imageUrl = uploaded.imageUrl;
      }

      if (editingOffer) {
        setOffers(offers.map((o) => (o.id === saved.id ? saved : o)));
      } else {
        setOffers([saved, ...offers]);
      }

      setShowForm(false);
      setEditingOffer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOffer = async (id) => {
    try {
      await deleteOffer(id, token);
      setOffers(offers.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6 rounded-lg text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Gupta Hosiery & Crockery Store</h1>
        <p className="mt-2 text-lg md:text-xl">
          Quality products for your home and lifestyle{" "}
          <span className="font-semibold text-yellow-400">— Since 1970</span>
        </p>
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/items")}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100"
          >
            View Items
          </button>
          <button
            onClick={() => {
              setActiveTab("Offers");
              setTimeout(() => {
                offersRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100"
          >
            View Offers
          </button>
          <button
            onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100"
          >
            Contact Us
          </button>
        </div>
        <div className="mt-6 px-4 md:px-16">
          <BrandMarquee />
        </div>
      </header>

      <div className="bg-yellow-400 text-indigo-900 font-bold text-center py-3 rounded-lg shadow-lg animate-pulse space-y-2">
        <p className="text-red-600 text-lg">
          Lowest Prices in Market & Online, Delivered in 30 Minutes!
        </p>
        <div className="flex justify-center gap-4 mt-1">
          <a
            href="https://wa.me/919415071592"
            target="_blank"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Order on WhatsApp
          </a>
          <a
            href="tel:9415071592"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Call to Order
          </a>
        </div>
      </div>

      {/* Outlets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {outlets.map((outlet) => {
          const [showDesc, setShowDesc] = useState(false);
          return (
            <div
              key={outlet.id}
              className={`border rounded-2xl shadow-md p-4 flex flex-col md:flex-row items-start gap-4 bg-white transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer
                ${showDesc ? "border-indigo-600 bg-indigo-50" : ""}`}
            >
              <div className="relative w-full md:w-40 h-40 overflow-hidden rounded-lg">
                <img
                  src={outlet.photo || "images/default.png"}
                  alt={outlet.name}
                  className="w-full h-full object-cover transition duration-300 hover:scale-110"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg md:text-xl font-semibold">{outlet.name}</h3>
                <p className="text-gray-600 text-sm md:text-base">{outlet.address}</p>

                {/* Get Directions */}
                <a
                  href={outlet.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs md:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20l-5.447-2.724A2 2 0 013 15.382V5a2 2 0 012-2h14a2 2 0 012 2v10.382a2 2 0 01-1.553 1.894L15 20l-6-3z"
                    />
                  </svg>
                  Click to Get Directions
                </a>

                <p className="text-sm md:text-base mt-1">
                  <strong>Open:</strong> {outlet.openOn}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Phone:</strong> {outlet.phone}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Email:</strong> {outlet.email}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Since:</strong> {outlet.since}
                </p>

                <button
                  onClick={() => setShowDesc(!showDesc)}
                  className="mt-2 text-indigo-600 hover:underline text-sm"
                >
                  {showDesc ? "Hide Details" : "View Details"}
                </button>
                {showDesc && (
                  <p className="mt-1 text-gray-700 text-sm md:text-base">{outlet.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Offers Section */}
      {activeTab === "Offers" && (
        <div ref={offersRef} className="space-y-6 mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600">
            Our Latest Offers
          </h2>

          {isAdmin && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setShowForm(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                + Add Offer
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading offers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="border rounded-lg p-4 shadow bg-white flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group relative"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded mb-2">
                    <img
                      src={offer.imageUrl || "images/default.png"}
                      alt={offer.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-lg">{offer.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Valid till: {new Date(offer.validTill).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        navigate("/items", { state: { searchQuery: offer.title } })
                      }
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      View Items
                    </button>
                    <button
                      onClick={() => setViewingOffer(offer)}
                      className="bg-yellow-500 text-blue-800 px-2 py-1 rounded hover:bg-yellow-400 text-sm"
                    >
                      View Details
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setEditingOffer(offer);
                            setShowForm(true);
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <OfferForm
              initialData={editingOffer}
              onSave={handleSaveOffer}
              onCancel={() => {
                setShowForm(false);
                setEditingOffer(null);
              }}
            />
          )}

          {viewingOffer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                <button
                  onClick={() => setViewingOffer(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
                >
                  X
                </button>
                <img
                  src={viewingOffer.imageUrl || "images/default.png"}
                  alt={viewingOffer.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{viewingOffer.title}</h3>
                <p className="text-gray-700 mb-2">{viewingOffer.description}</p>
                <p className="text-sm text-gray-500">
                  Valid Till: {new Date(viewingOffer.validTill).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Section */}
      <div ref={contactRef} className="bg-gray-100 p-6 rounded-lg mt-12 space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600">
          Contact Us
        </h2>
        <p className="text-center text-gray-700">Have questions or feedback? Reach out to us!</p>
        <div className="max-w-md mx-auto space-y-2">
          <p>
            <strong>Phone:</strong> 9415071592
          </p>
          <p>
            <strong>Email:</strong> sanjay1971.rbl@gmail.com
          </p>
          <p>
            <strong>Address:</strong> Kaiper Ganj, Kotwali Road, Rae Bareli
          </p>
        </div>
      </div>
    </div>
  );
}

