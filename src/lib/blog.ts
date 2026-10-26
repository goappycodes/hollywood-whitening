/**
 * Blog client — reads the WordPress custom blog API (namespace aw3/v1) and
 * normalises it for the frontend. Ported from allwhitelaser-next's lib/blog.ts;
 * the API is the same file, hollywood-wp's theme-customisations-master/custom/
 * blog-api.php (ported from allwhitelaser-wp).
 *
 *   getAllBlogs(page)          → GET /aw3/v1/blogs                (the /blog listing)
 *   getPostBySlug(slug)        → GET /aw3/v1/post/{slug}          (the article page)
 *   getCategoryArchive(slug)   → GET /aw3/v1/category/{slug}      (related posts)
 *   getBlogCategories()        → GET /aw3/v1/blogs-by-category
 *
 * Every call takes the locale; non-English adds `?lang=`, and the API translates
 * through TranslatePress and returns each post's per-locale `slugs`.
 *
 * Caching — the one deliberate difference from allwhitelaser. Hollywood runs Cache
 * Components, so instead of `fetch(..., { next: { revalidate: 600 } })` each request
 * is a `"use cache"` scope with the same 10-minute refresh. A failed request is
 * cached for only a minute, and the exported functions return null / empty, exactly
 * like allwhitelaser's — so a WordPress outage or 403 never fails a build.
 *
 * Server-only: a staging WP behind nginx basic auth needs credentials (wp-headers.ts).
 */
import { cacheLife } from "next/cache";
import { processBlogContent, readingMinutes, type TocEntry } from "./blog-content";
import { getCommonContent, getHomeContent } from "./content";
import type { Locale } from "./i18n";
import { blogPostPath } from "./blog-locale";
import { POST_IMAGES } from "./site";
import { wpServerHeaders } from "./wp-headers";

/** Posts per listing page — 16, as on the live /blog/. */
export const BLOG_PER_PAGE = 16;

/**
 * The WordPress install serving the blog API. WP_API_URL (server-only) — e.g.
 * https://shop.hollywoodwhitening.com, where hollywood-wp's blog-api.php is deployed —
 * else NEXT_PUBLIC_WP_URL, else www (src/proxy.ts's default).
 */
function wpBase(): string {
  return (process.env.WP_API_URL || process.env.NEXT_PUBLIC_WP_URL || "https://www.hollywoodwhitening.com").replace(/\/+$/, "");
}

/**
 * `aw3/v1/blogs?page=2` → `<base>/?rest_route=/aw3/v1/blogs&page=2`. On shop,
 * `/wp-json/<route>` answers a Cloudflare 502, so — like /api/providers and the
 * Gravity Forms calls — routes go through `?rest_route=`, which every WordPress accepts.
 */
function restUrl(route: string): string {
  const q = route.indexOf("?");
  const path = q === -1 ? route : route.slice(0, q);
  const query = q === -1 ? "" : route.slice(q + 1);
  return `${wpBase()}/?rest_route=/${path}${query ? `&${query}` : ""}`;
}

/**
 * GET a WordPress REST route, cached. Never throws: an error thrown inside a
 * `"use cache"` scope fails the prerender even when the caller catches it (a 403
 * from WordPress broke a Vercel build). A good response is kept for 10 minutes; a
 * failure only briefly (5 min is the shortest expiry that stays part of a static
 * page), so the next request after a minute retries.
 */
async function wpJsonCached<T>(route: string): Promise<{ ok: true; data: T } | { ok: false }> {
  "use cache";
  try {
    const res = await fetch(restUrl(route), {
      headers: wpServerHeaders(),
      signal: AbortSignal.timeout(30_000),
    });
    if (res.ok) {
      const data = (await res.json()) as T;
      cacheLife({ stale: 300, revalidate: 600, expire: 86400 }); // refresh WP content every 10 min
      return { ok: true, data };
    }
    console.error(`[blog] WordPress ${res.status} for ${route}`);
  } catch (err) {
    console.error(`[blog] WordPress request failed for ${route}:`, err);
  }
  cacheLife({ stale: 60, revalidate: 60, expire: 300 }); // retry soon
  return { ok: false };
}

/** GET any WordPress REST route (aw3/v1 or core wp/v2); null on any failure. */
async function wpJson<T>(route: string): Promise<T | null> {
  const result = await wpJsonCached<T>(route);
  return result.ok ? result.data : null;
}

/**
 * A slug as a route segment. The route travels inside the `rest_route` query value,
 * which PHP decodes once before routing, and the aw3/v1 slug patterns only accept
 * [A-Za-z0-9-_%] — so a Cyrillic slug must arrive still percent-encoded: encode twice.
 * (blog-api.php urldecode()s the slug itself.)
 */
