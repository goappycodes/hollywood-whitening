import Link from "next/link";
import { ChevronDown, ChevronRight, MessageCircle } from "lucide-react";
import { getCommonContent, getLegalContent, type LegalBlock, type LegalPage } from "@/lib/content";
import { absoluteUrl, localePath, LOCALE_META, pageHref, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

/**
 * Privacy, Terms and Warranty pages in any locale. The body is the live WordPress
 * text, scraped into blocks by scripts/legal-scrape.mjs (src/content/<locale>/pages/
 * {privacy,terms,warranty}.json); block html is reduced there to a/strong/em/br.
 */

/** The footer label is the page title; the live <h1> becomes the lead where it adds something. */
const SHOW_LEAD: Record<LegalPage, boolean> = { privacy: false, terms: true, warranty: true };

export function LegalSections({ page, locale }: { page: LegalPage; locale: Locale }) {
  const content = getLegalContent(page, locale);
  const common = getCommonContent(locale);
  const t = common.legal;
  const label = common.footer[page];

  // Stable, script-agnostic anchor ids (headings may be Cyrillic).
  let n = 0;
  const blocks = content.blocks.map((b) => (b.type === "h" ? { ...b, id: `section-${++n}` } : b)) as (LegalBlock & {
    id?: string;
  })[];
  const toc = blocks.filter((b): b is { type: "h"; text: string; id: string } => b.type === "h");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.meta.title,
    description: content.meta.description,
    url: absoluteUrl(locale, page),
    inLanguage: LOCALE_META[locale].htmlLang,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: common.nav.home, item: absoluteUrl(locale, "home") },
        { "@type": "ListItem", position: 2, name: label, item: absoluteUrl(locale, page) },
      ],
    },
  };

  const tocList = (
    <ol className="space-y-0.5 text-sm">
      {toc.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className="flex gap-3 rounded-lg px-3 py-2 text-muted transition-colors hover:bg-brand-sky/60 hover:text-brand-deep"
          >
            <span className="w-5 shrink-0 text-right text-xs font-semibold text-brand/70 tabular-nums">{i + 1}</span>
            <span className="min-w-0">{h.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      {/* compact hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-brand/25 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-40 size-[24rem] rounded-full bg-cyan/10 blur-[110px]"
        />
        <div className="container-x relative py-14 sm:py-20 lg:py-24">
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
                {label}
              </li>
            </ol>
          </nav>
          <p className="pill glass-dark mt-5 text-[10px] tracking-[0.12em] text-cyan sm:text-[11px] sm:tracking-[0.18em]">
            <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
            {t.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[2.1rem] leading-[1.08] font-bold tracking-[-0.035em] sm:text-5xl lg:text-[3.4rem]">
            {label}
          </h1>
          {SHOW_LEAD[page] && content.title && (
            <p className="mt-3 max-w-2xl text-xl leading-snug font-light sm:text-2xl">
              <span className="text-cyan-gradient">{content.title}</span>
            </p>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          {toc.length > 2 && (
            <>
              {/* phones/tablets: collapsible contents */}
              <details className="group rounded-2xl border border-line bg-pearl lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {t.onThisPage}
                  <ChevronDown className="size-4 text-brand transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="max-h-80 overflow-y-auto px-2 pb-3">{tocList}</div>
              </details>

              {/* desktop: sticky contents */}
              <aside className="hidden lg:block">
                <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2 pb-4">
                  <p className="px-3 text-xs font-semibold tracking-[0.16em] text-ink uppercase">{t.onThisPage}</p>
                  <div className="mt-3">{tocList}</div>
                </div>
              </aside>
            </>
          )}

          <div className={toc.length > 2 ? "min-w-0" : "min-w-0 lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-3xl"}>
            <article className="max-w-3xl text-[15px] leading-relaxed text-muted sm:text-base [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-deep [&_strong]:font-semibold [&_strong]:text-ink">
              {blocks.map((b, i) => {
                if (b.type === "h")
                  return (
                    <h2
                      key={i}
                      id={b.id}
                      className="mt-10 flex scroll-mt-28 items-start gap-3 text-xl leading-snug font-bold text-ink first:mt-0 sm:mt-12 sm:text-2xl"
                    >
                      <span aria-hidden className="mt-[0.55em] h-0.5 w-4 shrink-0 rounded-full bg-brand" />
                      {b.text}
                    </h2>
                  );
                if (b.type === "p") return <p key={i} className="mt-4" dangerouslySetInnerHTML={{ __html: b.html }} />;
                if (b.type === "ol")
                  return (
                    <ol key={i} className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brand">
                      {b.items.map((li, j) => (
                        <li key={j} className="pl-1" dangerouslySetInnerHTML={{ __html: li }} />
                      ))}
                    </ol>
                  );
                return (
                  <ul key={i} className="mt-4 space-y-2.5">
                    {b.items.map((li, j) => (
                      <li key={j} className="flex gap-3">
                        <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="min-w-0" dangerouslySetInnerHTML={{ __html: li }} />
                      </li>
                    ))}
                  </ul>
                );
              })}
            </article>

            {/* questions card */}
            {/* phones: centred stack; sm+: icon · text · button in a row */}
            <div className="mt-14 max-w-3xl rounded-[var(--radius-card)] border border-brand/15 bg-brand-sky/50 p-6 text-center sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-7 sm:text-left">
              <div className="sm:flex sm:items-center sm:gap-4">
                <span className="mx-auto grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white sm:mx-0 sm:size-11 sm:rounded-xl">
                  <MessageCircle className="size-5" aria-hidden />
                </span>
                <div className="mt-4 sm:mt-0">
                  <p className="text-lg leading-snug font-bold text-balance text-ink">{t.questionsTitle}</p>
                  <p className="mx-auto mt-1.5 max-w-xs text-sm text-balance text-muted sm:mx-0 sm:max-w-none">
                    {t.questionsBody}
                  </p>
                </div>
              </div>
              <Button href={pageHref(locale, "contact")} className="mt-5 w-full shrink-0 sm:mt-0 sm:w-auto">
                {t.contact}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
