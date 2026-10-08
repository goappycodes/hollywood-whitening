"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { fill } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  images: { src: string; alt: string }[];
  labels: { prev: string; next: string; show: string; open: string; close: string };
};

/**
 * Product gallery — main image with prev/next and thumbnails (live: WooCommerce slider);
 * clicking the main image opens a full-screen lightbox (native <dialog>: focus is
 * trapped and Esc closes it). Arrow keys and swipes move between images in both.
 *
 * The frame is the landscape hero shot's ratio (12:7); the live kit shots are portrait,
 * so images are contained on white rather than cropped.
 */
export function ProductGallery({ images, labels }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  // Drive the native dialog from state, and lock page scroll while it is open.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && el.open) {
      el.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  // Esc closes the native dialog without going through state — listen for its
  // `close` event directly (React's onClose did not fire for it here).
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => setOpen(false);
    el.addEventListener("close", onClose);
    return () => {
      el.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!count) return null;
  const current = images[index];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };
  const swipe = {
    onTouchStart: (e: TouchEvent) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e: TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touchX.current = null;
    },
  };

  const arrow =
    "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:bg-white";

  return (
    <div onKeyDown={onKey}>
      <div
        className="relative aspect-[12/7] overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-lift"
        {...swipe}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${labels.open} — ${current.alt}`}
          className="group absolute inset-0 cursor-zoom-in"
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="animate-[fade-in_0.35s_ease] object-contain"
          />
          <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink opacity-80 shadow-soft transition group-hover:opacity-100">
            <Expand className="size-4" aria-hidden />
          </span>
        </button>
        {count > 1 && (
          <>
            <button type="button" aria-label={labels.prev} onClick={() => go(-1)} className={cn(arrow, "left-3")}>
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" aria-label={labels.next} onClick={() => go(1)} className={cn(arrow, "right-3")}>
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-navy/70 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums backdrop-blur">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && <Thumbs images={images} index={index} onSelect={setIndex} label={labels.show} className="mt-3" />}

      {/* Lightbox */}
      <dialog
        ref={dialog}
        // Arrow keys reach the wrapper's onKeyDown (React events bubble through the tree).
        // A click on the backdrop (the dialog element itself) closes it.
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        aria-label={labels.open}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-navy p-0 text-white backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <span className="text-sm font-semibold tabular-nums text-white/80">
                {index + 1} / {count}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.close}
                autoFocus
                className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1"
              onClick={(e) => e.target === e.currentTarget && setOpen(false)}
              {...swipe}
            >
              <div className="pointer-events-none absolute inset-x-4 inset-y-2 sm:inset-x-20">
                <Image
                  key={`lb-${current.src}`}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="animate-[fade-in_0.3s_ease] object-contain"
                />
              </div>
              {count > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={labels.prev}
                    onClick={() => go(-1)}
                    className="absolute top-1/2 left-2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:left-5 sm:grid"
                  >
                    <ChevronLeft className="size-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={labels.next}
                    onClick={() => go(1)}
                    className="absolute top-1/2 right-2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 sm:right-5 sm:grid"
                  >
                    <ChevronRight className="size-6" aria-hidden />
                  </button>
                </>
              )}
            </div>

            {count > 1 && (
              <Thumbs
                images={images}
                index={index}
                onSelect={setIndex}
                label={labels.show}
                dark
                className="mx-auto w-full max-w-xl px-4 pt-3 pb-5 sm:pb-6"
              />
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

function Thumbs({
  images,
  index,
  onSelect,
  label,
  dark = false,
  className,
}: {
  images: Props["images"];
  index: number;
  onSelect: (i: number) => void;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-4 gap-2 sm:gap-3", className)}>
      {images.map((img, i) => (
        <li key={img.src}>
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-label={fill(label, { n: i + 1 })}
            aria-current={i === index}
            className={cn(
              "relative block aspect-[12/7] w-full overflow-hidden rounded-xl border-2 bg-white transition",
              i === index ? (dark ? "border-cyan" : "border-brand") : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 12vw, 25vw" className="object-contain" />
          </button>
        </li>
      ))}
    </ul>
  );
}
