/**
 * Typed access to per-locale copy in src/content/<locale>/.
 *
 * pages/home.json is generated from the live site by scripts/localize-scrape.mjs;
 * common.json (header/footer/UI strings) is maintained by hand.
 * The English files define the shape — every locale must match it.
 */
import type { Locale } from "./i18n";

import homeEn from "@/content/en/pages/home.json";
import homeEs from "@/content/es/pages/home.json";
import homeDe from "@/content/de/pages/home.json";
import homeRu from "@/content/ru/pages/home.json";

import aboutEn from "@/content/en/pages/about.json";
import aboutEs from "@/content/es/pages/about.json";
import aboutDe from "@/content/de/pages/about.json";
import aboutRu from "@/content/ru/pages/about.json";

import contactEn from "@/content/en/pages/contact.json";
import contactEs from "@/content/es/pages/contact.json";
import contactDe from "@/content/de/pages/contact.json";
import contactRu from "@/content/ru/pages/contact.json";

// Legal pages (scripts/legal-scrape.mjs) — one shape for all three.
import privacyEn from "@/content/en/pages/privacy.json";
import privacyEs from "@/content/es/pages/privacy.json";
import privacyDe from "@/content/de/pages/privacy.json";
import privacyRu from "@/content/ru/pages/privacy.json";
import termsEn from "@/content/en/pages/terms.json";
import termsEs from "@/content/es/pages/terms.json";
import termsDe from "@/content/de/pages/terms.json";
import termsRu from "@/content/ru/pages/terms.json";
import warrantyEn from "@/content/en/pages/warranty.json";
import warrantyEs from "@/content/es/pages/warranty.json";
import warrantyDe from "@/content/de/pages/warranty.json";
import warrantyRu from "@/content/ru/pages/warranty.json";

import commonEn from "@/content/en/common.json";
import commonEs from "@/content/es/common.json";
import commonDe from "@/content/de/common.json";
import commonRu from "@/content/ru/common.json";

import instagramFeed from "@/content/instagram.json";

export type HomeContent = typeof homeEn;
export type AboutContent = typeof aboutEn;
export type ContactContent = typeof contactEn;

export type LegalBlock =
  | { type: "h"; text: string }
  | { type: "p"; html: string }
  | { type: "ul" | "ol"; items: string[] };
export type LegalContent = { meta: { title: string; description: string }; title: string; blocks: LegalBlock[] };
export type LegalPage = "privacy" | "terms" | "warranty";
export type CommonContent = typeof commonEn;
export type EnquiryFormContent = CommonContent["enquiryForm"];

const HOME: Record<Locale, HomeContent> = { en: homeEn, es: homeEs, de: homeDe, ru: homeRu };
const ABOUT: Record<Locale, AboutContent> = { en: aboutEn, es: aboutEs, de: aboutDe, ru: aboutRu };
const CONTACT: Record<Locale, ContactContent> = { en: contactEn, es: contactEs, de: contactDe, ru: contactRu };
const LEGAL = {
  privacy: { en: privacyEn, es: privacyEs, de: privacyDe, ru: privacyRu },
  terms: { en: termsEn, es: termsEs, de: termsDe, ru: termsRu },
  warranty: { en: warrantyEn, es: warrantyEs, de: warrantyDe, ru: warrantyRu },
} as Record<LegalPage, Record<Locale, LegalContent>>;
const COMMON: Record<Locale, CommonContent> = { en: commonEn, es: commonEs, de: commonDe, ru: commonRu };

export const getHomeContent = (locale: Locale): HomeContent => HOME[locale];
export const getAboutContent = (locale: Locale): AboutContent => ABOUT[locale];
export const getContactContent = (locale: Locale): ContactContent => CONTACT[locale];
export const getLegalContent = (page: LegalPage, locale: Locale): LegalContent => LEGAL[page][locale];
export const getCommonContent = (locale: Locale): CommonContent => COMMON[locale];

/** Instagram snapshot (scripts/instagram-snapshot.mjs) — same posts in every locale. */
export type InstagramFeed = typeof instagramFeed;
export const getInstagramFeed = (): InstagramFeed => instagramFeed;

/** Fills `{key}` placeholders, e.g. fill("{n} ratings", { n: 9 }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
