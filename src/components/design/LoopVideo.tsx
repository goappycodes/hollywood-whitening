"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Muted background loop with a pause control; stays still under reduced motion. */
export function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.current?.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, []);

  const toggle = () => {
    if (playing) video.current?.pause();
    else void video.current?.play();
    setPlaying(!playing);
  };

  return (
    <div className="relative aspect-video overflow-hidden bg-white">
      <video ref={video} src={src} poster={poster} muted loop playsInline preload="metadata" className="size-full object-cover" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute bottom-3 left-3 grid size-11 place-items-center bg-white text-ink"
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
