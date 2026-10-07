import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, align = "center", tone = "dark", className = "" }: Props) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <p className={`eyebrow ${center ? "justify-center" : ""} ${tone === "light" ? "text-brand-glow" : ""}`}>
          <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-4 text-[1.75rem] leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed sm:text-lg ${tone === "light" ? "text-white/70" : "text-muted"}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
