"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { BgVideo } from "@/components/design/BgVideo";
import { Arc } from "./Arc";

const DARK = 0.84;

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);
const fade = (p: number, from: number, to: number) => clamp((p - from) / (to - from));

/**
 * The signature opening. The treatment video plays under a dark veil, with the headline and
 * the Arc; scrolling lifts the veil, so the room switches on. Under reduced motion the
 * poster simply shows, lit.
 */
export function SwitchOnHero({ headline, plate }: { headline: ReactNode; plate: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const el = stage.current;
    if (!sec || !el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const travel = sec.offsetHeight - window.innerHeight;
      const raw = still ? 1 : clamp(-sec.getBoundingClientRect().top / (travel * 0.9));
      el.style.setProperty("--dark", String(DARK * (1 - fade(raw, 0.08, 0.78))));
      el.style.setProperty("--headline", String(1 - fade(raw, 0.05, 0.38)));
      el.style.setProperty("--plate", String(fade(raw, 0.7, 0.98)));
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
    <section ref={section} className="relative h-[220dvh] bg-[var(--hc-black)]">
      <div ref={stage} className="sticky top-0 h-dvh overflow-hidden">
        <BgVideo className="object-[62%_center]" buttonClassName="top-20 right-4 sm:right-[var(--hc-gutter)]" />
        <div className="pointer-events-none absolute inset-0 bg-[var(--hc-black)]" style={{ opacity: `var(--dark, ${DARK})` }} />

        <div className="pointer-events-none absolute inset-x-0 bottom-20 text-white sm:bottom-16" style={{ opacity: "var(--headline, 1)" }}>
          <div className="hc-x">
            <div className="rise">{headline}</div>
            <Arc stroke={4} className="hc-arc-in mt-8 w-[min(80vw,38rem)] sm:mt-10" />
          </div>
        </div>
        <p
          className="hc-tag absolute right-[var(--hc-gutter)] bottom-6 flex items-center gap-1.5 !text-white/80 max-sm:left-[var(--hc-gutter)]"
          style={{ opacity: "var(--headline, 1)" }}
          aria-hidden
        >
          Scroll to switch on
          <ChevronDown className="size-4 animate-bounce" />
        </p>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-white" style={{ opacity: "var(--plate, 0)", transform: "translateY(calc((1 - var(--plate, 0)) * 100%))" }}>
          {plate}
        </div>
      </div>
    </section>
  );
}
