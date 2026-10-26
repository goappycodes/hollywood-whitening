import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BLOG_PER_PAGE, getAllBlogs, getPostBySlug, getRelatedPosts, primaryCategory } from "@/lib/blog";
import { blogIndexPath, blogPostPath, blogPostSlug } from "@/lib/blog-locale";
import {
  getAboutContent,
  getContactContent,
  getHomeContent,
  getLegalContent,
  getLaserContent,
  getLocatorContent,
  getProductContent,
  getScienceContent,
  getTrainingContent,
  getVerifyContent,
} from "@/lib/content";
import {
  absoluteUrl,
  BUILT_PAGES,
  catchAllStaticParams,
  languageAlternates,
  LOCALE_META,
  LOCALES,
  NOINDEX_PAGES,
  resolveBlogSegments,
  resolveSegments,
  type BlogRoute,
  type BuiltPage,
  type Locale,
} from "@/lib/i18n";
import { HomeSections } from "@/components/pages/HomeSections";
import { AboutSections } from "@/components/pages/AboutSections";
import { ContactSections } from "@/components/pages/ContactSections";
import { LegalSections } from "@/components/pages/LegalSections";
import { ProductSections } from "@/components/pages/ProductSections";
import { TrainingSections } from "@/components/pages/TrainingSections";
import { ScienceSections } from "@/components/pages/ScienceSections";
import { LaserSections } from "@/components/pages/LaserSections";
import { LocatorSections } from "@/components/pages/LocatorSections";
import { SitemapSections } from "@/components/pages/SitemapSections";
import { VerifySections } from "@/components/pages/VerifySections";
import { BlogIndexSections } from "@/components/pages/BlogIndexSections";
import { BlogPostSections } from "@/components/pages/BlogPostSections";
import { getCommonContent } from "@/lib/content";
import { SITE } from "@/lib/site";

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

/**
 * Built pages only. Blog URLs (/blog/…, /es/blog/…) are deliberately NOT listed:
 * like allwhitelaser-next's force-dynamic blog routes, they are rendered on request
 * (first visit, then cached for 10 minutes via lib/blog.ts), so a build never
 * depends on WordPress for posts.
 */
export function generateStaticParams() {
  return catchAllStaticParams();
}

type Resolved = { kind: "page"; locale: Locale; page: BuiltPage } | ({ kind: "blog" } & { route: BlogRoute });

async function resolve(params: PageProps<"/[[...lang]]">["params"]): Promise<Resolved> {
  const { lang } = await params;
  const blog = resolveBlogSegments(lang);
  if (blog) return { kind: "blog", route: blog };
  const resolved = resolveSegments(lang);
  if (!resolved || !(BUILT_PAGES as readonly string[]).includes(resolved.page)) notFound();
  return { kind: "page", ...(resolved as { locale: Locale; page: BuiltPage }) };
}

/** hreflang map from each locale's path (plus x-default → English); unknown paths are skipped. */
function alternatesFor(pathOf: (locale: Locale) => string | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of LOCALES) {
    const path = pathOf(l);
    if (path) map[LOCALE_META[l].htmlLang] = `${SITE.url}${path}`;
  }
  if (map[LOCALE_META.en.htmlLang]) map["x-default"] = map[LOCALE_META.en.htmlLang];
  return map;
}

async function blogMetadata(route: BlogRoute): Promise<Metadata> {
  const { locale } = route;
  const og = { locale: LOCALE_META[locale].ogLocale, alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].ogLocale) };
  if (route.kind === "index") {
    const t = getCommonContent(locale).blog;
    const title = route.page > 1 ? `${t.metaTitle} – ${t.page.replace("{n}", String(route.page))}` : t.metaTitle;
    const url = `${SITE.url}${blogIndexPath(locale, route.page)}`;
    return {
      title: { absolute: title },
      description: t.metaDescription,
      alternates: { canonical: url, languages: alternatesFor((l) => blogIndexPath(l, route.page)) },
      openGraph: { title, description: t.metaDescription, url, ...og },
    };
  }
  const post = await getPostBySlug(route.slug, locale);
  if (!post) return {};
  const url = `${SITE.url}${blogPostPath(post, locale)}`;
  // Yoast's title / description when WordPress has them (already the full <title>,
  // site name included, so it bypasses the layout's "%s | …" template); else the
  // post title and excerpt.
  const title = post.seo.title ? { absolute: post.seo.title } : post.title;
  const description = post.seo.description ?? post.excerpt.slice(0, 160);
  return {
    title,
    description,
    // hreflang to each locale's translated URL (+ x-default → English), from the API's `slugs`.
    alternates: { canonical: url, languages: alternatesFor((l) => blogPostPath(post, l)) },
    openGraph: {
      type: "article",
      title: post.seo.title ?? post.title,
      description,
      url,
      publishedTime: post.date,
      modifiedTime: post.modified,
      section: primaryCategory(post, locale)?.name,
      ...(post.image && { images: [{ url: post.image, alt: post.title }] }),
      ...og,
    },
  };
}

