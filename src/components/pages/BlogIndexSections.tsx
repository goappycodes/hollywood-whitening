import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { getCommonContent } from "@/lib/content";
import { blogIndexPath, blogPostPath } from "@/lib/blog-locale";
import { LOCALE_META, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BlogHero } from "@/components/blog/BlogHero";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal } from "@/components/ui/Reveal";

/** Page numbers to show: first, last, and a window around the current page, with gaps. */
function pageList(page: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...keep].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["gap" as const, n] : [n]));
}

/**
 * The blog listing (`/blog/`, `/blog/page/N/`) in any locale. Posts come from WordPress
 * via lib/blog.ts — 16 a page as on the live site; the newest post is featured on page 1.
 */
export function BlogIndexSections({
  locale,
  posts,
  page,
  totalPages,
}: {
  locale: Locale;
  posts: BlogPost[];
  page: number;
  totalPages: number;
}) {
  const common = getCommonContent(locale);
  const t = common.blog;
  const { htmlLang } = LOCALE_META[locale];
  const [featured, ...rest] = page === 1 ? posts : [];
  const grid = page === 1 ? rest : posts;
  const pageLabel = t.page.replace("{n}", String(page));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t.title,
    description: t.metaDescription,
    url: `${SITE.url}${blogIndexPath(locale, page)}`,
    inLanguage: htmlLang,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}${blogPostPath(p, locale)}`,
      datePublished: p.date,
      ...(p.image && { image: p.image }),
    })),
  };

  const card = (post: BlogPost, i: number) => (
    <Reveal as="li" key={post.id} delay={Math.min(i % 3, 2) * 0.06}>
      <PostCard post={post} locale={locale} categoryFallback={t.category} readArticle={t.readArticle} />
    </Reveal>
  );

  return (
    <div lang={htmlLang}>
      <BlogHero
        locale={locale}
        common={common}
        crumbs={page > 1 ? [{ label: common.nav.blog, href: blogIndexPath(locale) }, { label: pageLabel }] : [{ label: common.nav.blog }]}
        eyebrow={t.eyebrow}
        title={page > 1 ? `${t.title} · ${pageLabel}` : t.title}
      >
        <p className="mt-5 max-w-2xl text-sm leading-relaxed font-light text-white/80 sm:text-lg">{t.intro}</p>
      </BlogHero>

      <section className="bg-pearl py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          {posts.length === 0 ? (
            <p className="rounded-[var(--radius-card)] border border-line bg-white p-10 text-center text-muted">{t.empty}</p>
          ) : (
            <>
              {featured && (
                <Reveal className="mb-6 sm:mb-8">
                  <PostCard
                    post={featured}
                    locale={locale}
                    categoryFallback={t.category}
                    readArticle={t.readArticle}
                    featured
                  />
                </Reveal>
              )}
              <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">{grid.map(card)}</ul>
            </>
          )}

          {totalPages > 1 && (
            <nav aria-label={t.pagination} className="mt-12 flex items-center justify-center gap-1.5 sm:mt-16">
              {page > 1 && (
                <Link
                  href={blogIndexPath(locale, page - 1)}
                  rel="prev"
                  aria-label={t.previous}
                  className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </Link>
              )}
              {pageList(page, totalPages).map((n, i) =>
                n === "gap" ? (
                  <span key={`gap-${i}`} aria-hidden className="px-1 text-muted">
                    …
                  </span>
                ) : (
                  <Link
                    key={n}
                    href={blogIndexPath(locale, n)}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={t.page.replace("{n}", String(n))}
                    className={cn(
                      "grid size-11 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors",
                      n === page ? "bg-brand text-white" : "border border-line bg-white text-ink hover:border-brand hover:text-brand",
                    )}
                  >
                    {n}
                  </Link>
                ),
              )}
              {page < totalPages && (
                <Link
                  href={blogIndexPath(locale, page + 1)}
                  rel="next"
                  aria-label={t.next}
                  className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
