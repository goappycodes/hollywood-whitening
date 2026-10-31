"use client";

import Image from "next/image";
import { useState } from "react";

export type GalleryImage = { src: string; alt: string; position?: string };

/** Main image plus thumbnails, all cropped to one frame so nothing jumps on change. */
export function Gallery({ images, children }: { images: GalleryImage[]; children?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const image = images[active];

  return (
    <div className="hd-tile relative aspect-[4/3] bg-white max-sm:aspect-square">
      <Image
        key={image.src}
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover"
        style={{ objectPosition: image.position }}
      />
      {children}
      <div className="hd-float absolute bottom-3 left-3 z-[4] flex gap-1.5 p-1.5 sm:bottom-4 sm:left-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1} of ${images.length}: ${img.alt}`}
            aria-current={i === active}
            className={`relative size-12 overflow-hidden rounded-[0.7rem] sm:size-16 ${i === active ? "ring-2 ring-ink" : "opacity-80 hover:opacity-100"}`}
          >
            <Image src={img.src} alt="" fill loading="eager" sizes="4rem" className="object-cover" style={{ objectPosition: img.position }} />
          </button>
        ))}
      </div>
    </div>
  );
}