async function BlogPage({ route }: { route: BlogRoute }) {
  const { locale } = route;
  if (route.kind === "index") {
    // Page 1 lives at the blog root, as on the live site.
    if (route.page === 1 && route.paged) permanentRedirect(blogIndexPath(locale));
    const { blogs, totalPages } = await getAllBlogs(route.page, BLOG_PER_PAGE, locale);
    if (route.page > 1 && blogs.length === 0) notFound(); // out-of-range page
    return <BlogIndexSections locale={locale} posts={blogs} page={route.page} totalPages={totalPages} />;
  }
  // The API accepts the English slug or this locale's translated one.
  const post = await getPostBySlug(route.slug, locale);
  if (!post) notFound();
  // e.g. /es/blog/<english-slug>/ → the Spanish URL, as the live site redirects.
  if (blogPostSlug(post, locale) !== route.slug) permanentRedirect(blogPostPath(post, locale));
  // Fetched after the notFound() check so a 404 costs no extra requests.
  const related = await getRelatedPosts(post, locale);
  return <BlogPostSections locale={locale} post={post} related={related} />;
}

const PAGE_META: Record<BuiltPage, (locale: Locale) => { title: string; description: string }> = {
  home: (locale) => getHomeContent(locale).meta,
  about: (locale) => getAboutContent(locale).meta,
  contact: (locale) => getContactContent(locale).meta,
  providers: (locale) => getLocatorContent(locale).meta,
  training: (locale) => getTrainingContent(locale).meta,
  science: (locale) => getScienceContent(locale).meta,
  laser: (locale) => getLaserContent(locale).meta,
  privacy: (locale) => getLegalContent("privacy", locale).meta,
  terms: (locale) => getLegalContent("terms", locale).meta,
  warranty: (locale) => getLegalContent("warranty", locale).meta,
  "star-one": (locale) => getProductContent("star-one", locale).meta,
  "comet-2": (locale) => getProductContent("comet-2", locale).meta,
  galaxy: (locale) => getProductContent("galaxy", locale).meta,
  sitemap: (locale) => {
    const { metaTitle: title, metaDescription: description } = getCommonContent(locale).sitemap;
    return { title, description };
  },
  "machine-auth": (locale) => getVerifyContent("machine-auth", locale).meta,
  "qualification-check": (locale) => getVerifyContent("qualification-check", locale).meta,
};

export async function generateMetadata({ params }: PageProps<"/[[...lang]]">): Promise<Metadata> {
  const resolved = await resolve(params);
  if (resolved.kind === "blog") return blogMetadata(resolved.route);
  const { locale, page } = resolved;
  const meta = PAGE_META[page](locale);
  const url = absoluteUrl(locale, page);
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: url, languages: languageAlternates(page) },
    ...(NOINDEX_PAGES.includes(page) && { robots: { index: false, follow: true } }),
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
  const resolved = await resolve(params);
  if (resolved.kind === "blog") return <BlogPage route={resolved.route} />;
  const { locale, page } = resolved;
  if (page === "about") return <AboutSections locale={locale} />;
  if (page === "contact") return <ContactSections locale={locale} />;
  if (page === "providers") return <LocatorSections locale={locale} />;
  if (page === "training") return <TrainingSections locale={locale} />;
  if (page === "science") return <ScienceSections locale={locale} />;
  if (page === "laser") return <LaserSections locale={locale} />;
  if (page === "sitemap") return <SitemapSections locale={locale} />;
  if (page === "machine-auth" || page === "qualification-check") return <VerifySections page={page} locale={locale} />;
  if (page === "privacy" || page === "terms" || page === "warranty") return <LegalSections page={page} locale={locale} />;
  if (page === "star-one" || page === "comet-2" || page === "galaxy")
    return <ProductSections product={page} locale={locale} />;
  return <HomeSections locale={locale} />;
}
