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
      openOn: "Wed - Mon: 11:00 AM - 8:30 PM",
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
    const [copiedField, setCopiedField] = useState(null); // track which was copied

    // Simple open/closed logic (optional)
    const isOpen =
      outlet.openOn?.toLowerCase().includes("am") ||
      outlet.openOn?.toLowerCase().includes("open");

    // Copy helper
    const copyToClipboard = (text, field) => {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000); // revert after 2 sec
    };

    return (
      <div
        key={outlet.id}
        className={`border-2 rounded-2xl p-4 flex flex-col md:flex-row items-start gap-4 bg-white transition duration-300 cursor-pointer 
          hover:scale-105 hover:shadow-xl
          ${showDesc ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-400"}`}
      >
        {/* Outlet Image */}
        <div className="relative w-full md:w-40 h-40 overflow-hidden rounded-xl border border-gray-300">
          <img
            src={outlet.photo || "images/default.png"}
            alt={outlet.name}
            className="w-full h-full object-cover transition duration-300 hover:scale-110"
          />
        </div>

        {/* Outlet Info */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg md:text-xl font-semibold">{outlet.name}</h3>
          <p className="text-gray-600 text-sm md:text-base">{outlet.address}</p>

          {/* Directions */}
          <div className="flex gap-2 mt-1">
            <a
              href={outlet.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 text-xs md:text-sm shadow-sm"
            >
              🧭 Directions
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                outlet.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 text-xs md:text-sm border"
            >
              📍 Show on Map
            </a>
          </div>

          {/* Highlighted Timing */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-2 py-1 text-xs md:text-sm font-medium rounded-full border animate-pulse
                ${
                  isOpen
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300"
                }`}
            >
              🕒 {isOpen ? "Open Now" : "Closed"} ({outlet.openOn})
            </span>
          </div>

          {/* Phone + Email with copy */}
          <div className="flex items-center gap-2 text-sm md:text-base">
            <strong>Phone:</strong>
            <a href={`tel:${outlet.phone}`} className="text-blue-600 hover:underline">
              {outlet.phone}
            </a>
            <button
              onClick={() => copyToClipboard(outlet.phone, "phone")}
              className={`text-xs ${
                copiedField === "phone"
                  ? "text-green-600 font-medium"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              {copiedField === "phone" ? "✅ Copied" : "📋 Copy"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm md:text-base">
            <strong>Email:</strong>
            <a href={`mailto:${outlet.email}`} className="text-blue-600 hover:underline">
              {outlet.email}
            </a>
            <button
              onClick={() => copyToClipboard(outlet.email, "email")}
              className={`text-xs ${
                copiedField === "email"
                  ? "text-green-600 font-medium"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              {copiedField === "email" ? "✅ Copied" : "📋 Copy"}
            </button>
          </div>

          <p className="text-sm md:text-base">
            <strong>Since:</strong> {outlet.since}
          </p>

          {/* Toggle Description */}
          <button
            onClick={() => setShowDesc(!showDesc)}
            className="mt-2 text-indigo-600 hover:underline text-sm"
          >
            {showDesc ? "Hide Details" : "View Details"}
          </button>
          {showDesc && (
            <p className="mt-1 text-gray-700 text-sm md:text-base leading-relaxed transition-all duration-500 ease-in-out border-t pt-2">
              {outlet.description}
            </p>
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
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
            className="border-2 border-gray-200 rounded-xl p-4 shadow bg-white flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-indigo-400 group relative"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-300 mb-2">
              <img
                src={offer.imageUrl || "images/default.png"}
                alt={offer.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />
            </div>
            <h4 className="font-semibold text-lg">{offer.title}</h4>
            <p className="text-xs text-gray-500 mt-1">
              🎉 Valid till:{" "}
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs border">
                {new Date(offer.validTill).toLocaleDateString()}
              </span>
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() =>
                  navigate("/items", { state: { searchQuery: offer.title } })
                }
                className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 text-xs shadow"
              >
                View Items
              </button>
              <button
                onClick={() => setViewingOffer(offer)}
                className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full hover:bg-yellow-500 text-xs shadow"
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
                    className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 text-xs shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-xs shadow"
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
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-500 max-w-md w-full relative shadow-lg animate-fadeIn">
          <button
            onClick={() => setViewingOffer(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 font-bold"
          >
            ✕
          </button>
          <img
            src={viewingOffer.imageUrl || "images/default.png"}
            alt={viewingOffer.title}
            className="w-full h-48 object-cover rounded-lg border mb-4"
          />
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">
            {viewingOffer.title}
          </h3>
          <p className="text-gray-700 mb-2">{viewingOffer.description}</p>
          <p className="text-sm text-gray-600">
            Valid Till:{" "}
            <span className="font-medium">
              {new Date(viewingOffer.validTill).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
    )}
  </div>
)}

{/* Contact Section */}
<div
  ref={contactRef}
  className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-2 border-indigo-200 p-6 rounded-2xl mt-12 space-y-4 shadow-md"
>
  <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600">
    Contact Us
  </h2>
  <p className="text-center text-gray-700">
    Have questions or feedback? Reach out to us!
  </p>
  <div className="max-w-md mx-auto space-y-3 text-center">
    <p className="flex justify-center items-center gap-2">
      <strong>📞 Phone:</strong>{" "}
      <a
        href="tel:9415071592"
        className="text-blue-600 hover:underline"
      >
        9415071592
      </a>
    </p>
    <p className="flex justify-center items-center gap-2">
      <strong>📧 Email:</strong>{" "}
      <a
        href="mailto:sanjay1971.rbl@gmail.com"
        className="text-blue-600 hover:underline"
      >
        sanjay1971.rbl@gmail.com
      </a>
    </p>
    <p className="flex justify-center items-center gap-2">
      <strong>📍 Address:</strong>{" "}
      <span className="text-gray-800">
        Kaiper Ganj, Kotwali Road, Rae Bareli
      </span>
    </p>
  </div>
</div>
</div>
  );
}

