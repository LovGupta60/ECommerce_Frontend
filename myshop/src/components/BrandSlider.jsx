import React, { useEffect, useRef, useState } from "react";
import brands from "../data/brands";

export default function BrandSlider({ interval = 2000 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function startTimer() {
    stopTimer();
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % brands.length);
    }, interval);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  if (!brands || brands.length === 0) {
    return null;
  }
  const [mode, setMode] = useState("cover");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Brands Available</h3>
      <div
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        className="bg-white rounded-xl shadow-md p-0 mb-6 border border-gray-200 overflow-hidden"
      >
        {/* Full-width logo area; if last slide, show a small right column that says '...and more' */}
        <div className="w-full h-40 md:h-48 lg:h-56 bg-white overflow-hidden flex items-center">
          <div className="flex-grow h-full">
            <img
              src={brands[index].logo}
              alt={brands[index].name || `brand-${index}`}
              className={`w-full h-full ${brands[index].fit ? (brands[index].fit === 'cover' ? 'object-cover' : 'object-contain') : (mode === 'cover' ? 'object-cover' : 'object-contain')}`}
              onLoad={(e) => {
                if (brands[index].fit) return;
                const img = e.currentTarget;
                const ratio = img.naturalWidth / img.naturalHeight;
                setMode((ratio > 1.1 || ratio < 0.9) ? 'contain' : 'cover');
              }}
            />
          </div>
          {index === brands.length - 1 && (
            <div className="w-28 h-full bg-gray-50 border-l border-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
              ...and more
            </div>
          )}
        </div>

        {/* Dots */}
        <div className="p-3 flex items-center justify-center gap-2 bg-white">
          {brands.map((b, i) => (
            <button
              key={b.id || i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${i === index ? "bg-brand-500" : "bg-gray-300"}`}
              aria-label={`Go to ${b.name || i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
