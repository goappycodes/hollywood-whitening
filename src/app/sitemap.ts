import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blog";
import { blogIndexPath, blogPostPath } from "@/lib/blog-locale";
import { absoluteUrl, BUILT_PAGES, languageAlternates, LOCALE_META, LOCALES, NOINDEX_PAGES, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const hreflang = (pathOf: (locale: Locale) => string) =>
  Object.fromEntries(LOCALES.map((l) => [LOCALE_META[l].htmlLang, `${SITE.url}${pathOf(l)}`]));

// Every built (indexable) page in every locale, each with its full hreflang set, plus the blog
// (listing root and every post) from WordPress. Paginated listing pages are left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = BUILT_PAGES.filter((page) => !NOINDEX_PAGES.includes(page)).flatMap((page) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(locale, page),
      changeFrequency: "weekly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: { languages: languageAlternates(page) },
    })),
  );

  const blog: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE.url}${blogIndexPath(locale)}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
    alternates: { languages: hreflang((l) => blogIndexPath(l)) },
  }));

  // Every post (the API caps per_page at 50), each in every locale via its `slugs`.
  // If WordPress is unreachable the listing is empty and the rest still ships.
  const first = await getAllBlogs(1, 50);
  const rest = await Promise.all(Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) => getAllBlogs(i + 2, 50)));
  for (const post of [first, ...rest].flatMap((l) => l.blogs))
    for (const locale of LOCALES)
      blog.push({
        url: `${SITE.url}${blogPostPath(post, locale)}`,
        lastModified: post.date,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: hreflang((l) => blogPostPath(post, l)) },
      });

  return [...pages, ...blog];
}
