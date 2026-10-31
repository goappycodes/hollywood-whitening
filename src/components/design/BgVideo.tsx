"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HERO_MEDIA } from "@/lib/site";

/** Decorative muted hero loop filling its parent, with a pause control; still under reduced motion. */
export function BgVideo({ className = "", buttonClassName = "" }: { className?: string; buttonClassName?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.current?.play().catch(() => {});
  }, []);

  const toggle = () => {
    if (video.current?.paused) video.current.play().catch(() => {});
    else video.current?.pause();
  };

  return (
    <>
      <video
        ref={video}
        src={HERO_MEDIA.video}
        poster={HERO_MEDIA.poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 size-full object-cover ${className}`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className={`absolute z-10 grid size-10 place-items-center rounded-full bg-white/85 text-[#15121f] backdrop-blur ${buttonClassName}`}
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4 translate-x-px" aria-hidden />}
      </button>
    </>
  );
}
