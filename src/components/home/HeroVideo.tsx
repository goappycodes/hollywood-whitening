"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Muted looping hero video. On desktop it fills the right of the hero and
 * fades into the navy behind the copy; on mobile it sits behind everything.
 * Stays on the poster for reduced-motion users; the pause button covers
 * WCAG 2.2.2 for auto-playing media.
 */
type Props = { src: string; poster: string; pauseLabel: string; playLabel: string };

export function HeroVideo({ src, poster, pauseLabel, playLabel }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.play().catch(() => {});
    }
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      <div className="absolute inset-0 lg:left-[26%]">
        <video
          ref={ref}
          className="absolute inset-0 size-full object-cover object-[60%_center]"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {/* Cool brand tint so the white studio footage sits in the navy palette */}
        <div aria-hidden className="absolute inset-0 bg-brand-ink/35 mix-blend-multiply" />
        {/* Mobile: even wash for legibility. Desktop: fade the left edge into the copy column. */}
        <div aria-hidden className="absolute inset-0 bg-navy/60 lg:hidden" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-navy)_0%,rgb(5_11_26/0.85)_18%,rgb(5_11_26/0.35)_42%,rgb(5_11_26/0.05)_75%)] lg:block"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy/70 to-transparent"
        />
      </div>

      <button
        type="button"
        onClick={toggle}
        className="glass-dark absolute right-5 bottom-5 z-20 inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 sm:right-8 sm:bottom-8"
        aria-label={playing ? pauseLabel : playLabel}
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4 translate-x-px" aria-hidden />}
      </button>
    </>
  );
}
