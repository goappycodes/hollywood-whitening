import { getAboutContent, getCommonContent, getHomeContent } from "@/lib/content";
import { absoluteUrl, LOCALE_META, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { Marquee } from "@/components/home/Marquee";
import { WhyChoose } from "@/components/home/WhyChoose";
import { InstagramFeed } from "@/components/ui/shared/sections/InstagramFeed";
import { LatestPosts } from "@/components/ui/shared/sections/LatestPosts";
import { GetInTouch } from "@/components/ui/shared/sections/GetInTouch";

/**
 * "About Us" in any locale. Mirrors the live /about-us/ page — quote hero, Who We Are,
 * "Get in touch" form, Instagram feed, News & Trends — with the homepage's marquee and
 * "Why choose" sections reused between them.
 * Copy: src/content/<locale>/pages/about.json (+ home.json for the shared parts).
 */
export function AboutSections({ locale }: { locale: Locale }) {
  const content = getAboutContent(locale);
  const home = getHomeContent(locale);
  const common = getCommonContent(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: content.meta.title,
    description: content.meta.description,
    url: absoluteUrl(locale, "about"),
    inLanguage: LOCALE_META[locale].htmlLang,
    about: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: common.nav.home, item: absoluteUrl(locale, "home") },
        { "@type": "ListItem", position: 2, name: common.nav.about, item: absoluteUrl(locale, "about") },
      ],
    },
  };

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      <AboutHero content={content.hero} common={common} locale={locale} />
      <Marquee items={home.marquee} />
      <WhoWeAre content={content.who} stats={home.stats} locale={locale} />
      <WhyChoose content={home.why} locale={locale} />
      <GetInTouch content={content.contact} common={common} locale={locale} />
      <InstagramFeed locale={locale} />
      <LatestPosts
        eyebrow={content.blog.eyebrow}
        title={content.blog.title}
        viewAll={content.blog.viewAll}
        posts={home.blogFaq}
        locale={locale}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
