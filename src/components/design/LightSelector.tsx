"use client";

import { useState } from "react";

const BANDS = {
  blue: { name: "Blue", from: 450, to: 510, color: "#4d7cff", power: "4–5 W/pc" },
  red: { name: "Red", from: 620, to: 640, color: "#ff4d4d", power: "2–3 W/pc" },
  purple: { name: "Purple", from: 380, to: 420, color: "#a24dff", power: "1 W/pc" },
} as const;

type Band = keyof typeof BANDS;

/** The machine's four light source output selections, from the Comet 2™ spec. */
const MODES: { label: string; bands: Band[] }[] = [
  { label: "Blue", bands: ["blue"] },
  { label: "Red", bands: ["red"] },
  { label: "Blue + Red + Purple", bands: ["purple", "blue", "red"] },
  { label: "Blue + Purple", bands: ["purple", "blue"] },
];

const SCALE = { min: 360, max: 660 };
const TICKS = [400, 450, 500, 550, 600, 650];
const pct = (nm: number) => ((nm - SCALE.min) / (SCALE.max - SCALE.min)) * 100;

export function LightSelector() {
  const [active, setActive] = useState(2);
  const mode = MODES[active];
  const colors = mode.bands.map((b) => BANDS[b].color);
  const beam = colors.length > 1 ? `linear-gradient(90deg, ${colors.join(", ")})` : colors[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <div className="relative flex h-64 items-start justify-center sm:h-80" aria-hidden>
        {/* Light head, seen from the front, with its beam */}
        <div
          className="absolute top-20 h-48 w-[88%] rounded-[50%] opacity-60 blur-3xl transition-all duration-500 sm:top-24"
          style={{ background: beam }}
        />
        <div className="relative mt-4 h-20 w-56 rounded-t-[5rem] rounded-b-2xl bg-gradient-to-b from-white to-neutral-300 sm:h-24 sm:w-72">
          <div
            className="absolute inset-x-5 bottom-2 h-3 rounded-full transition-all duration-500"
            style={{ background: beam, boxShadow: `0 6px 28px 4px ${colors[0]}` }}
          />
        </div>
      </div>

      <div>
        <fieldset>
          <legend className="hw-label text-white/70">Light source output</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {MODES.map((m, i) => (
              <label
                key={m.label}
                className={`flex min-h-12 cursor-pointer items-center border px-4 py-3 text-[0.95rem] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white ${
                  i === active ? "border-white bg-white text-ink" : "border-white/30 hover:border-white"
                }`}
              >
                <input
                  type="radio"
                  name="light-source"
                  className="sr-only"
                  checked={i === active}
                  onChange={() => setActive(i)}
                />
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-10" role="img" aria-label={`Spectrum: ${mode.bands.map((b) => `${BANDS[b].name} ${BANDS[b].from} to ${BANDS[b].to} nanometres`).join(", ")}`}>
          <div className="relative h-14 border-b border-white/40">
            {(Object.keys(BANDS) as Band[]).map((key) => {
              const band = BANDS[key];
              const on = mode.bands.includes(key);
              return (
                <span
                  key={key}
                  className="absolute bottom-0 transition-all duration-500"
                  style={{
                    left: `${pct(band.from)}%`,
                    width: `${pct(band.to) - pct(band.from)}%`,
                    height: on ? "100%" : "12%",
                    backgroundColor: band.color,
                    opacity: on ? 1 : 0.3,
                  }}
                />
              );
            })}
          </div>
          <div className="hw-label relative mt-2 h-4 text-white/60">
            {TICKS.map((nm) => (
              <span key={nm} className="absolute -translate-x-1/2" style={{ left: `${pct(nm)}%` }}>
                {nm}
              </span>
            ))}
          </div>
          <p className="hw-label mt-1 text-right text-white/60">Wavelength, nm</p>
        </div>

        <ul className="mt-6">
          {mode.bands.map((b) => (
            <li key={b} className="hw-rule grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-sm sm:gap-8">
              <span className="flex items-center gap-2.5 font-medium">
                <span className="size-2.5" style={{ backgroundColor: BANDS[b].color }} aria-hidden />
                {BANDS[b].name}
              </span>
              <span className="hw-label !text-[0.78rem]">
                {BANDS[b].from}–{BANDS[b].to} nm
              </span>
              <span className="hw-label !text-[0.78rem]">{BANDS[b].power}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
