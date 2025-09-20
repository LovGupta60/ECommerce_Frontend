import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import BrandMarquee from "../components/BrandMarquee";
import Items from "./Items";
import {
  getAllOffers,
  saveOffer,
  deleteOffer,
  uploadOfferImage,
} from "../api";
import OfferForm from "./OfferForm.jsx";

export default function Home() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("Items");
  const [searchOutlets, setSearchOutlets] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // admin check

  // ---------------- Hardcoded Outlets ----------------
  const outlets = [
    {
      id: 1,
      name: "Gupta Hosiery & Crockery - Main Branch",
      address: "Kaiper Ganj, Kotwali Road, Rae Bareli",
      description:
        "Our flagship store, offering the full range of products with personalized and friendly service.",
      photo: "images/GH.png",
      openOn: "Wed - Mon: 10:00 AM - 9:00 PM",
      since: "1970",
      phone: "9415071592",
      email: "mainbranch@gupta.com",
    },
    {
      id: 2,
      name: "Gupta Luggage",
      address: "Sabzi Mandi road, in front of top shop, Rae Bareli",
      description:
        "Ideal for stylish and durable bags, offering a curated selection perfect for every occasion and lifestyle.",
      photo: "images/GL.png",
      openOn: "Tue - Sun: 11:00 AM - 8:30 PM",
      since: "2011",
      phone: "9415071592",
      email: "luggage@gupta.com",
    },
    {
      id: 3,
      name: "Gupta Kitchen Appliances",
      address: "Caanal road, in front of Vishal Mega Mart, Rae Bareli",
      description:
        "A modern, spacious outlet specializing in kitchen appliances and cleaning essentials.",
      photo: "images/GKA.png",
      openOn: "Wed-Mon: 10:00 AM - 9:00 PM",
      since: "2017",
      phone: "9415071592",
      email: "kitchen@gupta.com",
    },
  ];

  const filteredOutlets = outlets.filter(
    (o) =>
      o.name.toLowerCase().includes(searchOutlets.toLowerCase()) ||
      o.address.toLowerCase().includes(searchOutlets.toLowerCase())
  );

  // ---------------- Fetch Offers from Backend ----------------
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
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b mb-6">
        {["Items", "Outlets & Contact", "Offers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 md:px-4 md:py-2 font-medium rounded ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items */}
      {activeTab === "Items" && (
        <div className="space-y-6">
          <BrandMarquee />
          <Items />
        </div>
      )}

      {/* Outlets */}
      {activeTab === "Outlets & Contact" && (
        <div className="space-y-6">
          <div className="flex justify-center mb-4 md:mb-6">
            <input
              type="text"
              placeholder="Search outlets by name or address"
              className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              value={searchOutlets}
              onChange={(e) => setSearchOutlets(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredOutlets.map((outlet) => (
              <div
                key={outlet.id}
                className="border rounded-2xl shadow-md p-4 flex flex-col sm:flex-col md:flex-row items-start gap-4"
              >
                <img
                  src={outlet.photo || null}
                  alt={outlet.name}
                  className="w-full sm:w-full md:w-40 h-40 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg md:text-xl font-semibold">{outlet.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{outlet.address}</p>
                  <p className="text-sm mt-1">{outlet.description}</p>
                  <p className="text-sm">
                    <strong>Open:</strong> {outlet.openOn}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {outlet.phone}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {outlet.email}
                  </p>
                  <p className="text-sm">
                    <strong>Since:</strong> {outlet.since}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offers */}
      {activeTab === "Offers" && (
        <div className="space-y-4">
          {isAdmin && (
            <button
              onClick={() => {
                setEditingOffer(null);
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Offer
            </button>
          )}

          {loading ? (
            <p>Loading offers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="border rounded-lg p-4 shadow bg-white flex flex-col"
                >
                  <img
                    src={offer.imageUrl || null}
                    alt={offer.title}
                    className="h-40 w-full object-cover rounded mb-2"
                  />
                  <h4 className="font-semibold">{offer.title}</h4>
                  <p>{offer.description}</p>
                  <p className="text-xs text-gray-500">
                    Valid till: {new Date(offer.validTill).toLocaleDateString()}
                  </p>

                  {isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setEditingOffer(offer) || setShowForm(true)}
                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="bg-red-600 px-2 py-1 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
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
        </div>
      )}
    </div>
  );
}
