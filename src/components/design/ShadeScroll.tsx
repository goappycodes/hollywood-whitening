"use client";

import { useEffect, useRef } from "react";

const FROM = [242, 230, 198];
const TO = [255, 255, 255];
const SHADES = 20;

/**
 * Whitens the page as it scrolls: --shade on .hw runs from a warm tooth shade to pure
 * white, reached a little before the end. The corner readout counts the shade down.
 */
export function ShadeScroll() {
  const readout = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hw");
    if (!root) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / (max * 0.8), 1) : 0;
      const [r, g, b] = FROM.map((c, i) => Math.round(c + (TO[i] - c) * progress));
      root.style.setProperty("--shade", `rgb(${r} ${g} ${b})`);
      if (readout.current) readout.current.textContent = String(SHADES - Math.round(progress * (SHADES - 1)));
    };
    const onChange = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="hw-label pointer-events-none fixed right-4 bottom-4 z-40 hidden border border-line bg-white px-2.5 py-1.5 lg:block"
    >
      Shade <span ref={readout}>{SHADES}</span>
    </div>
  );
}
