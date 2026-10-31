"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export type FinderResult = {
  answer: string;
  name: string;
  why: string;
  image: string;
  facts: string[];
  rating: string;
  cta: { href: string; label: string };
  alternative?: string;
};

/** One question that narrows the three packages down to a starting point. */
export function PackageFinder({ results }: { results: FinderResult[] }) {
  const [active, setActive] = useState(1);
  const result = results[active];

  return (
    <div className="hd-tile hd-pearl mt-5 grid lg:grid-cols-[5fr_7fr]">
      <div className="relative z-[4] flex flex-col justify-between gap-8 p-6 sm:p-10">
        <div>
          <h3 className="hd-h3 !text-[1.35rem]">Where will you treat clients?</h3>
          <div role="group" aria-label="Where you will treat clients" className="mt-5 flex flex-wrap gap-2">
            {results.map((r, i) => (
              <button key={r.answer} type="button" aria-pressed={i === active} onClick={() => setActive(i)} className="hd-chip">
                {r.answer}
              </button>
            ))}
          </div>
        </div>
        <div aria-live="polite">
          <p className="text-sm font-semibold text-muted">A good place to start</p>
          <p className="hd-h2 mt-1">{result.name}</p>
          <p className="hd-lead mt-3">{result.why}</p>
          {result.alternative && <p className="mt-3 text-sm text-muted">{result.alternative}</p>}
          <a href={result.cta.href} className="hd-btn mt-6">
            {result.cta.label} <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
      <div className="relative z-[1] min-h-[20rem] overflow-hidden bg-white lg:min-h-[32rem]">
        <Image key={result.image} src={result.image} alt={`${result.name} with its kit`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
        <ul className="hd-float absolute right-3 bottom-3 left-3 grid gap-x-4 gap-y-1.5 p-4 text-sm font-medium sm:right-auto sm:left-4 sm:bottom-4 sm:min-w-64">
          {result.facts.map((fact) => (
            <li key={fact} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              {fact}
            </li>
          ))}
          <li className="mt-1 border-t border-line pt-2 text-muted">{result.rating}</li>
        </ul>
      </div>
    </div>
  );
}
