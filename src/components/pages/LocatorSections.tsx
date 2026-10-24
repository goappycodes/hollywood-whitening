import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { getCommonContent, getHomeContent, getLocatorContent } from "@/lib/content";
import { absoluteUrl, localePath, LOCALE_META, type Locale } from "@/lib/i18n";
import { LOCATOR_MEDIA } from "@/lib/site";
import { LocationFinder } from "@/components/locator/LocationFinder";
import { Marquee } from "@/components/home/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramFeed } from "@/components/ui/shared/sections/InstagramFeed";
import { PageHero } from "@/components/ui/shared/sections/PageHero";

/**
 * "Location Finder" in any locale. Mirrors the live /location-finder/ page — the
 * "Distribution & Treatment Centres Only" banner, the YITH store locator, and its
 * owner / liability notice — plus the homepage marquee and the Instagram feed.
 * Stores: src/lib/providers.ts. Copy: src/content/<locale>/pages/locator.json.
 */
export function LocatorSections({ locale }: { locale: Locale }) {
  const content = getLocatorContent(locale);
  const common = getCommonContent(locale);
  const home = getHomeContent(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.meta.title,
    description: content.meta.description,
    url: absoluteUrl(locale, "providers"),
    inLanguage: LOCALE_META[locale].htmlLang,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: common.nav.home, item: absoluteUrl(locale, "home") },
        { "@type": "ListItem", position: 2, name: common.nav.providers, item: absoluteUrl(locale, "providers") },
      ],
    },
  };

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      <PageHero
        locale={locale}
        common={common}
        current={common.nav.providers}
        image={{ src: LOCATOR_MEDIA.hero, alt: content.hero.imageAlt, subject: "left" }}
        eyebrow={content.hero.eyebrow}
        titleBold={content.hero.titleBold}
        titleLight={content.hero.titleLight}
        subtitle={content.hero.subtitle}
        cta={{ label: content.hero.cta, href: "#locator" }}
      />
      <Marquee items={home.marquee} />

      <section id="locator" className="scroll-mt-24 bg-pearl py-16 sm:py-24 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={content.locator.eyebrow} title={content.locator.title} />
          <Reveal className="mt-10 sm:mt-14">
            {/* Server-only env var, handed to the client component (it loads the Maps JS API). */}
            <LocationFinder t={content.locator} mapsKey={process.env.GOOGLE_MAPS_API_KEY} />
          </Reveal>

          <Reveal className="mt-6">
            <aside className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-sky text-brand">
                <Info className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-ink">{content.notice.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{content.notice.body}</p>
              </div>
              <Link
                href={`${localePath(locale, "contact")}#get-in-touch`}
                className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand sm:self-center"
              >
                {content.notice.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <InstagramFeed locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
