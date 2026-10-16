"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Accessible tabs (WAI-ARIA tabs pattern: arrow keys / Home / End move between tabs).
 * Panels are rendered on the server and passed in; inactive ones are `hidden`, so all
 * content stays in the HTML for search engines. Phones/tablets: a tab row that scrolls
 * sideways above the panel. Desktop: a vertical tab list beside the panel, so the panel
 * fills the row instead of leaving its right side empty.
 */
export function Tabs({
  tabs,
  label,
  tone = "light",
}: {
  tabs: { label: string; content: ReactNode }[];
  label: string;
  /** "dark" for tabs on a navy section: translucent inactive tabs (the panel stays white). */
  tone?: "light" | "dark";
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? active === last
          ? 0
          : active + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? active === 0
            ? last
            : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
    refs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:sticky lg:top-28 lg:flex-col lg:flex-nowrap lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors lg:w-full lg:rounded-xl lg:px-5 lg:py-3.5 lg:text-left lg:whitespace-normal",
              i === active
                ? "border-brand bg-brand text-white shadow-[0_8px_20px_-10px_rgb(30_136_229/0.8)]"
                : tone === "dark"
                  ? "border-white/15 bg-white/[0.06] text-white/80 hover:border-cyan/50 hover:text-white"
                  : "border-line bg-white text-ink/75 hover:border-brand/40 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-5 focus-visible:outline-2 focus-visible:outline-brand sm:mt-8 sm:p-8 lg:mt-0 lg:min-h-full lg:p-10"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
