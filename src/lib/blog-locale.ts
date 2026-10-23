/**
 * Blog localisation helpers — client-safe pure functions, as allwhitelaser-next's
 * lib/blog-locale.ts. (allwhitelaser's request-bound `currentBlogLocale()` has no
 * counterpart: here the blog is routed by the [[...lang]] catch-all, which gets the
 * locale from the URL.)
 */
import type { Locale } from "./i18n";

export type BlogLocale = Locale;

/** Base blog path for a locale: `/blog` (en) or `/{locale}/blog`. */
export function blogBase(locale: BlogLocale): string {
  return locale === "en" ? "/blog" : `/${locale}/blog`;
}

/** Listing page path; page 1 is the blog root, as on the live site. */
export function blogIndexPath(locale: BlogLocale, page = 1): string {
  return page > 1 ? `${blogBase(locale)}/page/${page}/` : `${blogBase(locale)}/`;
}

/**
 * The post's slug for a locale — its translated slug where one exists, otherwise
 * the English slug (matching the live site: untranslated slug = English slug).
 */
export function blogPostSlug(post: { slug: string; slugs?: Partial<Record<BlogLocale, string>> }, locale: BlogLocale): string {
  return post.slugs?.[locale] || post.slug;
}

/** Full, trailing-slashed post path for a locale, e.g. `/es/blog/cuanto-tiempo-…/`. */
export function blogPostPath(post: { slug: string; slugs?: Partial<Record<BlogLocale, string>> }, locale: BlogLocale): string {
  return `${blogBase(locale)}/${blogPostSlug(post, locale)}/`;
}
