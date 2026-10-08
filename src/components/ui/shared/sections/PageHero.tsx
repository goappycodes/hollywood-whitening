import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import type { CommonContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const rise = (d: number) => ({ "--rise-delay": `${d}s` }) as CSSProperties;

/**
 * Per-side classes, written out in full so Tailwind sees them. `subject` is where
 * the person in the photo stands; the copy goes on the opposite side, over a navy
 * veil that fades in from that side.
 */
const SIDE = {
  left: {
    image: "object-[18%_center] lg:object-left",
    veil: "bg-gradient-to-l",
    copy: "lg:justify-end",
    glow: "-right-40",
  },
  right: {
    image: "object-[85%_center] lg:object-right",
    veil: "bg-gradient-to-r",
    copy: "lg:justify-start",
    glow: "-left-40",
  },
} as const;

type Props = {
  locale: Locale;
  common: CommonContent;
  /** Breadcrumb label for this page. */
  current: string;
  image: { src: string; alt: string; subject: keyof typeof SIDE };
  eyebrow: string;
  titleBold: string;
  titleLight: string;
  subtitle: string;
  cta: { label: string; href: string };
  /** Optional row under the CTAs (e.g. a quote credit). */
  footer?: ReactNode;
};

/**
 * Inner-page hero: the live page's banner photo with a navy veil, the copy beside the
 * subject, a two-weight title (bold, then light) as on the homepage. On phones the
 * photo stacks above the copy.
 */
export function PageHero({ locale, common, current, image, eyebrow, titleBold, titleLight, subtitle, cta, footer }: Props) {
  const side = SIDE[image.subject];
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div className="relative aspect-[16/10] sm:aspect-[16/8] lg:absolute lg:inset-0 lg:aspect-auto">
        <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className={cn("object-cover", side.image)} />
        {/* phones: fade the photo into the navy copy block below */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy lg:hidden" />
        {/* desktop: navy veil behind the copy */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 hidden from-navy from-35% via-navy/85 via-55% to-navy/0 to-80% lg:block",
            side.veil,
          )}
        />
      </div>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute bottom-0 size-[32rem] rounded-full bg-brand/25 blur-[140px]", side.glow)}
      />

      <div
        className={cn(
          "container-x relative -mt-6 pb-16 sm:-mt-10 sm:pb-20 lg:mt-0 lg:flex lg:min-h-[min(calc(100svh-7.5rem),46rem)] lg:items-center lg:py-24",
          side.copy,
        )}
      >
        <div className="lg:w-[56%] xl:w-[52%]">
          <nav aria-label={common.breadcrumb} className="rise text-xs text-white/60" style={rise(0)}>
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
                {current}
              </li>
            </ol>
          </nav>

          <p
            className="rise pill glass-dark mt-5 text-[10px] tracking-[0.12em] text-cyan sm:text-[11px] sm:tracking-[0.18em]"
            style={rise(0.05)}
          >
            <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
            {eyebrow}
          </p>

          <h1
            className="rise mt-5 font-display text-[2.1rem] leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[3.3rem] xl:text-[3.5rem]"
            style={rise(0.1)}
          >
            <span className="block font-bold">{titleBold}</span>
            <span className="block font-light">
              <span className="text-cyan-gradient">{titleLight}</span>
            </span>
          </h1>

          <p className="rise mt-5 max-w-lg text-[15px] leading-relaxed font-light text-white/80 sm:text-lg" style={rise(0.18)}>
            {subtitle}
          </p>

          <div className="rise mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center" style={rise(0.26)}>
            <a
              href={cta.href}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold shadow-[0_12px_30px_-10px_rgb(30_136_229/0.9)] transition-colors hover:bg-brand-deep"
            >
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href={SITE.phones[0].href}
              className="inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white/80 hover:text-white sm:px-2 sm:py-3.5"
            >
              <Phone className="size-4 text-cyan" aria-hidden />
              {SITE.phones[0].display}
            </a>
          </div>

          {footer && (
            <div className="rise mt-9 border-t border-white/10 pt-6" style={rise(0.34)}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
