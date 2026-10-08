/**
 * Hand-rolled i18n, following allwhitelaser-next (no middleware, no i18n library).
 *
 * Locales mirror the live WordPress language switcher: English has no prefix,
 * the others live under /es/, /de/, /ru/. PAGE_SLUGS mirror the live WordPress
 * URLs exactly (Russian slugs are stored decoded), so pages can take over
 * 1:1 without redirects.
 *
 * Only pages listed in BUILT_PAGES are rendered by this app (via the
 * src/app/[[...lang]] catch-all); every other key is still a valid link target.
 */
import type { FlagCode } from "@/components/site/Flag";
import { SITE } from "./site";

export const LOCALES = ["en", "es", "de", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export type LocaleMeta = {
  /** English name (aria labels) */
  label: string;
  /** Name in its own language (switcher) */
  native: string;
  short: string;
  htmlLang: string;
  ogLocale: string;
  flag: FlagCode;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { label: "English", native: "English", short: "EN", htmlLang: "en-GB", ogLocale: "en_GB", flag: "gb" },
  es: { label: "Spanish", native: "Español", short: "ES", htmlLang: "es-ES", ogLocale: "es_ES", flag: "es" },
  de: { label: "German", native: "Deutsch", short: "DE", htmlLang: "de-DE", ogLocale: "de_DE", flag: "de" },
  ru: { label: "Russian", native: "Русский", short: "RU", htmlLang: "ru-RU", ogLocale: "ru_RU", flag: "ru" },
};

/** Order of languages in the switcher (matches the live WordPress switcher). */
export const SWITCHER_ORDER: Locale[] = ["en", "es", "de", "ru"];

export const PAGE_SLUGS = {
  home: { en: "", es: "", de: "", ru: "" },
  science: {
    en: "the-science-technology-behind-modern-laser-teeth-whitening",
    es: "la-ciencia-y-la-tecnologia-detras-del-blanqueamiento-dental-laser-moderno",
    de: "die-wissenschaft-und-technologie-hinter-der-modernen-laser-zahnaufhellung",
    ru: "наука-технология-за-современным-лазе",
  },
  faq: {
    en: "laser-teeth-whitening",
    es: "blanqueamiento-dental-con-laser",
    de: "laser-zahnaufhellung",
    ru: "лазерное-отбеливание-зубов",
  },
  "star-one": {
    en: "product/star-1-teeth-whitening-machine",
    es: "producto/maquina-de-blanqueamiento-dental-estrella-1",
    de: "produkt/stern-1-zahnaufhellungsmaschine",
    ru: "product/аппарат-для-отбеливания-зубов-star-1",
  },
  "comet-2": { en: "product/comet-2", es: "producto/cometa-2", de: "produkt/komet-2", ru: "product/комета-2" },
  galaxy: {
    en: "product/galaxy-laser",
    es: "producto/laser-galactico",
    de: "produkt/galaxie-laser",
    ru: "product/галактический-лазер",
  },
  training: {
    en: "teeth-whitening-training",
    es: "formacion-para-blanqueamiento-dental-2",
    de: "zahnaufhellungstraining",
    ru: "обучение-отбеливанию-зубов",
  },
  about: { en: "about-us", es: "sobre-nosotros", de: "uber-uns", ru: "о-нас" },
  blog: { en: "blog", es: "blog", de: "blog", ru: "blog" },
  providers: { en: "location-finder", es: "buscador-de-ubicacion", de: "standortfinder", ru: "поиск-местоположения" },
  contact: { en: "contact", es: "contacto", de: "kontakt", ru: "контакт" },
  shop: { en: "shop", es: "shop", de: "shop", ru: "shop" },
  account: { en: "my-account", es: "mi-cuenta", de: "mein-konto", ru: "мой-счет" },
  privacy: { en: "privacy", es: "privacidad", de: "datenschutz", ru: "конфиденциальность" },
  terms: {
    en: "terms-and-conditions",
    es: "terminos-y-condiciones",
    de: "geschaftsbedingungen",
    ru: "условия-и-положения",
  },
  warranty: { en: "warranty", es: "garantia", de: "garantie", ru: "гарантия" },
  sitemap: { en: "sitemap", es: "mapa-del-sitio-2", de: "sitemap", ru: "карта-сайта" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof PAGE_SLUGS;

/** Pages rendered by the [[...lang]] catch-all. Add a key here when its page is built. */
export const BUILT_PAGES = [
  "home",
  "about",
  "contact",
  "training",
  "privacy",
  "terms",
  "warranty",
  "star-one",
  "comet-2",
  "galaxy",
] as const satisfies readonly PageKey[];
export type BuiltPage = (typeof BUILT_PAGES)[number];

/** Pages still served by WordPress — linked absolutely so they keep working. */
const WP_ONLY_PAGES: readonly PageKey[] = ["account", "shop"];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Root-relative path for a page in a locale, with a trailing slash (matches `trailingSlash: true`). */
export function localePath(locale: Locale, page: PageKey): string {
  const slug = PAGE_SLUGS[page][locale];
  const parts = [locale === DEFAULT_LOCALE ? "" : locale, slug].filter(Boolean);
  return parts.length ? `/${parts.join("/")}/` : "/";
}

/** Link target for a page: in-app path, or the WordPress URL for pages that stay on WP. */
export function pageHref(locale: Locale, page: PageKey): string {
  const path = localePath(locale, page);
  return WP_ONLY_PAGES.includes(page) ? `${SITE.url}${path}` : path;
}

export function absoluteUrl(locale: Locale, page: PageKey): string {
  return `${SITE.url}${localePath(locale, page)}`;
}

const decodeSegment = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** Resolves catch-all segments (or a pathname split on "/") to a locale + page. */
export function resolveSegments(segments: readonly string[] = []): { locale: Locale; page: PageKey } | null {
  const parts = segments.map(decodeSegment).filter(Boolean);
  // English is unprefixed; "/en/…" would duplicate it, so it is not a valid URL.
  if (parts[0] === DEFAULT_LOCALE) return null;
  const prefixed = isLocale(parts[0]);
  const locale: Locale = prefixed ? (parts[0] as Locale) : DEFAULT_LOCALE;
  const slug = (prefixed ? parts.slice(1) : parts).join("/");
  const page = (Object.keys(PAGE_SLUGS) as PageKey[]).find((key) => PAGE_SLUGS[key][locale] === slug);
  return page ? { locale, page } : null;
}

/** Locale + page for a browser pathname; unknown paths fall back to the locale's home. */
export function resolvePathname(pathname: string): { locale: Locale; page: PageKey } {
  const segments = pathname.split("/");
  const resolved = resolveSegments(segments);
  if (resolved) return resolved;
  const first = decodeSegment(segments.filter(Boolean)[0] ?? "");
  return { locale: isLocale(first) ? first : DEFAULT_LOCALE, page: "home" };
}

/** `generateStaticParams` for the catch-all: every built page in every locale. */
export function catchAllStaticParams(): { lang: string[] }[] {
  return BUILT_PAGES.flatMap((page) =>
    LOCALES.map((locale) => {
      const segments = localePath(locale, page).split("/").filter(Boolean);
      return { lang: segments };
    }),
  );
}

/** hreflang map for `metadata.alternates.languages` (plus x-default → English). */
export function languageAlternates(page: PageKey): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of LOCALES) map[LOCALE_META[locale].htmlLang] = absoluteUrl(locale, page);
  map["x-default"] = absoluteUrl(DEFAULT_LOCALE, page);
  return map;
}
