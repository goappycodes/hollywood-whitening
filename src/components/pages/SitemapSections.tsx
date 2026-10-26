import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ChevronRight, FileCode2, FileText, Newspaper, Package, Scale, UserRound } from "lucide-react";
import { getAllBlogs, type BlogPost } from "@/lib/blog";
import { blogIndexPath, blogPostPath } from "@/lib/blog-locale";
import { getCommonContent } from "@/lib/content";
import { absoluteUrl, localePath, LOCALE_META, pageHref, type Locale, type PageKey } from "@/lib/i18n";
import { SITE } from "@/lib/site";

/**
 * HTML sitemap (/sitemap/, /es/mapa-del-sitio-2/, …). The live WordPress page is an
 * auto-generated list of every WP page, cart/checkout/thank-you included; this one
 * lists only real destinations, grouped, plus every blog post in this locale. The
 * machine-readable version is /sitemap.xml (src/app/sitemap.ts).
 */

type Item = { href: string; label: string; note?: string };
type Group = { title: string; icon: LucideIcon; items: Item[] };

/** Every post in this locale (the API caps per_page at 50). Empty if WordPress is unreachable. */
async function allPosts(locale: Locale): Promise<BlogPost[]> {
  const first = await getAllBlogs(1, 50, locale);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) => getAllBlogs(i + 2, 50, locale)),
  );
  return [first, ...rest].flatMap((l) => l.blogs);
}

/** Absolute hrefs (pages still on WordPress, booking login) open as plain links. */
function SitemapLink({ href, label, note }: Item) {
  const className = "group flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-brand-sky/60";
  const body = (
    <>
      <ChevronRight className="mt-0.5 size-4 shrink-0 text-brand/50 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
      <span className="min-w-0">
        <span className="font-medium text-ink group-hover:text-brand-deep">{label}</span>
        {note && <span className="mt-0.5 block text-xs text-muted">{note}</span>}
      </span>
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <a href={href} className={className}>
      {body}
    </a>
  );
}

export async function SitemapSections({ locale }: { locale: Locale }) {
  const common = getCommonContent(locale);
  const t = common.sitemap;
  const nav = common.nav;
  const link = (page: PageKey, label: string, note?: string): Item => ({ href: pageHref(locale, page), label, note });

  const groups: Group[] = [
    {
      title: t.pages,
      icon: FileText,
      items: [
        link("home", nav.home),
        link("about", nav.about),
        link("science", nav.science),
        link("laser", nav.faq),
        link("training", nav.training),
        link("providers", nav.providers),
        { href: blogIndexPath(locale), label: nav.blog },
        link("contact", nav.contact),
      ],
    },
    {
      title: t.products,
      icon: Package,
      items: [
        link("star-one", "Star One™", common.navDescriptions["star-one"]),
        link("comet-2", "Comet 2™", common.navDescriptions["comet-2"]),
        link("galaxy", "Galaxy™", common.navDescriptions.galaxy),
        link("shop", nav.shop),
      ],
    },
    {
      title: t.legal,
      icon: Scale,
      items: [link("privacy", common.footer.privacy), link("terms", common.footer.terms), link("warranty", common.footer.warranty)],
    },
    {
      title: t.account,
      icon: UserRound,
      items: [link("account", common.footer.myAccount), { href: SITE.bookingLoginUrl, label: common.footer.bookingLogin }],
    },
  ];

  const posts = await allPosts(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.metaTitle,
    description: t.metaDescription,
    url: absoluteUrl(locale, "sitemap"),
    inLanguage: LOCALE_META[locale].htmlLang,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: nav.home, item: absoluteUrl(locale, "home") },
        { "@type": "ListItem", position: 2, name: t.title, item: absoluteUrl(locale, "sitemap") },
      ],
    },
  };

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      {/* compact hero, as on the legal pages */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-brand/25 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-40 size-[24rem] rounded-full bg-cyan/10 blur-[110px]"
        />
        <div className="container-x relative py-14 sm:py-20 lg:py-24">
          <nav aria-label={common.breadcrumb} className="text-xs text-white/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={localePath(locale, "home")} className="transition-colors hover:text-white">
                  {nav.home}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5 text-white/30" />
              </li>
              <li aria-current="page" className="text-white/90">
                {t.title}
              </li>
            </ol>
          </nav>
          <p className="pill glass-dark mt-5 text-[10px] tracking-[0.12em] text-cyan sm:text-[11px] sm:tracking-[0.18em]">
            <span className="size-1.5 rounded-full bg-cyan" aria-hidden />
            {t.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[2.1rem] leading-[1.08] font-bold tracking-[-0.035em] sm:text-5xl lg:text-[3.4rem]">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{t.intro}</p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map(({ title, icon: Icon, items }) => (
              <nav key={title} aria-label={title} className="rounded-[var(--radius-card)] border border-line bg-pearl p-5 sm:p-6">
                <h2 className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-ink uppercase">
                  <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {title}
                </h2>
                <ul className="-mx-3 mt-4 space-y-0.5 text-sm">
                  {items.map((item) => (
                    <li key={item.href}>
                      <SitemapLink {...item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <nav aria-label={t.posts} className="mt-5 rounded-[var(--radius-card)] border border-line p-5 sm:p-8">
            <h2 className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-ink uppercase">
              <span className="grid size-9 place-items-center rounded-xl bg-brand text-white">
                <Newspaper className="size-4" aria-hidden />
              </span>
              <Link href={blogIndexPath(locale)} className="transition-colors hover:text-brand">
                {t.posts}
              </Link>
              {posts.length > 0 && <span className="text-xs font-medium tracking-normal text-muted tabular-nums">({posts.length})</span>}
            </h2>
            {posts.length > 0 ? (
              <ul className="-mx-3 mt-4 grid gap-x-8 gap-y-0.5 text-sm md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <SitemapLink href={blogPostPath(post, locale)} label={post.title} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                <Link href={blogIndexPath(locale)} className="text-brand underline-offset-4 hover:underline">
                  {t.postsEmpty}
                </Link>
              </p>
            )}
          </nav>

          <p className="mt-8 text-center text-sm">
            <a href="/sitemap.xml" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-brand">
              <FileCode2 className="size-4" aria-hidden />
              {t.xml}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
