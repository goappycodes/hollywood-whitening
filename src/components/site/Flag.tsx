/**
 * Small rounded flag icons for the language switcher (GB · ES · DE · RU).
 * The rounded, overflow-hidden wrapper clips the SVG so no per-flag clipPath
 * ids are needed (safe to render the same flag multiple times).
 */

import { cn } from "@/lib/utils";

export type FlagCode = "gb" | "es" | "de" | "ru";

function Union() {
  // Simplified Union Jack — the wrapper clips the diagonals to the rounded box.
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function Bands({ colors, vertical = false }: { colors: string[]; vertical?: boolean }) {
  const n = colors.length;
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" className="h-full w-full">
      {colors.map((c, i) =>
        vertical ? (
          <rect key={i} x={(60 / n) * i} y="0" width={60 / n} height="30" fill={c} />
        ) : (
          <rect key={i} x="0" y={(30 / n) * i} width="60" height={30 / n} fill={c} />
        ),
      )}
    </svg>
  );
}

const FLAGS: Record<FlagCode, React.ReactNode> = {
  gb: <Union />,
  es: <Bands colors={["#AA151B", "#F1BF00", "#F1BF00", "#AA151B"]} />, // approx red/yellow/red
  de: <Bands colors={["#000000", "#DD0000", "#FFCE00"]} />,
  ru: <Bands colors={["#ffffff", "#0039A6", "#D52B1E"]} />,
};

export function Flag({ code, className }: { code: FlagCode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-[22px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10",
        className,
      )}
      aria-hidden
    >
      {FLAGS[code]}
    </span>
  );
}
