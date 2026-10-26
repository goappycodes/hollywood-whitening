import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown, Clock, Mail } from "lucide-react";
import { primaryCategory, type BlogPost, type BlogPostFull } from "@/lib/blog";
import { blogIndexPath, blogPostPath } from "@/lib/blog-locale";
import { getCommonContent } from "@/lib/content";
import { localePath, LOCALE_META, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { BlogHero } from "@/components/blog/BlogHero";
import { formatPostDate, PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/Button";
import { FacebookIcon, LinkedinIcon, WhatsappIcon, XIcon } from "@/components/ui/Social";
import { Reveal } from "@/components/ui/Reveal";

/**
 * A blog article in any locale. The body is the post's WordPress HTML, cleaned up in
 * lib/blog-content.ts (Flatsome banners → `.blog-cta`, inline styles dropped, same-site
 * links made relative) and styled by `.blog-prose` in globals.css. Mirrors the live
 * post's content and share buttons; adds contents and related posts (as allwhitelaser's
 * article does — the aw3/v1 API has no previous/next lookup).
 */
export function BlogPostSections({
  locale,
  post,
  related,
}: {
  locale: Locale;
  post: BlogPostFull;
  related: BlogPost[];
}) {
  const common = getCommonContent(locale);
  const t = common.blog;
  const { htmlLang } = LOCALE_META[locale];
  const url = `${SITE.url}${blogPostPath(post, locale)}`;
  const category = primaryCategory(post, locale)?.name ?? t.category;
  const updated = post.modified.slice(0, 10) !== post.date.slice(0, 10);

  const enc = encodeURIComponent;
  const share = [
    { label: "Facebook", Icon: FacebookIcon, href: `https://www.facebook.com/sharer.php?u=${enc(url)}` },
    { label: "X", Icon: XIcon, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(post.title)}` },
    { label: "LinkedIn", Icon: LinkedinIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "WhatsApp", Icon: WhatsappIcon, href: `https://wa.me/?text=${enc(`${post.title} ${url}`)}` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url,
      mainEntityOfPage: url,
      inLanguage: htmlLang,
      datePublished: post.date,
      dateModified: post.modified,
      ...(post.image && { image: post.image }),
      articleSection: category,
      author: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
      publisher: { "@type": "Organization", name: SITE.legalName, logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: common.nav.home, item: `${SITE.url}${localePath(locale, "home")}` },
        { "@type": "ListItem", position: 2, name: common.nav.blog, item: `${SITE.url}${blogIndexPath(locale)}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  const tocList = (
    <ol className="space-y-0.5 text-sm">
      {post.toc.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className="flex gap-3 rounded-lg px-3 py-2 text-muted transition-colors hover:bg-brand-sky/60 hover:text-brand-deep"
          >
            <span className="w-5 shrink-0 text-right text-xs font-semibold text-brand/70 tabular-nums">{i + 1}</span>
            <span className="min-w-0">{h.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  const hasToc = post.toc.length > 2;

  return (
    <div lang={htmlLang}>
      <BlogHero
        locale={locale}
        common={common}
        crumbs={[{ label: common.nav.blog, href: blogIndexPath(locale) }, { label: post.title }]}
        eyebrow={category}
        title={post.title}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-cyan" aria-hidden />
            <time dateTime={post.date}>{formatPostDate(post.date, htmlLang)}</time>
          </span>
          {updated && (
            <span className="inline-flex items-center gap-2">
              {t.updated} <time dateTime={post.modified}>{formatPostDate(post.modified, htmlLang)}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-cyan" aria-hidden />
            {t.minRead.replace("{n}", String(post.readMinutes))}
          </span>
        </div>
      </BlogHero>

      <section className="bg-white pb-16 sm:pb-20 lg:pb-24">
        <div className="container-x">
          {/* featured image — left out entirely for the (older) posts that have none in WordPress */}
          {post.image && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-pearl shadow-soft sm:mt-12 lg:mx-auto lg:max-w-5xl">
              <Image src={post.image} alt={post.title} fill priority referrerPolicy="no-referrer" sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
            </div>
          )}

          <div className={hasToc ? "mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 xl:gap-20" : "mt-10 sm:mt-14"}>
            {hasToc && (
              <>
                <details className="group rounded-2xl border border-line bg-pearl lg:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {t.inThisArticle}
                    <ChevronDown className="size-4 text-brand transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <div className="max-h-80 overflow-y-auto px-2 pb-3">{tocList}</div>
                </details>
                <aside className="hidden lg:block">
                  <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2 pb-4">
                    <p className="px-3 text-xs font-semibold tracking-[0.16em] text-ink uppercase">{t.inThisArticle}</p>
                    <div className="mt-3">{tocList}</div>
                  </div>
                </aside>
              </>
            )}

            <div className={hasToc ? "min-w-0" : "mx-auto min-w-0 max-w-3xl"}>
              {/* WordPress body — processed server-side in lib/blog-content.ts. */}
              <article className="blog-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* share */}
              <div className="mt-12 flex max-w-3xl flex-wrap items-center gap-3 border-t border-line pt-6">
                <p className="mr-2 text-sm font-semibold text-ink">{t.share}</p>
                {share.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-line text-ink/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
                <a
                  href={`mailto:?subject=${enc(post.title)}&body=${enc(url)}`}
                  aria-label="Email"
                  className="grid size-10 place-items-center rounded-full border border-line text-ink/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  <Mail className="size-4" aria-hidden />
                </a>
              </div>

              {/* packages CTA */}
              <div className="relative isolate mt-12 max-w-3xl overflow-hidden rounded-[var(--radius-card)] bg-navy p-7 text-white sm:p-9">
                <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-brand/40 blur-[90px]" />
                <p className="relative text-xl leading-snug font-bold text-balance sm:text-2xl">{t.ctaTitle}</p>
                <p className="relative mt-2 max-w-xl text-sm text-white/75 sm:text-base">{t.ctaBody}</p>
                <Button href={`${localePath(locale, "home")}#packages`} className="relative mt-6">
                  {t.ctaButton}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-pearl py-16 sm:py-20 lg:py-24">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <Reveal>
                <p className="eyebrow">
                  <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
                  {t.relatedEyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.relatedTitle}</h2>
              </Reveal>
              <Link
                href={blogIndexPath(locale)}
                className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand sm:inline-flex"
              >
                {t.allArticles}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
            <ul className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 0.06} className={i === 2 ? "sm:hidden lg:block" : undefined}>
                  <PostCard post={p} locale={locale} categoryFallback={t.category} readArticle={t.readArticle} headingLevel="h3" />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