const routeSegment = (slug: string) => encodeURIComponent(encodeURIComponent(slug));

async function aw3<T>(path: string): Promise<T | null> {
  return wpJson<T>(`aw3/v1/${path}`);
}

/* ── types (camelCase for the frontend; the API returns snake_case) ──────── */

/** Per-locale slug map (translated slugs), mirroring the live localised URLs. */
export type BlogSlugs = Record<Locale, string>;

export type BlogPost = {
  id: number;
  slug: string;
  /** The post's slug in each locale (TranslatePress). Callers fall back to `slug`. */
  slugs?: BlogSlugs;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readTime: string;
  /** Featured image (WordPress `large` size), or null — cards then show a placeholder. */
  image: string | null;
  author: string;
  categories: { id: number; name: string; slug: string }[];
};

export type CategoryArchive = {
  category: { id: number; name: string; slug: string; description: string; count: number };
  posts: BlogPost[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type BlogListing = {
  blogs: BlogPost[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
  posts: BlogPost[];
};

/* ── raw API shapes (snake_case) ─────────────────────────────────────────── */

type RawPost = {
  id: number;
  slug: string;
  slugs?: BlogSlugs;
  title: string;
  excerpt: string;
  date: string;
  date_label: string;
  read_time: string;
  image: string | null;
  author: string;
  categories: { id: number; name: string; slug: string }[];
};

/** Strip WordPress's auto-excerpt "read more" marker: a trailing [...] / […]. */
function cleanExcerpt(s: string): string {
  return s.replace(/\s*\[(?:…|\.\.\.|&hellip;)\]\s*$/i, "").trim();
}

function normalisePost(p: RawPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    slugs: p.slugs,
    title: p.title,
    excerpt: cleanExcerpt(p.excerpt),
    date: p.date,
    dateLabel: p.date_label,
    readTime: p.read_time,
    image: p.image || null,
    author: p.author,
    categories: p.categories ?? [],
  };
}

/* ── the calls ─────────────────────────────────────────────────────────── */

/** Append the language query for a non-default locale (English is the default). */
function langParam(lang?: string): string {
  return lang && lang !== "en" ? `&lang=${encodeURIComponent(lang)}` : "";
}

/** Categories, each with a few recent posts. [] if the API isn't reachable. */
export async function getBlogCategories(opts: { perCategory?: number; maxCategories?: number; lang?: Locale } = {}): Promise<BlogCategory[]> {
  const { perCategory = 4, maxCategories = 8, lang } = opts;
  const data = await aw3<Array<Omit<BlogCategory, "posts"> & { posts: RawPost[] }>>(
    `blogs-by-category?per_category=${perCategory}&max_categories=${maxCategories}${langParam(lang)}`,
  );
  if (!data) return [];
  return data.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count, posts: (c.posts ?? []).map(normalisePost) }));
}

