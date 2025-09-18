import React, { useState } from "react";

const historyData = [
  {
    year: "Early Days",
    title: "Founded by Laxman Prasad Gupta",
    description:
      "The journey began when Laxman Prasad Gupta started a small family business to serve the local community with honest prices and reliable service .",
    photo: "images/Laxam.png",
  },
  {
    year: "Expansion",
    title: "Handled by Ganesh Prasad Gupta",
    description:
      "Under Ganesh Prasad Gupta’s leadership, the store expanded its offerings, focusing on kitchen appliances, home goods, and hosiery, while staying true to its values.",
    photo: "images/DadaJi.png",
  },
  {
    year: "Present",
    title: "Now Managed by Sanjay Gupta",
    description:
      "Today, Sanjay Gupta continues to run the business with the same dedication, combining tradition with modern retail practices to better serve customers.",
    photo: "images/sanjay.png",
  },
  {
    year: "Present",
    title: "Now Managed by Rahul Gupta",
    description:
    "Today, Rahul Gupta continues to run the business with the same dedication, combining tradition with modern retail practices to better serve customers, while Rahul Gupta, who has been handling the business since 2019, now manages operations completely, bringing years of experience and significantly contributing to the growth of Gupta Kitchen Appliances infront of Vishal mega mart.",
    photo: "images/Rahul.jpg",
  },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [preview, setPreview] = useState(null); // for image modal

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">About / History</h2>

      <div className="space-y-4">
        {historyData.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => toggle(index)}
          >
            <div className="flex items-center space-x-4">
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.title}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent collapsing when clicking image
                    setPreview(item.photo);
                  }}
                  className="w-32 h-32 object-contain rounded-lg border cursor-zoom-in bg-gray-100"
                />
              )}
              <h3 className="text-lg font-semibold">
                {item.year} – {item.title}
              </h3>
            </div>

            {activeIndex === index && (
              <p className="mt-2 text-gray-700">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Image preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
