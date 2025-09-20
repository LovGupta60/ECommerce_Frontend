import React, { useState, useRef, useMemo } from "react";
import { useCart } from "../context/CartContext";
import BrandMarquee from "../components/BrandMarquee";
import Items from "./Items";

// Outlets data
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
    phone: "01234-567890",
    email: "mainbranch@gupta.com",
  },
  {
    id: 2,
    name: "Gupta Luggage",
    address: "Sabzi Mandi road, in front of top shop, Rae Bareli",
    description:
      "Ideal for stylish and durable bags, offering a curated selection perfect for every occasion and lifestyle.",
    photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    openOn: "Tue - Sun: 11:00 AM - 8:30 PM",
    since: "2011",
    phone: "01234-555666",
    email: "luggage@gupta.com",
  },
  {
    id: 3,
    name: "Gupta Kitchen Appliances",
    address: "Caanal road, in front of Vishal Mega Mart, Rae Bareli",
    description:
      "A modern, spacious outlet specializing in kitchen appliances and cleaning essentials.",
    photo: "/images/GKA.png",
    openOn: "Wed-Mon: 10:00 AM - 9:00 PM",
    since: "2017",
    phone: "01234-888999",
    email: "kitchen@gupta.com",
  },
];

// Initial offers data
const initialOffers = [
  {
    id: 1,
    title: "Flat 20% Off on Crockery Sets",
    description: "Make your dining classy with our premium crockery.",
    image: "/images/offer-crockery.png",
    validTill: "2025-09-28",
  },
  {
    id: 2,
    title: "Buy 2 Get 1 Free - Luggage",
    description: "Travel smart with our premium luggage offer.",
    image: "/images/offer-luggage.png",
    validTill: "2025-09-25",
  },
  {
    id: 3,
    title: "Flat 20% Off on Kitchen Appliances",
    description: "Upgrade your kitchen with modern appliances.",
    image: "/images/offer-kitchen.png",
    validTill: "2025-09-30",
  },
];

// Offer block component
const OfferBlock = ({ offer, isAdmin, onEdit, onDelete }) => (
  <div className="border rounded-lg p-4 shadow hover:scale-105 transition-transform flex flex-col items-center text-center bg-white">
    <img
      src={offer.image}
      alt={offer.title}
      className="w-full h-40 object-cover rounded-md mb-2"
    />
    <h4 className="font-semibold">{offer.title}</h4>
    <p className="text-sm text-gray-600">{offer.description}</p>
    <p className="text-xs text-gray-400 mt-1">
      Valid till: {new Date(offer.validTill).toLocaleDateString("en-IN")}
    </p>

    {isAdmin && (
      <div className="flex gap-2 mt-2">
        <button
          onClick={onEdit}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    )}
  </div>
);

export default function Home() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("Items");
  const [searchOutlets, setSearchOutlets] = useState("");
  const [offers, setOffers] = useState(initialOffers);
  const debounceOutlets = useRef(null);

  // Admin check (replace with real auth)
  const [isAdmin, setIsAdmin] = useState(true);

  const handleSearchOutlets = (e) => {
    const value = e.target.value;
    if (debounceOutlets.current) clearTimeout(debounceOutlets.current);
    debounceOutlets.current = setTimeout(() => setSearchOutlets(value), 200);
  };

  const filteredOutlets = useMemo(() => {
    return outlets.filter(
      (o) =>
        o.name.toLowerCase().includes(searchOutlets.toLowerCase()) ||
        o.address.toLowerCase().includes(searchOutlets.toLowerCase())
    );
  }, [searchOutlets]);

  // --- Admin Offer Actions ---
  const handleAddOffer = () => {
    const newOffer = {
      id: Date.now(),
      title: "",
      description: "",
      image: "",
      validTill: "",
      editing: true,
    };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const handleSaveOffer = (index, updatedOffer) => {
    const updatedOffers = [...offers];
    updatedOffers[index] = { ...updatedOffer, editing: false, id: updatedOffer.id || Date.now() };
    setOffers(updatedOffers);
  };

  const handleDeleteOffer = (index) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    setOffers((prev) => prev.filter((_, i) => i !== index));
  };

  // Offer editing form
  const OfferEditForm = ({ offer, index }) => {
    const [editOffer, setEditOffer] = useState(offer);

    return (
      <div className="border rounded-lg p-4 shadow flex flex-col items-center bg-white space-y-2">
        <input
          type="text"
          placeholder="Offer Title"
          value={editOffer.title}
          onChange={(e) => setEditOffer({ ...editOffer, title: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={editOffer.description}
          onChange={(e) => setEditOffer({ ...editOffer, description: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={editOffer.image}
          onChange={(e) => setEditOffer({ ...editOffer, image: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          placeholder="Valid Till"
          value={editOffer.validTill}
          onChange={(e) => setEditOffer({ ...editOffer, validTill: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleSaveOffer(index, editOffer)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={() => handleDeleteOffer(index)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Navbar Tabs */}
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

      {/* Items Tab */}
      {activeTab === "Items" && (
        <div className="space-y-6">
          <BrandMarquee />
          <Items />
        </div>
      )}

      {/* Outlets & Contact Tab */}
      {activeTab === "Outlets & Contact" && (
        <div className="space-y-6">
          <div className="flex justify-center mb-4 md:mb-6">
            <input
              type="text"
              placeholder="Search outlets by name or address"
              className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              value={searchOutlets}
              onChange={handleSearchOutlets}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredOutlets.map((outlet) => (
              <div
                key={outlet.id}
                className="border rounded-2xl shadow-md p-4 flex flex-col sm:flex-col md:flex-row items-start gap-4"
              >
                <img
                  src={outlet.photo}
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

      {/* Offers Tab */}
      {activeTab === "Offers" && (
        <div className="space-y-4">
          {isAdmin && (
            <button
              onClick={handleAddOffer}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add New Offer
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {offers.map((offer, idx) =>
              offer.editing ? (
                <OfferEditForm key={offer.id} offer={offer} index={idx} />
              ) : (
                <OfferBlock
                  key={offer.id}
                  offer={offer}
                  isAdmin={isAdmin}
                  onEdit={() =>
                    setOffers((prev) => {
                      const newOffers = [...prev];
                      newOffers[idx].editing = true;
                      return newOffers;
                    })
                  }
                  onDelete={() => handleDeleteOffer(idx)}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
