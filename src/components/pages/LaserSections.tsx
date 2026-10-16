import { Crown, Sparkles } from "lucide-react";
import { getAboutContent, getCommonContent, getLaserContent, type LaserContent } from "@/lib/content";
import { absoluteUrl, LOCALE_META, pageHref, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { Tabs } from "@/components/ui/Tabs";
import { GetInTouch } from "@/components/ui/shared/sections/GetInTouch";
import { PageHero } from "@/components/ui/shared/sections/PageHero";

/**
 * "Laser Teeth Whitening" treatment guide in any locale — the live page's sections in
 * order: banner + contact, "Comparison & Treatment Guide Prices" (Professional vs Basic Spa
 * + the comparison table), "Information" tabs, FAQ. A contact form closes the page.
 *
 * Copy: src/content/<locale>/pages/laser.json (scripts/science-scrape.mjs).
 */

const h2 = "text-[1.6rem] leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.6rem]";
const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").trim();

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="eyebrow">
      <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
      {children}
    </p>
  );
}

/** A table value: 1–10 scores get a bar; anything else ("Require Less Time") stays text. */
function Score({ value, featured, outOf }: { value: string; featured: boolean; outOf: string }) {
  const n = /^\d+$/.test(value) ? Number(value) : null;
  if (n === null || n > 10) return <span className="text-[13px] font-medium text-ink sm:text-sm">{value}</span>;
  return (
    <span className="flex items-center gap-2" aria-label={`${n} ${outOf}`}>
      <span className="h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-line" aria-hidden>
        <span
          className={cn("block h-full rounded-full", featured ? "bg-gradient-to-r from-brand to-cyan" : "bg-ink/35")}
          style={{ width: `${n * 10}%` }}
        />
      </span>
      <span className="w-5 shrink-0 text-right text-sm font-semibold text-ink tabular-nums" aria-hidden>
        {n}
      </span>
    </span>
  );
}

type Table = NonNullable<LaserContent["table"]>;

/**
 * Phones: the 3-column table is too cramped, so each criterion becomes a row — label on
 * top, the two treatments' scores side by side underneath — under a legend card.
 */
