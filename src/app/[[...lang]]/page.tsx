import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAboutContent,
  getContactContent,
  getHomeContent,
  getLegalContent,
  getProductContent,
  getTrainingContent,
} from "@/lib/content";
import {
  absoluteUrl,
  BUILT_PAGES,
  catchAllStaticParams,
  languageAlternates,
  LOCALE_META,
  LOCALES,
  resolveSegments,
  type BuiltPage,
  type Locale,
} from "@/lib/i18n";
import { HomeSections } from "@/components/pages/HomeSections";
import { AboutSections } from "@/components/pages/AboutSections";
import { ContactSections } from "@/components/pages/ContactSections";
import { LegalSections } from "@/components/pages/LegalSections";
import { ProductSections } from "@/components/pages/ProductSections";
import { TrainingSections } from "@/components/pages/TrainingSections";

/**
 * Localised catch-all, as in allwhitelaser-next: "/", "/es/", "/de/", "/ru/" (and,
 * as pages are added to BUILT_PAGES, their localised slugs). URLs come from
 * PAGE_SLUGS in src/lib/i18n.ts, which mirror the live WordPress URLs.
 *
 * `dynamicParams` is unavailable with Cache Components, so unknown paths are
 * rejected with notFound() instead.
 */
// The whole page depends on the locale param. Every locale URL is fully prerendered,
// so a navigation that waits for it (e.g. via the language switcher) is preferable to
// streaming in behind a placeholder.
export const instant = false;

export function generateStaticParams() {
  return catchAllStaticParams();
}

async function resolve(params: PageProps<"/[[...lang]]">["params"]) {
  const { lang } = await params;
  const resolved = resolveSegments(lang);
  if (!resolved || !(BUILT_PAGES as readonly string[]).includes(resolved.page)) notFound();
  return resolved as { locale: Locale; page: BuiltPage };
}

const PAGE_META: Record<BuiltPage, (locale: Locale) => { title: string; description: string }> = {
  home: (locale) => getHomeContent(locale).meta,
  about: (locale) => getAboutContent(locale).meta,
  contact: (locale) => getContactContent(locale).meta,
  training: (locale) => getTrainingContent(locale).meta,
  privacy: (locale) => getLegalContent("privacy", locale).meta,
  terms: (locale) => getLegalContent("terms", locale).meta,
  warranty: (locale) => getLegalContent("warranty", locale).meta,
  "star-one": (locale) => getProductContent("star-one", locale).meta,
  "comet-2": (locale) => getProductContent("comet-2", locale).meta,
  galaxy: (locale) => getProductContent("galaxy", locale).meta,
};

export async function generateMetadata({ params }: PageProps<"/[[...lang]]">): Promise<Metadata> {
  const { locale, page } = await resolve(params);
  const meta = PAGE_META[page](locale);
  const url = absoluteUrl(locale, page);
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: url, languages: languageAlternates(page) },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].ogLocale),
    },
  };
}

export default async function LocalizedPage({ params }: PageProps<"/[[...lang]]">) {
  const { locale, page } = await resolve(params);
  if (page === "about") return <AboutSections locale={locale} />;
  if (page === "contact") return <ContactSections locale={locale} />;
  if (page === "training") return <TrainingSections locale={locale} />;
  if (page === "privacy" || page === "terms" || page === "warranty") return <LegalSections page={page} locale={locale} />;
  if (page === "star-one" || page === "comet-2" || page === "galaxy")
    return <ProductSections product={page} locale={locale} />;
  return <HomeSections locale={locale} />;
}
