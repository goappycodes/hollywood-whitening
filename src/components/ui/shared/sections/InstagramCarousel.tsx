"use client";

/**
 * Horizontal, swipeable carousel for the "Follow us on Instagram" section
 * (InstagramFeed) — as in allwhitelaser-next. Owns the scroll track, prev/next
 * arrows (desktop) and a gentle auto-advance that pauses on hover/touch/focus and
 * is off for reduced-motion users. Tiles arrive already resolved (live posts or
 * the snapshot fallback), so this stays purely presentational.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Social";

export type IgTile = { key: string; src: string; alt: string; href: string; isVideo: boolean };

/** Auto-advance interval (ms). */
const AUTOPLAY_MS = 3500;

type Props = { tiles: IgTile[]; handle: string; prevLabel: string; nextLabel: string };

export function InstagramCarousel({ tiles, handle, prevLabel, nextLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el || tiles.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      const first = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap || "12") || 12;
      const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.9;
      // At (or within half a tile of) the end → back to the start.
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - step * 0.5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [tiles.length]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const arrow =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/90 text-ink shadow-soft backdrop-blur transition hover:bg-white md:grid";

  return (
    <div
      className="relative mt-10 sm:mt-12"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <button type="button" aria-label={prevLabel} onClick={() => scrollByPage(-1)} className={`${arrow} -left-3`}>
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button type="button" aria-label={nextLabel} onClick={() => scrollByPage(1)} className={`${arrow} -right-3`}>
        <ChevronRight className="size-5" aria-hidden />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tiles.map((tile) => (
          <a
            key={tile.key}
            href={tile.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tile.alt} — ${handle} on Instagram`}
            className="group relative block aspect-square shrink-0 basis-[68%] snap-start overflow-hidden rounded-2xl border border-line bg-pearl sm:basis-[40%] md:basis-[30.5%] lg:basis-[23.25%]"
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 68vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {tile.isVideo && (
              <span className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-full bg-navy/55 text-white backdrop-blur">
                <Play className="size-3 translate-x-px fill-current" aria-hidden />
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-navy/0 transition-colors duration-300 group-hover:bg-navy/45">
              <InstagramIcon className="size-7 translate-y-1 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
