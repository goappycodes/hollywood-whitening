import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CommonContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

type Crumb = { label: string; href?: string };

/** Compact navy hero for the blog (same treatment as the legal pages' hero). */
export function BlogHero({
  locale,
  common,
  crumbs,
  eyebrow,
  title,
  children,
}: {
  locale: Locale;
  common: CommonContent;
  /** Trail after "Home"; the last one is the current page. */
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-brand/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-40 size-[24rem] rounded-full bg-cyan/10 blur-[110px]" />
      <div className="container-x relative py-14 sm:py-20 lg:py-24">
        <nav aria-label={common.breadcrumb} className="text-xs text-white/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href={localePath(locale, "home")} className="transition-colors hover:text-white">
                {common.nav.home}
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={i} className="flex min-w-0 items-center gap-1.5">
                <ChevronRight aria-hidden className="size-3.5 shrink-0 text-white/30" />
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="line-clamp-1 text-white/90">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="pill glass-dark mt-5 text-[10px] tracking-[0.12em] text-cyan sm:text-[11px] sm:tracking-[0.18em]">
          <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-[2.1rem] leading-[1.08] font-bold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}
