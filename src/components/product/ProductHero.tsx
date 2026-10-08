import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Phone, Sparkles, Star, Tag } from "lucide-react";
import { fill, type CommonContent, type HomeContent, type ProductContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { SITE, type Package } from "@/lib/site";
import { Prose } from "@/components/ui/Prose";
import { ProductGallery } from "./ProductGallery";

type Props = {
  content: ProductContent;
  pkg: Package;
  /** The homepage's card copy for this package (badge, treatments, features). */
  card: HomeContent["packages"]["items"]["star-one"];
  packages: HomeContent["packages"];
  common: CommonContent;
  locale: Locale;
};

/**
 * Product hero: gallery left, details right. Enquiry-led like allwhitelaser-next — the
 * live "Call for Price" becomes a price-on-application card that leads to the
 * "Register Your Interest" form; there is no price, quantity or basket.
 */
export function ProductHero({ content, pkg, card, packages, common, locale }: Props) {
  const t = common.product;
  // "Star One™ Complete Package" / "Paquete completo Star One™" → bold model + light remainder.
  const rest = content.name
    .replace(pkg.name, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  // Intro: the copy, then (last) the live "Pictures are for illustration only…" note.
  const lead = content.intro.length > 1 ? content.intro.slice(0, -1) : content.intro;
  const notes = content.intro.length > 1 ? content.intro.slice(-1) : [];

  // overflow-x-clip, not overflow-hidden: a hidden overflow makes the section a scroll
  // container, which breaks the sticky gallery.
  return (
    <section className="relative overflow-x-clip bg-pearl">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 size-[34rem] rounded-full bg-brand/10 blur-[130px]"
      />
      <div className="container-x relative py-8 sm:py-12 lg:py-16">
        <nav aria-label={common.breadcrumb} className="text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href={localePath(locale, "home")} className="transition-colors hover:text-ink">
                {common.nav.home}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-ink/25" />
            </li>
            <li>
              <Link href={`${localePath(locale, "home")}#packages`} className="transition-colors hover:text-ink">
                {common.nav.products}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-ink/25" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {pkg.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 xl:gap-20">
          {/* Sticky beside the (taller) details column on desktop */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              images={content.gallery}
              labels={{
                prev: t.prevImage,
                next: t.nextImage,
                show: t.showImage,
                open: t.openGallery,
                close: t.closeGallery,
              }}
            />
            {notes.map(
              (n, i) =>
                n.type === "p" && (
                  <p
                    key={i}
                    className="mt-3 text-xs leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{ __html: n.html }}
                  />
                ),
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill bg-brand-sky text-[10px] tracking-[0.12em] text-brand-deep">
                {content.category}
              </span>
              <span className="pill bg-navy text-[10px] tracking-[0.12em] text-cyan">
                <Sparkles className="size-3" aria-hidden />
                {card.badge}
              </span>
            </div>

            <h1 className="mt-4 font-display text-[2.3rem] leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.4rem]">
              <span className="block font-bold">{pkg.name}</span>
              {rest && <span className="block font-light text-brand-gradient">{rest}</span>}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span
                className="flex items-center gap-1.5"
                role="img"
                aria-label={fill(packages.ratingAria, { r: pkg.rating.toFixed(2), n: pkg.reviews })}
              >
                <span className="flex" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-star text-star" />
                  ))}
                </span>
                <strong className="font-semibold text-ink">{pkg.rating.toFixed(1)}</strong>
                <span className="text-muted">({fill(packages.ratingCount, { n: pkg.reviews })})</span>
              </span>
              <span className="h-4 w-px bg-line" aria-hidden />
              <span className="font-semibold text-brand-deep">{fill(packages.results, { n: pkg.results })}</span>
            </div>

            {lead.length > 0 && <Prose blocks={lead} className="mt-5" />}

            {/* Package highlights — the homepage card's list */}
            <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{t.highlights}</p>
              <p className="mt-2 text-lg font-bold text-ink">{card.treatments}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-sky text-brand">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price on application — replaces the live price + basket */}
            <div id="price-cta" className="mt-4 rounded-[var(--radius-card)] bg-navy p-5 text-white sm:p-6">
              <p className="flex items-center gap-2 text-lg font-bold">
                <Tag className="size-4 text-cyan" aria-hidden />
                {content.callForPrice}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{t.priceNote}</p>
              <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap">
                <a
                  href="#enquire"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold shadow-[0_12px_30px_-10px_rgb(30_136_229/0.9)] transition-colors hover:bg-brand-deep"
                >
                  {content.formTitle}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </a>
                <a
                  href={SITE.phones[0].href}
                  className="glass-dark inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/15"
                >
                  <Phone className="size-4 text-cyan" aria-hidden />
                  {t.speak}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
