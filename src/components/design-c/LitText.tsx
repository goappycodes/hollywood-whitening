"use client";

import { useEffect, useRef } from "react";

const DIM = 0.16;

/** A statement whose words light up one by one as it scrolls through the screen. */
export function LitText({ text, className }: { text: string; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = [...el.querySelectorAll<HTMLElement>("span")];
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * 0.8 - rect.top) / (rect.height + vh * 0.25);
      const lit = progress * (spans.length + 4);
      spans.forEach((span, i) => {
        const on = Math.min(Math.max((lit - i) / 4, 0), 1);
        span.style.opacity = String(DIM + (1 - DIM) * on);
      });
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
    <p ref={root} className={className}>
      {words.map((word, i) => (
        <span key={i}>{word} </span>
      ))}
    </p>
  );
}
