"use client";

import { useState } from "react";
import { LIGHTS } from "@/components/design/data";
import { Arc } from "./Arc";

const BY_NAME = Object.fromEntries(LIGHTS.map((l) => [l.name, l]));

/** The machine's four light source output selections. */
const MODES = [
  { label: "Blue + Red + Purple", lights: ["Purple", "Blue", "Red"] },
  { label: "Blue + Purple", lights: ["Purple", "Blue"] },
  { label: "Blue", lights: ["Blue"] },
  { label: "Red", lights: ["Red"] },
];

/** The product hero is an instrument: choose a light mode and the Arc changes with it. */
export function LightConsole() {
  const [active, setActive] = useState(0);
  const mode = MODES[active];
  const colors = mode.lights.map((name) => BY_NAME[name].color);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
      <div className="relative py-6 lg:py-10">
        <Arc key={mode.label} colors={colors} stroke={7} className="w-full" />
      </div>
      <div>
        <fieldset>
          <legend className="hc-tag">Choose a light setting</legend>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {MODES.map((m, i) => (
              <label
                key={m.label}
                className={`flex min-h-12 cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white ${
                  i === active ? "border-white bg-white text-[var(--hc-black)]" : "border-white/30 hover:border-white"
                }`}
              >
                <input type="radio" name="light-setting" className="sr-only" checked={i === active} onChange={() => setActive(i)} />
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>
        <ul className="mt-6" aria-live="polite">
          {mode.lights.map((name) => (
            <li key={name} className="hc-rule grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2.5 text-sm sm:gap-8">
              <span className="flex items-center gap-2.5 font-medium">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: BY_NAME[name].color }} aria-hidden />
                {name}
              </span>
              <span className="text-muted">{BY_NAME[name].range}</span>
              <span className="text-muted">{BY_NAME[name].power}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
