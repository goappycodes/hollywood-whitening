"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Arc } from "./Arc";

/**
 * Wide and tall art for the reveal. `lamp` is where the lamp's mouth sits in each photo, as
 * fractions of its size; `focus` is its horizontal object-position.
 */
const ART = {
  wide: { src: "/images/bg-white.jpg", width: 2560, height: 1440, focus: 0.5, lamp: { x: 0.505, y: 0.569, width: 0.17 } },
  tall: { src: "/images/science/teeth-whitening-machine.jpg", width: 933, height: 1600, focus: 0.8, lamp: { x: 0.712, y: 0.245, width: 0.2 } },
};

const clamp = (n: number) => Math.min(Math.max(n, 0), 1);
const fade = (p: number, from: number, to: number) => clamp((p - from) / (to - from));

/**
 * The signature opening. A black stage with only the lamp's glow; scrolling grows a circle
 * of light from the lamp's mouth until the full white photo is revealed. Under reduced
 * motion the photo simply shows, lit.
 */
export function SwitchOnHero({
  headline,
  plate,
  alt,
  tallAlt,
}: {
  headline: ReactNode;
  plate: ReactNode;
  alt: string;
  tallAlt: string;
}) {
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
      const { clientWidth: w, clientHeight: h } = el;
      const art = w < 768 ? ART.tall : ART.wide;
      // The same geometry as object-fit: cover, so the light starts exactly at the lamp.
      const scale = Math.max(w / art.width, h / art.height);
      const iw = art.width * scale;
      const ih = art.height * scale;
      const lx = (w - iw) * art.focus + art.lamp.x * iw;
      const ly = (h - ih) * 0.5 + art.lamp.y * ih;

      const travel = sec.offsetHeight - window.innerHeight;
      const raw = still ? 1 : clamp(-sec.getBoundingClientRect().top / (travel * 0.9));
      const eased = raw * raw * (3 - 2 * raw);
      const far = Math.hypot(Math.max(lx, w - lx), Math.max(ly, h - ly));

      el.style.setProperty("--lx", `${lx}px`);
      el.style.setProperty("--ly", `${ly}px`);
      el.style.setProperty("--lw", `${art.lamp.width * iw}px`);
      el.style.setProperty("--r", `${Math.max(iw * 0.09, 70) + eased * far * 1.7}px`);
      el.style.setProperty("--glow", String(1 - fade(raw, 0.25, 0.7)));
      el.style.setProperty("--headline", String(1 - fade(raw, 0.04, 0.22)));
      el.style.setProperty("--plate", String(fade(raw, 0.72, 0.98)));
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
    <section ref={section} className="relative h-[300dvh] bg-[var(--hc-black)]">
      <div ref={stage} className="sticky top-0 h-dvh overflow-hidden">
        <div className="hc-reveal absolute inset-0 bg-white">
          <Image src={ART.wide.src} alt={alt} width={ART.wide.width} height={ART.wide.height} priority sizes="100vw" className="hidden size-full object-cover md:block" />
          <Image
            src={ART.tall.src}
            alt={tallAlt}
            width={ART.tall.width}
            height={ART.tall.height}
            sizes="100vw"
            loading="eager"
            className="size-full object-cover md:hidden"
            style={{ objectPosition: `${ART.tall.focus * 100}% 50%` }}
          />
        </div>

        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: "var(--lx, 50%)", top: "var(--ly, 57%)", width: "var(--lw, 15vw)", opacity: "var(--glow, 1)" }}
        >
          <Arc stroke={4} className="w-full" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[13%] text-center text-white max-md:top-auto max-md:bottom-[16%]" style={{ opacity: "var(--headline, 1)" }}>
          <div className="hc-x">{headline}</div>
        </div>
        <p
          className="hc-tag absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-center !text-white/70"
          style={{ opacity: "var(--headline, 1)" }}
          aria-hidden
        >
          Scroll to switch on
          <ChevronDown className="size-4 animate-bounce" />
        </p>

        <div
          className="absolute inset-x-0 bottom-0 bg-white"
          style={{ opacity: "var(--plate, 0)", transform: "translateY(calc((1 - var(--plate, 0)) * 100%))" }}
        >
          {plate}
        </div>
      </div>
    </section>
  );
}
