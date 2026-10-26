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

import locatorEn from "@/content/en/pages/locator.json";
import locatorEs from "@/content/es/pages/locator.json";
import locatorDe from "@/content/de/pages/locator.json";
import locatorRu from "@/content/ru/pages/locator.json";

// Machine Authentication + Qualification Check — one shape for both (hand-written; intros from the live pages).
import machineAuthEn from "@/content/en/pages/machine-authentication.json";
import machineAuthEs from "@/content/es/pages/machine-authentication.json";
import machineAuthDe from "@/content/de/pages/machine-authentication.json";
import machineAuthRu from "@/content/ru/pages/machine-authentication.json";
import qualCheckEn from "@/content/en/pages/qualification-check.json";
import qualCheckEs from "@/content/es/pages/qualification-check.json";
import qualCheckDe from "@/content/de/pages/qualification-check.json";
import qualCheckRu from "@/content/ru/pages/qualification-check.json";

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

// Training page (scripts/training-scrape.mjs; Russian translated by hand).
import trainingEn from "@/content/en/pages/training.json";
import trainingEs from "@/content/es/pages/training.json";
import trainingDe from "@/content/de/pages/training.json";
import trainingRu from "@/content/ru/pages/training.json";

// Science + Laser Teeth Whitening pages (scripts/science-scrape.mjs).
import scienceEn from "@/content/en/pages/science.json";
import scienceEs from "@/content/es/pages/science.json";
import scienceDe from "@/content/de/pages/science.json";
import scienceRu from "@/content/ru/pages/science.json";
import laserEn from "@/content/en/pages/laser.json";
import laserEs from "@/content/es/pages/laser.json";
import laserDe from "@/content/de/pages/laser.json";
import laserRu from "@/content/ru/pages/laser.json";

// Product pages (scripts/product-scrape.mjs).
import starOneEn from "@/content/en/products/star-one.json";
import starOneEs from "@/content/es/products/star-one.json";
import starOneDe from "@/content/de/products/star-one.json";
import starOneRu from "@/content/ru/products/star-one.json";
import comet2En from "@/content/en/products/comet-2.json";
import comet2Es from "@/content/es/products/comet-2.json";
import comet2De from "@/content/de/products/comet-2.json";
import comet2Ru from "@/content/ru/products/comet-2.json";
import galaxyEn from "@/content/en/products/galaxy.json";
import galaxyEs from "@/content/es/products/galaxy.json";
import galaxyDe from "@/content/de/products/galaxy.json";
import galaxyRu from "@/content/ru/products/galaxy.json";

import commonEn from "@/content/en/common.json";
import commonEs from "@/content/es/common.json";
import commonDe from "@/content/de/common.json";
import commonRu from "@/content/ru/common.json";

import instagramFeed from "@/content/instagram.json";

export type HomeContent = typeof homeEn;
export type AboutContent = typeof aboutEn;
export type ContactContent = typeof contactEn;
/** Location Finder (/location-finder/) — copy from the live YITH locator page. */
export type LocatorContent = typeof locatorEn;
/** Machine Authentication and Qualification Check — a code lookup with a verdict. */
export type VerifyContent = typeof machineAuthEn;
export type VerifyPage = "machine-auth" | "qualification-check";

/** Scraped editor content — see scripts/lib/wp-html.mjs. */
export type ContentBlock =
  | { type: "h"; text: string }
  | { type: "p"; html: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; rows: string[][] };
export type LegalBlock = ContentBlock;
export type LegalContent = { meta: { title: string; description: string }; title: string; blocks: ContentBlock[] };

/** Live WooCommerce product page, enquiry-led (no price / basket) — scripts/product-scrape.mjs. */
export type ProductContent = {
  meta: { title: string; description: string };
  name: string;
  category: string;
  rating: { value: number; count: number };
  /** Live "Call for Price" label, localised. */
  callForPrice: string;
  videoId: string | null;
  intro: ContentBlock[];
  gallery: { src: string; alt: string }[];
  formTitle: string;
  /** Live product-footer sections; `kind` (from the English heading) picks the layout. */
  sections: { kind: ProductSectionKind; heading: string; blocks: ContentBlock[] }[];
  related: { title: string; items: string[] };
};
/** Teeth Whitening Training page — see scripts/training-scrape.mjs for the shape. */
export type TrainingContent = Omit<typeof trainingEn, "intro" | "safe" | "technique"> & {
  intro: { title: string; blocks: ContentBlock[] };
  safe: { title: string; blocks: ContentBlock[]; cta: { href: string; label: string } | null };
  technique: { title: string; blocks: ContentBlock[] };
};

type ParagraphBlock = Extract<ContentBlock, { type: "p" }>;

