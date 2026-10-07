import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHomeContent } from "@/lib/content";
import {
  absoluteUrl,
  catchAllStaticParams,
  languageAlternates,
  LOCALE_META,
  LOCALES,
  resolveSegments,
} from "@/lib/i18n";
import { HomeSections } from "@/components/pages/HomeSections";

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
  if (!resolved || resolved.page !== "home") notFound();
  return resolved;
}

export async function generateMetadata({ params }: PageProps<"/[[...lang]]">): Promise<Metadata> {
  const { locale, page } = await resolve(params);
  const { meta } = getHomeContent(locale);
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
  const { locale } = await resolve(params);
  return <HomeSections locale={locale} />;
}
