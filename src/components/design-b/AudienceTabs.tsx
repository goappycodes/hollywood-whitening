"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export type Audience = {
  label: string;
  title: string;
  text: string;
  points: string[];
  image: string;
  alt: string;
  /** The photo is on pure white, so the arch needs a tint to show. */
  tint?: boolean;
  cta: { href: string; label: string };
};

/** "Which setup suits you?": one panel per type of buyer. */
export function AudienceTabs({ items }: { items: Audience[] }) {
  const [active, setActive] = useState(0);
  const item = items[active];

  return (
    <div className="mt-10">
      <div role="tablist" aria-label="Type of business" className="flex flex-wrap gap-2">
        {items.map((a, i) => (
          <button
            key={a.label}
            type="button"
            role="tab"
            id={`aud-tab-${i}`}
            aria-selected={i === active}
            aria-controls="aud-panel"
            onClick={() => setActive(i)}
            className={`min-h-11 rounded-full border px-4 py-2 text-[0.95rem] transition-colors sm:px-5 ${
              i === active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div id="aud-panel" role="tabpanel" aria-labelledby={`aud-tab-${active}`} className="mt-10 grid items-center gap-10 md:grid-cols-[5fr_7fr] lg:gap-20">
        <div className={`hb-arch mx-auto w-full max-w-md ${item.tint ? "hb-arch-tint" : ""}`}>
          <Image key={item.image} src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 28rem, 100vw" className="object-cover object-top" />
        </div>
        <div>
          <h3 className="hb-h2">{item.title}</h3>
          <p className="hb-lead mt-4 max-w-xl">{item.text}</p>
          <ul className="mt-6 max-w-xl divide-y divide-line border-y border-line">
            {item.points.map((point) => (
              <li key={point} className="py-3">
                {point}
              </li>
            ))}
          </ul>
          <a href={item.cta.href} className="hb-link mt-6">
            {item.cta.label} <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
