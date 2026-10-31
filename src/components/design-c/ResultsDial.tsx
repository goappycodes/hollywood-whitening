"use client";

import { useState } from "react";
import { FORMULA } from "@/components/design/data";
import { Arc } from "./Arc";

/** Worst to best, so dragging right brightens the light. */
const STEPS = [...FORMULA].reverse();

/** Drag through the training page's comparison: quality in, light out. */
export function ResultsDial() {
  const [step, setStep] = useState(STEPS.length - 1);
  const row = STEPS[step];
  const parts = [
    { name: "Machine", good: row.machine },
    { name: "Gel", good: row.gel },
    { name: "Training", good: row.training },
  ];

  return (
    <div>
      <Arc intensity={(row.score - 1) / 4} stroke={6} className="mx-auto w-full max-w-5xl" />
      <p className="hc-display hc-h2 mt-12 min-h-[2em] text-center" aria-live="polite">
        {row.result}
      </p>
      <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4">
        {parts.map((part) => (
          <li key={part.name} className={`rounded-2xl border p-3 text-center transition-colors sm:p-5 ${part.good ? "border-white bg-white text-[var(--hc-black)]" : "border-white/25 text-white/60"}`}>
            <span className="block text-sm">{part.name}</span>
            <span className="mt-1 block font-medium sm:text-lg">{part.good ? "Quality" : "Poor"}</span>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-12 max-w-3xl">
        <input
          type="range"
          min={0}
          max={STEPS.length - 1}
          step={1}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          aria-label="Quality of machine, gel and training"
          aria-valuetext={row.result}
          className="hc-dial"
        />
        <p className="hc-tag mt-4 text-center">Drag to change the setup</p>
      </div>
    </div>
  );
}
