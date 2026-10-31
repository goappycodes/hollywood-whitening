"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export type Module = { title: string; summary: string; items: string[] };

/** The syllabus as modules; the buyer picks one to see what it covers. */
export function Curriculum({ modules }: { modules: Module[] }) {
  const [active, setActive] = useState(0);
  const mod = modules[active];

  return (
    <div className="grid h-full gap-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-10">
      <div role="tablist" aria-label="Training modules" className="flex flex-wrap gap-2 md:flex-col">
        {modules.map((m, i) => (
          <button
            key={m.title}
            type="button"
            role="tab"
            id={`mod-tab-${i}`}
            aria-selected={i === active}
            aria-controls="mod-panel"
            onClick={() => setActive(i)}
            className="hd-chip text-left"
          >
            <span className="mr-1.5 opacity-60">{i + 1}</span> {m.title}
          </button>
        ))}
      </div>
      <div id="mod-panel" role="tabpanel" aria-labelledby={`mod-tab-${active}`}>
        <h3 className="hd-h3 !text-[1.35rem]">{mod.title}</h3>
        <p className="hd-lead mt-2">{mod.summary}</p>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {mod.items.map((item) => (
            <li key={item} className="flex gap-3 py-3 font-medium">
              <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
