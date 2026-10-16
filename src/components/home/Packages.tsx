import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone, Star } from "lucide-react";
import { fill, type HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { PACKAGES, SITE, type Package, type PackageSlug } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Copy = HomeContent["packages"];

const TIER_STYLES: Record<PackageSlug, string> = {
  "star-one": "bg-ink/5 text-ink/70",
  "comet-2": "bg-brand/20 text-cyan",
  galaxy: "bg-violet-100 text-violet-700",
};

function Rating({ value, reviews, dark, copy }: { value: number; reviews: number; dark: boolean; copy: Copy }) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={fill(copy.ratingAria, { r: value.toFixed(2), n: reviews })}
    >
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3.5 ${i < Math.round(value) ? "fill-star text-star" : dark ? "text-white/20" : "text-ink/15"}`}
          />
        ))}
      </div>
      <span className={`text-xs ${dark ? "text-white/60" : "text-muted"}`}>
        <strong className={dark ? "text-white" : "text-ink"}>{value.toFixed(2)}</strong> ({fill(copy.ratingCount, { n: reviews })})
      </span>
    </div>
  );
}

type CardProps = { pkg: Package; index: number; copy: Copy; locale: Locale };

function PackageCard({ pkg, index, copy, locale }: CardProps) {
  const dark = !!pkg.featured;
  const text = copy.items[pkg.slug];
  const title = `${pkg.name} ${copy.completePackage}`;
  return (
    <Reveal
      delay={index * 0.1}
      className={`h-auto w-[86%] shrink-0 snap-center sm:w-[60%] lg:h-full lg:w-auto ${dark ? "lg:-my-8" : ""}`}
    >
      <article
        className={`group relative flex h-full flex-col rounded-[1.75rem] p-5 transition-transform duration-500 hover:-translate-y-1.5 sm:p-7 ${
          dark
            ? "bg-gradient-to-b from-navy-2 to-navy text-white shadow-[0_12px_24px_-14px_rgb(5_11_26/0.55)] ring-1 ring-brand/60 lg:shadow-[0_30px_60px_-20px_rgb(5_11_26/0.6)]"
            : "border border-line bg-pearl text-ink"
        }`}
      >
        {dark && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-cyan px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] whitespace-nowrap uppercase shadow-lg">
            {copy.mostPopular}
          </span>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className={`text-[11px] font-bold tracking-[0.18em] uppercase ${dark ? "text-cyan" : "text-muted"}`}>
            {text.badge}
          </span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] whitespace-nowrap uppercase ${TIER_STYLES[pkg.slug]}`}
          >
            {text.tier}
          </span>
        </div>

        <h3 className={`mt-3 text-2xl font-bold tracking-tight sm:mt-4 sm:text-3xl ${dark ? "text-white" : "text-ink"}`}>{pkg.name}</h3>
        <p className={`mt-1 text-sm ${dark ? "text-white/60" : "text-muted"}`}>{copy.completePackage}</p>
        <div className="mt-3">
          <Rating value={pkg.rating} reviews={pkg.reviews} dark={dark} copy={copy} />
        </div>

        <div
          className={`relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl sm:mt-6 ${dark ? "bg-white" : "bg-white ring-1 ring-line"}`}
        >
          <Image
            src={pkg.image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Results score sits on the image, so the treatments line below keeps one line */}
          <span className="absolute top-2.5 right-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-emerald-700 shadow-soft ring-1 ring-emerald-500/20 backdrop-blur">
            {fill(copy.results, { n: pkg.results })}
          </span>
        </div>

        <p
          className={`mt-3 rounded-2xl px-4 py-3 text-sm font-bold sm:mt-4 sm:p-4 sm:text-base ${
            dark ? "bg-white/[0.06] text-white ring-1 ring-white/10" : "bg-white text-ink ring-1 ring-line"
          }`}
        >
          {text.treatments}
        </p>

        <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {text.features.map((f) => (
            <li key={f} className={`flex items-center gap-3 text-sm ${dark ? "text-white/85" : "text-graphite"}`}>
              <span
                className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
                  dark ? "bg-cyan text-navy" : "bg-emerald-500 text-white"
                }`}
              >
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-2 pt-6 sm:space-y-2.5 sm:pt-8">
          <Link
            href={pageHref(locale, pkg.slug)}
            // Visible label is short ("Get Started"); the accessible name keeps the package.
            aria-label={fill(copy.getStartedWith, { name: pkg.name })}
            className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-[13px] font-semibold transition-all sm:gap-2 sm:py-3.5 sm:text-sm ${
              dark
                ? "bg-gradient-to-r from-brand to-cyan text-white hover:opacity-90"
                : "bg-navy text-white hover:bg-brand"
            }`}
          >
            {copy.getStarted} <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href={SITE.phones[0].href}
            className={`flex items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors sm:gap-2 sm:py-3 sm:text-sm ${
              dark ? "border-white/15 text-white/80 hover:bg-white/10" : "border-line bg-white text-ink hover:border-ink/30"
            }`}
          >
            <Phone className="size-4" aria-hidden /> {copy.callForPrice}
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export function Packages({ content, locale }: { content: Copy; locale: Locale }) {
  return (
    <section id="packages" className="scroll-mt-24 bg-white py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          intro={content.intro}
        />
        {/* Phones/tablets: swipeable row (next card peeks). Desktop: three-column grid.
            The row scrolls, so it clips anything outside it: below lg the featured card gets a
            small shadow that fits inside the bottom padding (the large one would end in a hard edge). */}
        <div className="-mx-5 mt-8 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 pt-5 pb-8 [scrollbar-width:none] sm:-mx-8 sm:mt-12 sm:px-8 lg:mx-0 lg:mt-20 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pt-0 lg:pb-0 xl:gap-8 [&::-webkit-scrollbar]:hidden">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.slug} pkg={pkg} index={i} copy={content} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
