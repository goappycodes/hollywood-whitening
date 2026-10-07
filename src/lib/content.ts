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

import commonEn from "@/content/en/common.json";
import commonEs from "@/content/es/common.json";
import commonDe from "@/content/de/common.json";
import commonRu from "@/content/ru/common.json";

import instagramFeed from "@/content/instagram.json";

export type HomeContent = typeof homeEn;
export type CommonContent = typeof commonEn;

const HOME: Record<Locale, HomeContent> = { en: homeEn, es: homeEs, de: homeDe, ru: homeRu };
const COMMON: Record<Locale, CommonContent> = { en: commonEn, es: commonEs, de: commonDe, ru: commonRu };

export const getHomeContent = (locale: Locale): HomeContent => HOME[locale];
export const getCommonContent = (locale: Locale): CommonContent => COMMON[locale];

/** Instagram snapshot (scripts/instagram-snapshot.mjs) — same posts in every locale. */
export type InstagramFeed = typeof instagramFeed;
export const getInstagramFeed = (): InstagramFeed => instagramFeed;

/** Fills `{key}` placeholders, e.g. fill("{n} ratings", { n: 9 }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
