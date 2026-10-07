import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Award, Globe, Layers, Phone, ShieldCheck, Star, TrendingUp } from "lucide-react";
import type { CommonContent, HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { HERO_MEDIA, PACKAGES, SITE, STAT_VALUES } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

const avgRating = (PACKAGES.reduce((n, p) => n + p.rating, 0) / PACKAGES.length).toFixed(1);
const STAT_ICONS = { award: Award, globe: Globe, trend: TrendingUp, star: Star };

const rise = (d: number) => ({ "--rise-delay": `${d}s` }) as CSSProperties;

type Props = { content: HomeContent; common: CommonContent; locale: Locale };

export function Hero({ content, common, locale }: Props) {
  const { hero, stats } = content;
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <HeroVideo
          src={HERO_MEDIA.video}
          poster={HERO_MEDIA.poster}
          pauseLabel={hero.videoPause}
          playLabel={hero.videoPlay}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/4 -left-40 size-[36rem] rounded-full bg-brand/20 blur-[140px]"
        />

        <div className="container-x relative flex items-center pt-12 pb-20 sm:py-24 lg:min-h-[min(calc(100svh-7.5rem),54rem)] lg:py-28">
          <div className="max-w-3xl">
            <p className="rise pill glass-dark text-[10px] tracking-[0.1em] text-cyan sm:text-[11px] sm:tracking-[0.18em]" style={rise(0)}>
              <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
              {common.announcement}
            </p>
            <h1
              className="rise mt-6 font-display text-[min(7.4vw,1.75rem)] leading-[1.1] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]"
              style={rise(0.08)}
            >
              <span className="block font-bold whitespace-nowrap">
                <span className="text-cyan-gradient">Hollywood</span> Whitening™
              </span>{" "}
              <span className="block text-[0.8em] font-extralight tracking-[-0.02em] text-white/90">{hero.titleLight}</span>
            </h1>
            <p className="rise mt-5 max-w-xl text-[15px] leading-relaxed font-light text-white/80 sm:mt-6 sm:text-lg" style={rise(0.16)}>
              {hero.body}
            </p>

            <div className="rise mt-8 grid gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center" style={rise(0.26)}>
              <Link
                href={pageHref(locale, "contact")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold shadow-[0_12px_30px_-10px_rgb(30_136_229/0.9)] transition-colors hover:bg-brand-deep"
              >
                {hero.ctaPrimary}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="#packages"
                className="glass-dark inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/15"
              >
                <Layers className="size-4 text-cyan" aria-hidden />
                {hero.ctaSecondary}
              </Link>
              <a
                href={SITE.phones[0].href}
                className="inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white/80 hover:text-white sm:px-2 sm:py-3.5"
              >
                <Phone className="size-4 text-cyan" aria-hidden />
                {SITE.phones[0].display}
              </a>
            </div>

            <div
              className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/70 sm:mt-10"
              style={rise(0.32)}
            >
              <span className="flex items-center gap-2">
                <span className="flex" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-star text-star" />
                  ))}
                </span>
                <strong className="font-semibold text-white">{avgRating}/5</strong> {hero.avgRating}
              </span>
              <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-cyan" aria-hidden />
                {hero.trust}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Stats band */}
      <section aria-label={stats.label} className="border-b border-line bg-white">
        <dl className="container-x grid grid-cols-2 gap-x-4 gap-y-7 py-8 lg:grid-cols-4 lg:py-10">
          {STAT_VALUES.map((s, i) => {
            const Icon = STAT_ICONS[s.icon];
            return (
              <div key={s.icon} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <span className="inline-flex size-10 shrink-0 sm:size-12 items-center justify-center rounded-2xl bg-brand-sky text-brand">
                  <Icon className={`size-5 ${s.icon === "star" ? "fill-star text-star" : ""}`} aria-hidden />
                </span>
                <div className="flex min-w-0 flex-col-reverse">
                  <dt className="mt-0.5 text-xs leading-snug break-words hyphens-auto text-muted sm:text-[11px] sm:font-semibold sm:tracking-[0.12em] sm:uppercase">{stats.items[i]}</dt>
                  <dd className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{s.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </section>
    </>
  );
}
