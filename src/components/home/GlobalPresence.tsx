import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, MapPin, Sparkles } from "lucide-react";
import type { HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { GLOBAL_IMAGE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GlobalPresence({ content, locale }: { content: HomeContent["global"]; locale: Locale }) {
  return (
    <section className="bg-pearl py-16 sm:py-24 lg:py-32">
      <div className="container-x grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[16/9] lg:aspect-[4/3]">
            <Image
              src={GLOBAL_IMAGE}
              alt={content.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-4 pt-20 sm:p-5 sm:pt-24">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-4 backdrop-blur">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-brand uppercase">{content.caption.kicker}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{content.caption.text}</p>
                </div>
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                  <Globe className="size-5" aria-hidden />
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading align="left" eyebrow={content.eyebrow} title={content.title} intro={content.body} />
          <Reveal delay={0.1} className="mt-7 flex flex-wrap gap-2">
            {content.regions.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink shadow-soft"
              >
                <MapPin className="size-3.5 text-brand" aria-hidden />
                {r}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <div className="rounded-[var(--radius-card)] border border-brand/15 bg-brand-sky/60 p-5 sm:p-6">
              {/* Icon shares the title row so the text gets the full card width on phones */}
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white sm:size-11">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <h3 className="font-bold text-ink">{content.supportTitle}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{content.supportText}</p>
              <div className="mt-5 grid gap-2.5 text-sm font-semibold sm:flex sm:flex-wrap sm:gap-3">
                <Link
                  href={pageHref(locale, "contact")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-3 text-white transition-colors hover:bg-brand-deep"
                >
                  {content.becomeProvider} <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href={pageHref(locale, "about")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-white px-5 py-3 text-ink transition-colors hover:border-ink"
                >
                  {content.learnMore} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
