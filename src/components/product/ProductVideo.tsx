"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/**
 * YouTube embed that loads only on click (the live page uses a similar lazy player):
 * a poster + play button first, then the privacy-enhanced youtube-nocookie iframe.
 */
export function ProductVideo({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [playing, setPlaying] = useState(false);
  // 1280px poster; not every video has one, so fall back to the 480px one.
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/10">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full"
          aria-label={`${playLabel}: ${title}`}
        >
          <Image
            src={poster}
            onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-95"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid size-18 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-[0_12px_40px_-8px_rgb(30_136_229/0.9)] transition-transform group-hover:scale-110 sm:size-20">
            <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