/** One category + its posts (paginated). null if unknown. The endpoint caps per_page at 50. */
export async function getCategoryArchive(slug: string, page = 1, lang?: Locale, perPage?: number): Promise<CategoryArchive | null> {
  const data = await aw3<{
    category: CategoryArchive["category"];
    posts: RawPost[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }>(`category/${routeSegment(slug)}?page=${page}` + (perPage ? `&per_page=${perPage}` : "") + langParam(lang));
  if (!data || !data.category) return null;
  return {
    category: data.category,
    posts: (data.posts ?? []).map(normalisePost),
    page: data.page,
    perPage: data.per_page,
    total: data.total,
    totalPages: data.total_pages,
  };
}

/** All blogs (paginated), newest first — the /blog listing. Empty listing if unreachable. */
export async function getAllBlogs(page = 1, perPage = BLOG_PER_PAGE, lang?: Locale): Promise<BlogListing> {
  const data = await aw3<{ blogs: RawPost[]; page: number; per_page: number; total: number; total_pages: number }>(
    `blogs?page=${page}&per_page=${perPage}${langParam(lang)}`,
  );
  if (!data) return { blogs: [], page, perPage, total: 0, totalPages: 0 };
  return {
    blogs: (data.blogs ?? []).map(normalisePost),
    page: data.page,
    perPage: data.per_page,
    total: data.total,
    totalPages: data.total_pages,
  };
}

/** A single post plus its full HTML body (for the article page). */
export type BlogPostFull = BlogPost & {
  /** Processed body (lib/blog-content.ts) and its contents list. */
  content: string;
  toc: TocEntry[];
  readMinutes: number;
  /** When the post was last edited in WordPress (ISO 8601); equals `date` if nothing newer. */
  modified: string;
  /**
   * Yoast's <title> and meta description, localised (blog-api.php `seo`), or null
   * each when Yoast has none or the deployed API predates the field.
   */
  seo: { title: string | null; description: string | null };
};

/**
 * Last-modified date from core WordPress REST (`wp/v2`) — the aw3/v1 endpoint
 * doesn't expose it. null if the route is unreachable (dateModified then falls
 * back to the publish date).
 */
async function getPostModified(id: number): Promise<string | null> {
  const post = await wpJson<{ modified_gmt?: string }>(`wp/v2/posts/${id}?_fields=modified_gmt`);
  // WP's *_gmt fields are UTC without a zone designator — make that explicit.
  return post?.modified_gmt ? `${post.modified_gmt.replace(/Z?$/, "")}Z` : null;
}

/** The later of two ISO timestamps (a modified date never precedes publishing). */
function laterIso(a: string, b: string | null | undefined): string {
  if (!b) return a;
  const ta = Date.parse(a);
  const tb = Date.parse(b);
  if (Number.isNaN(tb)) return a;
  if (Number.isNaN(ta)) return b;
  return tb > ta ? b : a;
}

/**
 * One post by slug — English or this locale's translated slug, which the API
 * resolves — with its full content. null if it isn't a published post (or the
 * API is unreachable).
 */
export async function getPostBySlug(slug: string, lang?: Locale): Promise<BlogPostFull | null> {
  const q = lang && lang !== "en" ? `?lang=${encodeURIComponent(lang)}` : "";
  const data = await aw3<RawPost & { content?: string; seo?: { title?: string; description?: string } }>(
    `post/${routeSegment(slug)}${q}`,
  );
  if (!data || !data.slug) return null;
  const modified = await getPostModified(data.id);
  // Process the body: same-site links, Flatsome banners, scrollable tables, contents.
  const { html, toc } = processBlogContent(data.content ?? "");
  return {
    ...normalisePost(data),
    content: html,
    toc,
    readMinutes: readingMinutes(html),
    modified: laterIso(data.date, modified),
    seo: { title: data.seo?.title?.trim() || null, description: data.seo?.description?.trim() || null },
  };
}

/**
 * Posts related to `post`, for the "You may also like" band — derived from the
 * post's own categories (no `related` endpoint), as allwhitelaser does. The post
 * itself is excluded, duplicates dropped; unreachable API → [].
 */
export async function getRelatedPosts(post: Pick<BlogPost, "slug" | "categories">, lang?: Locale, limit = 3): Promise<BlogPost[]> {
  const out: BlogPost[] = [];
  const seen = new Set([post.slug]);
  for (const cat of post.categories) {
    if (out.length >= limit) break;
    // One more than needed, so the post itself being in the results doesn't leave a gap.
    const archive = await getCategoryArchive(cat.slug, 1, lang, limit + 1);
    for (const p of archive?.posts ?? []) {
      if (out.length >= limit) break;
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push(p);
    }
  }
  // Too few in its categories (most posts are "Uncategorized"): top up with the newest.
  if (out.length < limit) {
    for (const p of (await getAllBlogs(1, limit + 1, lang)).blogs) {
      if (out.length >= limit) break;
      if (!seen.has(p.slug)) out.push(p);
    }
  }
  return out;
}

/* ── Hollywood presentation helpers ─────────────────────────────────────── */

/**
 * The category shown on a card / article: the first real WordPress category
 * ("Uncategorized" is skipped), with its name from common.json → blog.categories
 * when TranslatePress has no translation for it. null → the UI's default label.
 */
export function primaryCategory(post: Pick<BlogPost, "categories">, locale: Locale): { name: string; slug: string } | null {
  const cat = post.categories.find((c) => !c.slug.startsWith("uncategorized"));
  if (!cat) return null;
  const names: Record<string, string> = getCommonContent(locale).blog.categories;
  return { slug: cat.slug, name: locale !== "en" && names[cat.slug] ? names[cat.slug] : cat.name };
}

export type PostTeaser = { title: string; href: string; image: string | null; category: string };

/**
 * The newest posts as teasers for the homepage "News & Tips" and About "News & Trends"
 * strips. Falls back to the static list in home.json → blogFaq.posts (with the bundled
 * images) when WordPress is unreachable, so those pages never fail on the blog API.
 */
export async function getPostTeasers(locale: Locale, limit = 5): Promise<PostTeaser[]> {
  const copy = getHomeContent(locale).blogFaq;
  const { blogs } = await getAllBlogs(1, limit, locale);
  if (blogs.length)
    return blogs.map((p) => ({
      title: p.title,
      href: blogPostPath(p, locale),
      image: p.image,
      category: primaryCategory(p, locale)?.name ?? copy.category,
    }));
  return copy.posts.slice(0, limit).map((p, i) => ({ ...p, image: POST_IMAGES[i] ?? null, category: copy.category }));
}
