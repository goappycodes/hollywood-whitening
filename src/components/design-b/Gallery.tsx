"use client";

import Image from "next/image";
import { useState } from "react";

export type GalleryImage = { src: string; alt: string; width: number; height: number; position?: string };

/** Main image plus thumbnails, all cropped to the same frame so nothing jumps on change. */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const image = images[active];

  return (
    <div>
      <div className="hb-photo relative aspect-[4/3] bg-white">
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 44rem, 100vw"
          className="object-cover"
          style={{ objectPosition: image.position }}
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1} of ${images.length}: ${img.alt}`}
            aria-current={i === active}
            className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
              i === active ? "border-ink" : "border-line hover:border-muted"
            }`}
          >
            <Image src={img.src} alt="" fill loading="eager" sizes="10rem" className="object-cover" style={{ objectPosition: img.position }} />
          </button>
        ))}
      </div>
    </div>
  );
}
