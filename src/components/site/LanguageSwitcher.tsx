"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { LOCALE_META, SWITCHER_ORDER, localePath, resolvePathname, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Flag } from "./Flag";

/**
 * Flag language switcher — mirrors allwhitelaser-next (and the live WordPress switcher).
 *
 * Selecting a flag navigates to the SAME page in that language (e.g. `/de/` → `/es/`;
 * later `/de/uber-uns/` → `/es/sobre-nosotros/`), resolved from the pathname with the
 * same registry the [[...lang]] route uses. Unknown paths fall back to that locale's home.
 */
export function LanguageSwitcher({
  tone = "dark",
  className,
  label,
  onNavigate,
}: {
  tone?: "light" | "dark";
  className?: string;
  /** Localised "Language" (aria) */
  label: string;
  /** Called when a language is selected — e.g. to close the mobile menu. */
  onNavigate?: () => void;
}) {
  const { locale: current, page } = resolvePathname(usePathname() ?? "/");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = tone === "light";
  const meta = LOCALE_META[current];
  const select = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${meta.native}`}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-colors",
          light ? "text-white/90 hover:bg-white/10" : "text-ink/80 hover:bg-ink/5",
        )}
      >
        <Flag code={meta.flag} />
        <span className="tracking-wide uppercase">{current}</span>
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            {SWITCHER_ORDER.map((code: Locale) => {
              const m = LOCALE_META[code];
              const active = code === current;
              return (
                <li key={code}>
                  <Link
                    href={localePath(code, page)}
                    role="option"
                    aria-selected={active}
                    hrefLang={m.htmlLang}
                    lang={m.htmlLang}
                    onClick={select}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors",
                      active ? "bg-pearl font-semibold text-ink" : "text-ink/80 hover:bg-pearl",
                    )}
                  >
                    <Flag code={m.flag} />
                    <span className="flex-1">{m.native}</span>
                    {active && <Check className="size-4 text-brand" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
