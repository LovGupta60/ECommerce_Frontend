import React, { useRef, useEffect, useState } from 'react';
import brands from '../data/brands';

// Continuous marquee implemented by translating an inner duplicated track
// using transform (GPU-accelerated) for smoother motion and avoiding
// scrollLeft measurement issues.
export default function BrandMarquee({ speed = 40 }) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const trackWidthRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

  let rafId = null;
  let last = null;
  offsetRef.current = offsetRef.current || 0; // ensure defined
  let running = true;

    // compute width after images load
    function computeWidth() {
      // inner contains 2x lists
      const w = inner.scrollWidth / 2 || 0;
      trackWidthRef.current = w;
      return w;
    }

    // Start when images are ready
    const imgs = inner.querySelectorAll('img');
    let pending = imgs.length;
    const onLoaded = () => {
      pending -= 1;
      if (pending <= 0) computeWidth();
    };
    if (pending === 0) computeWidth();
    else imgs.forEach(img => {
      if (img.complete) onLoaded();
      else {
        img.addEventListener('load', onLoaded, { once: true });
        img.addEventListener('error', onLoaded, { once: true });
      }
    });

    // Safety fallback: if for some reason load events are missed (cache, edge cases),
    // try computing the width after a short delay so the marquee can start.
    const fallbackTimer = setTimeout(() => {
      if (trackWidthRef.current === 0) {
        const w = computeWidth();
        // lightweight debug to help diagnose missing-load cases
        // eslint-disable-next-line no-console
        console.debug && console.debug('[BrandMarquee] fallback computeWidth ->', w);
      }
    }, 500);

    function step(now) {
      if (last == null) last = now;
      const dt = now - last;
      last = now;

      if (trackWidthRef.current > 0 && running) {
        offsetRef.current += (speed * dt) / 1000; // px
        if (offsetRef.current >= trackWidthRef.current) offsetRef.current = offsetRef.current - trackWidthRef.current;
        // translate the inner container leftwards
        inner.style.transform = `translateX(${-offsetRef.current}px)`;
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

  const onEnter = () => { running = false; };
  const onLeave = () => { running = true; };
  container.addEventListener('mouseenter', onEnter);
  container.addEventListener('mouseleave', onLeave);

  const onResize = () => computeWidth();
    window.addEventListener('resize', onResize);

    return () => {
  cancelAnimationFrame(rafId);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      imgs.forEach(img => {
        img.removeEventListener('load', onLoaded);
        img.removeEventListener('error', onLoaded);
      });
      clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  if (!brands || brands.length === 0) return null;

  // track per-image mode: 'cover' or 'contain'
  const [modes, setModes] = useState(() => {
    return brands.map(() => 'cover');
  });

  function setModeAt(index, mode) {
    setModes((m) => {
      const copy = [...m];
      copy[index % brands.length] = mode;
      return copy;
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Brands Available</h3>
      <div ref={containerRef} className="relative overflow-hidden">
      {/* slightly smaller fades so logos don't get clipped too early */}
      <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none" style={{background: 'linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0))'}} />
      <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none" style={{background: 'linear-gradient(270deg, rgba(255,255,255,1), rgba(255,255,255,0))'}} />

      <div ref={innerRef} className="flex gap-8 items-center whitespace-nowrap py-6 px-6 will-change-transform transition-transform duration-75">
        {/* spacer tiles to give breathing room so first/last logos aren't cut at the seam */}
        <div className="flex-shrink-0 w-48 h-20" aria-hidden />
        <div className="flex-shrink-0 w-48 h-20" aria-hidden />

        {[...brands, ...brands].map((b, i) => {
          const idx = i % brands.length;
          const mode = modes[idx] || 'cover';
          return (
            <div key={i} className="flex-shrink-0 w-48 h-20 border rounded-md bg-white shadow-sm overflow-hidden">
              <img
                src={b.logo}
                alt={b.name || `brand-${i}`}
                className={`w-full h-full ${b.fit ? (b.fit === 'cover' ? 'object-cover' : 'object-contain') : (modes[idx] === 'cover' ? 'object-cover' : 'object-contain')}`}
                onLoad={(e) => {
                  if (b.fit) return; // explicit override
                  const img = e.currentTarget;
                  const ratio = img.naturalWidth / img.naturalHeight;
                  const modeToUse = (ratio > 1.1 || ratio < 0.9) ? 'contain' : 'cover';
                  setModeAt(idx, modeToUse);
                }}
              />
            </div>
          );
        })}

        {/* final 'and more' tile */}
        <div className="flex-shrink-0 w-48 h-20 border rounded-md bg-gray-50 shadow-sm flex items-center justify-center text-sm font-medium text-gray-600">...and more</div>

        {/* trailing spacers */}
        <div className="flex-shrink-0 w-48 h-20" aria-hidden />
        <div className="flex-shrink-0 w-48 h-20" aria-hidden />
      </div>
    </div>
    </div>
  );
}