/** "The Science & Technology behind Modern Laser Teeth Whitening" — scripts/science-scrape.mjs. */
export type ScienceContent = Omit<typeof scienceEn, "body" | "laser" | "srd"> & {
  body: ParagraphBlock[];
  laser: { title: string; blocks: ParagraphBlock[] };
  srd: { title: string; blocks: ParagraphBlock[] };
};

/** "Laser Teeth Whitening" treatment guide — scripts/science-scrape.mjs. */
export type LaserContent = Omit<typeof laserEn, "info"> & {
  info: { title: string; tabs: { label: string; blocks: ContentBlock[] }[] };
};

export type ProductSectionKind = "description" | "package" | "training" | "about" | "faq" | "delivery" | "other";
/** Products with a built page. Add a key (and its four JSON imports) as each is built. */
export type ProductKey = "star-one" | "comet-2" | "galaxy";
export type LegalPage = "privacy" | "terms" | "warranty";
export type CommonContent = typeof commonEn;
export type EnquiryFormContent = CommonContent["enquiryForm"];

const HOME: Record<Locale, HomeContent> = { en: homeEn, es: homeEs, de: homeDe, ru: homeRu };
const ABOUT: Record<Locale, AboutContent> = { en: aboutEn, es: aboutEs, de: aboutDe, ru: aboutRu };
const CONTACT: Record<Locale, ContactContent> = { en: contactEn, es: contactEs, de: contactDe, ru: contactRu };
const LOCATOR: Record<Locale, LocatorContent> = { en: locatorEn, es: locatorEs, de: locatorDe, ru: locatorRu };
const LEGAL = {
  privacy: { en: privacyEn, es: privacyEs, de: privacyDe, ru: privacyRu },
  terms: { en: termsEn, es: termsEs, de: termsDe, ru: termsRu },
  warranty: { en: warrantyEn, es: warrantyEs, de: warrantyDe, ru: warrantyRu },
} as Record<LegalPage, Record<Locale, LegalContent>>;
const PRODUCTS = {
  "star-one": { en: starOneEn, es: starOneEs, de: starOneDe, ru: starOneRu },
  "comet-2": { en: comet2En, es: comet2Es, de: comet2De, ru: comet2Ru },
  galaxy: { en: galaxyEn, es: galaxyEs, de: galaxyDe, ru: galaxyRu },
} as Record<ProductKey, Record<Locale, ProductContent>>;
const TRAINING = { en: trainingEn, es: trainingEs, de: trainingDe, ru: trainingRu } as Record<Locale, TrainingContent>;
const SCIENCE = { en: scienceEn, es: scienceEs, de: scienceDe, ru: scienceRu } as Record<Locale, ScienceContent>;
const LASER = { en: laserEn, es: laserEs, de: laserDe, ru: laserRu } as Record<Locale, LaserContent>;
const VERIFY: Record<VerifyPage, Record<Locale, VerifyContent>> = {
  "machine-auth": { en: machineAuthEn, es: machineAuthEs, de: machineAuthDe, ru: machineAuthRu },
  "qualification-check": { en: qualCheckEn, es: qualCheckEs, de: qualCheckDe, ru: qualCheckRu },
};
const COMMON: Record<Locale, CommonContent> = { en: commonEn, es: commonEs, de: commonDe, ru: commonRu };

export const getHomeContent = (locale: Locale): HomeContent => HOME[locale];
export const getAboutContent = (locale: Locale): AboutContent => ABOUT[locale];
export const getContactContent = (locale: Locale): ContactContent => CONTACT[locale];
export const getLocatorContent = (locale: Locale): LocatorContent => LOCATOR[locale];
export const getLegalContent = (page: LegalPage, locale: Locale): LegalContent => LEGAL[page][locale];
export const getProductContent = (key: ProductKey, locale: Locale): ProductContent => PRODUCTS[key][locale];
export const getTrainingContent = (locale: Locale): TrainingContent => TRAINING[locale];
export const getScienceContent = (locale: Locale): ScienceContent => SCIENCE[locale];
export const getLaserContent = (locale: Locale): LaserContent => LASER[locale];
export const getVerifyContent = (page: VerifyPage, locale: Locale): VerifyContent => VERIFY[page][locale];
export const getCommonContent = (locale: Locale): CommonContent => COMMON[locale];

/** Instagram snapshot (scripts/instagram-snapshot.mjs) — same posts in every locale. */
export type InstagramFeed = typeof instagramFeed;
export const getInstagramFeed = (): InstagramFeed => instagramFeed;

/** Fills `{key}` placeholders, e.g. fill("{n} ratings", { n: 9 }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
