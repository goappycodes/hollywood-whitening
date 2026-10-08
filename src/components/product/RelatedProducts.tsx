import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { fill, type HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { PACKAGES, type PackageSlug } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  title: string;
  slugs: string[];
  packages: HomeContent["packages"];
  viewLabel: string;
  locale: Locale;
};

/** Live "Related products" — as package cards (no price; links to each package page). */
export function RelatedProducts({ title, slugs, packages, viewLabel, locale }: Props) {
  const items = slugs.map((s) => PACKAGES.find((p) => p.slug === s)).filter((p) => p !== undefined);
  if (!items.length) return null;

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading align="left" title={title} />
        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {items.map((p, i) => {
            const card = packages.items[p.slug as PackageSlug];
            return (
              <Reveal as="li" key={p.slug} delay={i * 0.06}>
                <Link
                  href={pageHref(locale, p.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow hover:shadow-lift"
                >
                  <div className="relative aspect-[12/7] overflow-hidden bg-pearl">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="pill absolute top-3 left-3 bg-white/95 text-[10px] tracking-[0.12em] text-brand-deep">
                      {card.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-bold text-ink">
                      {p.name} <span className="block font-light text-muted">{packages.completePackage}</span>
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                      <Star className="size-4 fill-star text-star" aria-hidden />
                      <strong className="font-semibold text-ink">{p.rating.toFixed(1)}</strong>
                      <span>
                        ({fill(packages.ratingCount, { n: p.reviews })}) · {card.treatments}
                      </span>
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
                      {viewLabel}
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
