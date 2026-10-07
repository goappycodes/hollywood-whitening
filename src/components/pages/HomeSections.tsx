import { getCommonContent, getHomeContent } from "@/lib/content";
import { absoluteUrl, LOCALE_META, type Locale } from "@/lib/i18n";
import { PACKAGES } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { Packages } from "@/components/home/Packages";
import { Technology } from "@/components/home/Technology";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Trend } from "@/components/home/Trend";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogFaq } from "@/components/home/BlogFaq";
import { InstagramFeed } from "@/components/ui/shared/sections/InstagramFeed";
import { ProviderCta } from "@/components/home/ProviderCta";

/** The homepage in any locale. Copy comes from src/content/<locale>/pages/home.json. */
export function HomeSections({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale);
  const common = getCommonContent(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: LOCALE_META[locale].htmlLang,
      mainEntity: content.blogFaq.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: [...f.a, ...(f.list ?? [])].join(" "),
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: content.packages.title,
      itemListElement: PACKAGES.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.name} ${content.packages.completePackage}`,
        url: absoluteUrl(locale, p.slug),
      })),
    },
  ];

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      <Hero content={content} common={common} locale={locale} />
      <Marquee items={content.marquee} />
      <GlobalPresence content={content.global} locale={locale} />
      <Packages content={content.packages} locale={locale} />
      <Technology content={content.technology} locale={locale} />
      <WhyChoose content={content.why} locale={locale} />
      <Trend content={content.trend} />
      <Testimonials content={content.testimonials} />
      <InstagramFeed locale={locale} />
      <BlogFaq content={content.blogFaq} locale={locale} />
      <ProviderCta content={content.provider} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
