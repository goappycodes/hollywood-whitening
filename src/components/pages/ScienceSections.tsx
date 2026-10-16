import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight, Quote } from "lucide-react";
import { getAboutContent, getCommonContent, getScienceContent } from "@/lib/content";
import { absoluteUrl, localePath, LOCALE_META, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { GetInTouch } from "@/components/ui/shared/sections/GetInTouch";

/**
 * "The Science & Technology behind Modern Laser Teeth Whitening" in any locale — the live
 * article's sections in order: title + quote, lead + benefits, intro copy, how a laser
 * works, what an SRD is, choosing a procedure (considerations), the four industry links,
 * and "Still got doubts?" (live: a Contact Form 7 form → here the site's form 3).
 *
 * Copy: src/content/<locale>/pages/science.json (scripts/science-scrape.mjs).
 */

const h2 = "text-[1.6rem] leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.6rem]";

/** "private label business" → "Private label business" (live labels are lower-case mid-sentence). */
const sentence = (s: string, lang: string) => s.charAt(0).toLocaleUpperCase(lang) + s.slice(1);

export function ScienceSections({ locale }: { locale: Locale }) {
  const c = getScienceContent(locale);
  const common = getCommonContent(locale);
  const lang = LOCALE_META[locale].htmlLang;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.title.bold} ${c.title.light}`,
    description: c.meta.description,
    url: absoluteUrl(locale, "science"),
    inLanguage: lang,
    image: `${SITE.url}${c.images.hero}`,
    publisher: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
  };

  return (
    <div lang={lang}>
      {/* Hero — split: title + quote, photo */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-brand/25 blur-[130px]" />
        <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
          <div className="min-w-0">
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
                  {common.nav.science}
                </li>
              </ol>
            </nav>
            <h1 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[2.75rem] xl:text-[3rem]">
              <span className="block font-bold">{c.title.bold}</span>
              <span className="block font-light">
                <span className="text-cyan-gradient">{c.title.light}</span>
              </span>
            </h1>
            {c.quote && (
              <figure className="mt-7 flex gap-3 border-l-2 border-cyan/60 pl-4">
                <Quote className="mt-1 size-4 shrink-0 -scale-x-100 fill-cyan text-cyan" aria-hidden />
                <blockquote className="text-sm leading-relaxed font-light text-white/80 italic sm:text-lg">
                  {c.quote}
                </blockquote>
              </figure>
            )}
          </div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/10">
            <Image src={c.images.hero} alt="" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Lead + benefits */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal className="min-w-0">
            <p className="text-[15px] leading-relaxed font-medium text-balance text-ink sm:text-xl lg:text-[1.4rem] lg:leading-snug">{c.lead}</p>
          </Reveal>
          <Reveal delay={0.08} className="min-w-0">
            <div className="rounded-[var(--radius-card)] border border-brand/15 bg-brand-sky/50 p-4 sm:p-7">
              <p className="text-[15px] leading-snug font-bold text-ink sm:text-base">{c.benefits.title.replace(/:$/, "")}</p>
              <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                {c.benefits.items.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/85 sm:gap-3 sm:text-[15px]">
                    <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-brand text-white sm:size-6">
                      <Check className="size-2.5 sm:size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: b }} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        {c.body.length > 0 && (
          <Reveal className="container-x mt-12 sm:mt-16">
            <div className="gap-12 border-t border-line pt-10 text-sm leading-relaxed text-ink/80 sm:text-base lg:columns-2 [&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2">
              {c.body.map((b, i) => (
                <p key={i} className="mb-4 break-inside-avoid" dangerouslySetInnerHTML={{ __html: b.html }} />
              ))}
            </div>
          </Reveal>
        )}
      </section>

      {/* How does a laser work? / What is an SRD? — one dark band, image + copy alternating */}
      <section className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-24 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute top-1/3 -right-40 size-[34rem] rounded-full bg-brand/25 blur-[140px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 -left-40 size-[28rem] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="container-x relative space-y-16 sm:space-y-24">
          {[
            { section: c.laser, image: c.images.pen, flip: false },
            { section: c.srd, image: c.images.led, flip: true },
          ].map(({ section, image, flip }, i) => (
            <div
              key={section.title}
              className={cn(
                "grid items-center gap-10 lg:gap-16",
                flip ? "md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" : "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
              )}
            >
              <Reveal className={cn("min-w-0", flip && "md:order-2")}>
                <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/10 md:max-w-none">
                  <Image src={image} alt="" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={0.06} className="min-w-0">
                <span className="font-display text-5xl font-bold text-cyan-gradient sm:text-6xl" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className={cn(h2, "mt-3 text-white")}>{section.title}</h2>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">
                  {section.blocks.map((blk, j) => (
                    <p key={j} dangerouslySetInnerHTML={{ __html: blk.html }} />
                  ))}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Choosing a laser teeth whitening procedure */}
      <section className="bg-gradient-to-b from-brand-sky/70 to-white py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
          <Reveal className="min-w-0">
            <h2 className={cn(h2, "lg:text-[2.2rem]")}>{c.considerations.title.replace(/:$/, "")}</h2>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.considerations.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 rounded-2xl border border-brand/15 bg-white p-4 shadow-soft">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-cyan font-display text-sm font-bold text-white tabular-nums shadow-[0_8px_20px_-8px_rgb(30_136_229/0.8)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-ink sm:text-[15px]" dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.08} className="min-w-0">
            <div className="relative mx-auto aspect-[1133/1600] max-w-xs overflow-hidden rounded-[2rem] shadow-lift sm:max-w-sm lg:max-w-none">
              <Image src={c.images.banner} alt="" fill sizes="(min-width: 1024px) 35vw, 80vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Industry links */}
      {c.industries.length > 0 && (
        <section className="bg-pearl py-16 sm:py-24">
          <div className="container-x">
            <Reveal>
              <h2 className={h2}>{common.science.industries}</h2>
            </Reveal>
            <ul className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              {c.industries.map((ind, i) => (
                <Reveal as="li" key={ind.href} delay={i * 0.05} className="w-[77%] shrink-0 snap-start sm:w-auto">
                  <Link
                    href={ind.href}
                    className="group block h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow hover:shadow-lift"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-pearl">
                      {ind.image && (
                        <Image
                          src={ind.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 77vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <span className="flex items-center justify-between gap-3 p-4 text-sm font-semibold sm:text-[15px] text-ink sm:p-5">
                      {sentence(ind.label, lang)}
                      <ArrowUpRight
                        className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <GetInTouch
        content={{
          eyebrow: common.nav.science,
          title: c.doubts.title.replace(/\s+\?/, "?"),
          body: c.doubts.body.replace(/\s+!/, "!"),
          callUs: getAboutContent(locale).contact.callUs,
        }}
        common={common}
        locale={locale}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
