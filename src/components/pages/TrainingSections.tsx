import Image from "next/image";
import { BadgeCheck, Check, ChevronDown, GraduationCap, ShieldCheck } from "lucide-react";
import {
  getCommonContent,
  getHomeContent,
  getTrainingContent,
  type ContentBlock,
  type TrainingContent,
} from "@/lib/content";
import { absoluteUrl, LOCALE_META, type Locale } from "@/lib/i18n";
import { PACKAGES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { GetInTouch } from "@/components/ui/shared/sections/GetInTouch";
import { PageHero } from "@/components/ui/shared/sections/PageHero";

/**
 * "Teeth Whitening Training" in any locale — the live page's sections in its order:
 * hero ("free training with all business packages"), intro + Safe & Superior, The
 * Technique (syllabus + certification), Why are we better? (comparison points +
 * advantages), FAQs, Start Today! (quote + form 3). The three packages sit before the
 * FAQ, since training comes with every package.
 *
 * Copy: src/content/<locale>/pages/training.json (scripts/training-scrape.mjs; Russian
 * is hand-translated — the live Russian page can't be reached, see the script).
 */

function Eyebrow({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return (
    <p className={cn("eyebrow", tone === "light" && "text-brand-glow")}>
      <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
      {children}
    </p>
  );
}

// 1.6rem on phones so single long compounds ("Zahnaufhellungstraining") fit a 375px line.
const h2 = "text-[1.6rem] leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.6rem]";

/** Live technique region → copy paragraphs | syllabus (heading + list) | certification note. */
function splitTechnique(blocks: ContentBlock[]) {
  const h = blocks.findIndex((b) => b.type === "h");
  const list = blocks.find((b): b is Extract<ContentBlock, { type: "ul" | "ol" }> => b.type === "ul");
  const heading = h >= 0 ? (blocks[h] as Extract<ContentBlock, { type: "h" }>).text : "";
  const after = h >= 0 ? blocks.slice(h + 1).filter((b) => b.type === "p") : [];
  return {
    copy: h >= 0 ? blocks.slice(0, h) : blocks,
    heading,
    // The live list's last item is a disclaimer ("…may not apply if you are not a dentist").
    items: list ? list.items.slice(0, -1) : [],
    disclaimer: list?.items.at(-1) ?? "",
    certification: after as Extract<ContentBlock, { type: "p" }>[],
  };
}

/** Result tint per comparison line, best → worst (the live list is in that order). */
const RESULT_TONES = [
  "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  "bg-sky-400/15 text-sky-300 ring-sky-400/30",
  "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  "bg-orange-400/15 text-orange-300 ring-orange-400/30",
  "bg-rose-400/15 text-rose-300 ring-rose-400/30",
];

function Comparison({ content }: { content: TrainingContent }) {
  const { comparison } = content;
  return (
    <section className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-24 lg:py-28">
      <Image
        src={content.images.better}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-right opacity-25"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />

      <div className="container-x">
        <Reveal>
          <Eyebrow tone="light">{content.better}</Eyebrow>
          <h2 className={cn(h2, "mt-4 font-display")}>{comparison.title}</h2>
        </Reveal>

        {/* machine + gel + training = result */}
        <ul className="mt-10 grid gap-3">
          {comparison.lines.map((line, i) => {
            const cut = line.indexOf("<strong>");
            const equation = cut >= 0 ? line.slice(0, cut) : line;
            const result =
              cut >= 0
                ? line
                    .slice(cut)
                    .replace(/<\/?strong>/g, "")
                    .replace(/^\s*=\s*/, "")
                : "";
            return (
              <Reveal as="li" key={i} delay={i * 0.05}>
                <div className="glass-dark flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
                  <span
                    className="text-sm text-white/75 sm:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: equation }}
                  />
                  {result && (
                    <span
                      className={cn(
                        "inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1",
                        RESULT_TONES[i] ?? RESULT_TONES.at(-1),
                      )}
                    >
                      <span aria-hidden>=</span>
                      {result}
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>

        {/* advantages */}
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comparison.advantages.map((a, i) => (
            <Reveal as="li" key={i} delay={Math.min(i, 6) * 0.04}>
              <div className="flex h-full items-start gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-sm leading-relaxed text-white/85" dangerouslySetInnerHTML={{ __html: a }} />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TrainingSections({ locale }: { locale: Locale }) {
  const c = getTrainingContent(locale);
  const common = getCommonContent(locale);
  const home = getHomeContent(locale);
  const lang = LOCALE_META[locale].htmlLang;
  const cap = (s: string) => s.charAt(0).toLocaleUpperCase(lang) + s.slice(1);
  const freeTraining = `${cap(c.hero.line1)} ${c.hero.line2}`;
  const technique = splitTechnique(c.technique.blocks);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.intro.title,
    description: c.meta.description,
    url: absoluteUrl(locale, "training"),
    inLanguage: lang,
    provider: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: ["online", "blended"] },
  };

  return (
    <div lang={lang}>
      <PageHero
        locale={locale}
        common={common}
        current={common.nav.training}
        image={{ src: c.images.hero, alt: c.intro.title, subject: "left" }}
        eyebrow={c.intro.title}
        titleBold={cap(c.hero.line1)}
        titleLight={c.hero.line2}
        subtitle={c.hero.title}
        cta={{ label: common.explorePackages, href: "#packages" }}
      />

      {/* Intro + Safe & Superior */}
      <section className="bg-white py-16 sm:py-24 lg:py-28">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="min-w-0">
              <Eyebrow>{c.hero.title}</Eyebrow>
              <h2 className={cn(h2, "mt-4 text-ink")}>{c.intro.title}</h2>
              <Prose blocks={c.intro.blocks} className="mt-6" />
            </Reveal>
            <Reveal delay={0.08} className="min-w-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
                <Image
                  src={c.images.intro}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12 sm:mt-16">
            <div className="grid overflow-hidden rounded-[var(--radius-card)] bg-navy text-white md:grid-cols-[18rem_1fr] lg:grid-cols-[22rem_1fr]">
              <div className="relative aspect-[16/10] md:aspect-auto">
                <Image
                  src={c.images.safe}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 22rem, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                  <ShieldCheck className="size-6 text-cyan" aria-hidden />
                  {c.safe.title}
                </p>
                <div className="mt-4 text-[15px] leading-relaxed text-white/75 [&_a]:text-cyan [&_a]:underline">
                  {c.safe.blocks.map(
                    (b, i) =>
                      b.type === "p" && (
                        <p key={i} className="mt-3 first:mt-0" dangerouslySetInnerHTML={{ __html: b.html }} />
                      ),
                  )}
                </div>
                {c.safe.cta && (
                  <Button href={c.safe.cta.href} variant="light" className="mt-6 w-full sm:w-auto">
                    {c.safe.cta.label}
                  </Button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The Technique — syllabus + certification */}
      <section className="bg-pearl py-16 sm:py-24 lg:py-28">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <Eyebrow>{c.results}</Eyebrow>
            <h2 className={cn(h2, "mt-4 text-ink")}>{c.technique.title}</h2>
          </Reveal>
          <Reveal className="mt-8 sm:mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] sm:aspect-[16/6]">
              <Image src={c.images.technique} alt="" fill sizes="100vw" className="object-cover object-center" />
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-14">
            <Reveal className="min-w-0">
              <Prose blocks={technique.copy} />
            </Reveal>

            <Reveal delay={0.08} className="min-w-0">
              <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-7">
                <p className="flex items-start gap-2.5 text-lg leading-snug font-bold text-ink">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-sky text-brand">
                    <GraduationCap className="size-4.5" aria-hidden />
                  </span>
                  {technique.heading}
                </p>
                <ul className="mt-5 grid gap-2.5">
                  {technique.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-sky text-brand">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
                {technique.disclaimer && (
                  <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted italic">
                    * <span dangerouslySetInnerHTML={{ __html: technique.disclaimer }} />
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          {technique.certification.map((p, i) => (
            <Reveal key={i} className="mt-8 sm:mt-10">
              <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-brand/15 bg-brand-sky/50 p-5 sm:flex-row sm:p-7">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
                  <BadgeCheck className="size-5" aria-hidden />
                </span>
                <p
                  className="text-[15px] leading-relaxed text-ink [&_strong]:font-medium"
                  dangerouslySetInnerHTML={{ __html: p.html }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Comparison content={c} />

      {/* Training comes with every package */}
      <div id="packages" className="scroll-mt-24">
        <RelatedProducts
          title={freeTraining}
          slugs={PACKAGES.map((p) => p.slug)}
          packages={home.packages}
          viewLabel={common.product.viewPackage}
          locale={locale}
          columns={3}
        />
      </div>

      {/* FAQs */}
      <section className="bg-pearl py-16 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
          <Reveal className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{c.whyUs}</Eyebrow>
              <h2 className={cn(h2, "mt-4 text-ink")}>{c.faq.title}</h2>
            </div>
          </Reveal>
          <div className="min-w-0 space-y-3">
            {c.faq.items.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i, 4) * 0.04}>
                <details
                  className="group rounded-2xl border border-line bg-white transition-colors open:border-brand/25 open:shadow-soft"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown
                      className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">
                    {f.a.map((a, j) => (
                      <p key={j} dangerouslySetInnerHTML={{ __html: a }} />
                    ))}
                  </div>
                </details>
              </Reveal>
            ))}
            {c.faq.closing && (
              <Reveal>
                <p className="pt-6 text-lg leading-snug font-semibold text-balance text-ink sm:text-xl">
                  {c.faq.closing}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <GetInTouch
        content={{
          eyebrow: c.intro.title,
          title: c.start.title,
          quote: c.start.quote ? { text: c.start.quote, author: c.start.author } : undefined,
        }}
        common={common}
        locale={locale}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