function ComparisonList({ table, outOf }: { table: Table; outOf: string }) {
  const dot = ["bg-gradient-to-r from-brand to-cyan", "bg-ink/35"];
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft md:hidden">
      <p className="sr-only">{table.title}</p>
      <div className="grid grid-cols-2 border-b border-line">
        {table.columns.map((col, i) => (
          <div key={col.title} className={cn("p-4", i === 0 ? "bg-brand-sky/50" : "border-l border-line")}>
            <span className="flex items-center gap-2">
              <span className={cn("size-2.5 shrink-0 rounded-full", dot[i])} aria-hidden />
              <span className="text-sm leading-tight font-bold text-ink">{col.title}</span>
            </span>
            <span className={cn("mt-1 block pl-4.5 text-xs font-semibold", i === 0 ? "text-brand-deep" : "text-muted")}>
              {col.price}
            </span>
          </div>
        ))}
      </div>
      <dl className="divide-y divide-line">
        {table.rows.map(([label, ...values]) => (
          <div key={label} className="px-4 py-3.5">
            <dt className="text-[13px] font-semibold text-ink">{label}</dt>
            <dd className="mt-2 grid grid-cols-2 gap-4">
              {values.map((v, i) => (
                <span key={i} className="min-w-0">
                  <span className="sr-only">{table.columns[i]?.title}: </span>
                  <Score value={v} featured={i === 0} outOf={outOf} />
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ComparisonTable({ table, criteria, outOf }: { table: Table; criteria: string; outOf: string }) {
  return (
    <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-soft md:block">
      <table className="w-full table-fixed text-left">
        <caption className="sr-only">{table.title}</caption>
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="w-[38%] px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-muted uppercase sm:w-auto sm:px-6"
            >
              {criteria}
            </th>
            {table.columns.map((col, i) => (
              <th
                key={col.title}
                scope="col"
                className={cn("px-3 py-4 align-bottom sm:px-6", i === 0 && "bg-brand-sky/50")}
              >
                <span className="block text-[13px] font-bold text-ink sm:text-base">{col.title}</span>
                <span
                  className={cn(
                    "mt-1 block text-[12px] font-semibold sm:text-sm",
                    i === 0 ? "text-brand-deep" : "text-muted",
                  )}
                >
                  {col.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {table.rows.map(([label, ...values]) => (
            <tr key={label}>
              <th
                scope="row"
                className="px-3 py-3 text-[13px] font-medium break-words hyphens-auto text-ink/80 sm:px-6 sm:text-sm"
              >
                {label}
              </th>
              {values.map((v, i) => (
                <td key={i} className={cn("px-3 py-3 sm:px-6", i === 0 && "bg-brand-sky/50")}>
                  <Score value={v} featured={i === 0} outOf={outOf} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LaserSections({ locale }: { locale: Locale }) {
  const c = getLaserContent(locale);
  const common = getCommonContent(locale);
  const t = common.science;
  const lang = LOCALE_META[locale].htmlLang;
  const firstTab = c.info.tabs[0]?.blocks.find((b) => b.type === "p");
  const subtitle = firstTab?.type === "p" ? stripTags(firstTab.html) : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: c.meta.title,
    description: c.meta.description,
    url: absoluteUrl(locale, "laser"),
    inLanguage: lang,
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: c.faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a.map(stripTags).join(" ") },
      })),
    },
  };

  return (
    <div lang={lang}>
      <PageHero
        locale={locale}
        common={common}
        current={c.title}
        image={{ src: c.images.hero, alt: c.title, subject: "right" }}
        eyebrow={t.treatmentGuide}
        titleBold={c.title}
        subtitle={subtitle}
        cta={{ label: c.contact?.label ?? common.nav.contact, href: pageHref(locale, "contact") }}
      />

      {/* Comparison & treatment guide prices */}
      <section className="bg-gradient-to-b from-brand-sky/70 to-white py-16 sm:py-24 lg:py-28">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <Eyebrow>{t.treatmentGuide}</Eyebrow>
            <h2 className={cn(h2, "mt-4")}>{c.comparisonTitle}</h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
            {c.options.map((o, i) => {
              const featured = i === 0;
              const Icon = featured ? Crown : Sparkles;
              return (
                <Reveal key={o.title} delay={i * 0.06} className="min-w-0">
                  <article
                    className={cn(
                      "h-full rounded-[var(--radius-card)] p-6 sm:p-8",
                      featured ? "bg-navy text-white ring-1 ring-brand/50" : "border border-line bg-pearl text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-xl",
                        featured ? "bg-brand text-white" : "bg-white text-brand ring-1 ring-line",
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className={cn("mt-5 text-xl font-bold sm:text-2xl", featured ? "text-white" : "text-ink")}>
                      {o.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed sm:text-[15px] [&_a]:underline [&_strong]:font-semibold",
                        featured
                          ? "text-white/75 [&_a]:text-cyan [&_strong]:text-white"
                          : "text-muted [&_a]:text-brand [&_strong]:text-ink",
                      )}
                      dangerouslySetInnerHTML={{ __html: o.html }}
                    />
                  </article>
                </Reveal>
              );
            })}
          </div>

          {c.table && (
            <Reveal className="mt-8 sm:mt-10">
              <ComparisonList table={c.table} outOf={t.outOf} />
              <ComparisonTable table={c.table} criteria={t.criteria} outOf={t.outOf} />
            </Reveal>
          )}
        </div>
      </section>

      {/* Information tabs */}
      <section className="relative isolate overflow-hidden bg-navy py-16 text-white sm:py-24 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 size-[34rem] rounded-full bg-brand/25 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-cyan/10 blur-[120px]"
        />
        <div className="container-x relative">
          <Reveal>
            <h2 className={h2.replace("text-ink", "text-white")}>{c.info.title}</h2>
          </Reveal>
          <div className="mt-8 sm:mt-10">
            <Tabs
              tone="dark"
              label={c.info.title}
              tabs={c.info.tabs.map((tab) => ({
                label: tab.label,
                content: <Prose blocks={tab.blocks} />,
              }))}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-pearl py-16 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16">
          <Reveal className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{c.faq.subtitle}</Eyebrow>
              <h2 className={cn(h2, "mt-4")}>{c.faq.title}</h2>
            </div>
          </Reveal>
          <div className="min-w-0">
            <FaqAccordion items={c.faq.items} tone="white" />
          </div>
        </div>
      </section>

      <GetInTouch content={{ ...getAboutContent(locale).contact, eyebrow: c.title }} common={common} locale={locale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
