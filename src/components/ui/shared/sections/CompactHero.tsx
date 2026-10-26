import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CommonContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Short navy hero for text and utility pages (legal, sitemap, verification checks):
 * breadcrumb, eyebrow pill, title, then optional `children` (a lead line or intro).
 * Pages with a banner photo use PageHero instead.
 */
export function CompactHero({
  locale,
  common,
  eyebrow,
  title,
  compact = false,
  children,
}: {
  locale: Locale;
  common: CommonContent;
  eyebrow: string;
  /** The <h1>, also the breadcrumb's current item. */
  title: string;
  /** Shorter on phones (sm+ unchanged), for pages whose content should reach the first screen. */
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-brand/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-40 size-[24rem] rounded-full bg-cyan/10 blur-[110px]"
      />
      <div className={cn("container-x relative sm:py-20 lg:py-24", compact ? "py-8" : "py-14")}>
        <nav aria-label={common.breadcrumb} className="text-xs text-white/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href={localePath(locale, "home")} className="transition-colors hover:text-white">
                {common.nav.home}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-white/30" />
            </li>
            <li aria-current="page" className="text-white/90">
              {title}
            </li>
          </ol>
        </nav>
        <p
          className={cn(
            "pill glass-dark text-[10px] tracking-[0.12em] text-cyan sm:mt-5 sm:text-[11px] sm:tracking-[0.18em]",
            compact ? "mt-3.5" : "mt-5",
          )}
        >
          <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
          {eyebrow}
        </p>
        <h1
          className={cn(
            "font-display leading-[1.08] font-bold tracking-[-0.035em] sm:mt-5 sm:text-5xl lg:text-[3.4rem]",
            compact ? "mt-3.5 text-[1.75rem]" : "mt-5 text-[2.1rem]",
          )}
        >
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}
