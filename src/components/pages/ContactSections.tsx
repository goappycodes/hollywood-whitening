import { getCommonContent, getContactContent, getHomeContent } from "@/lib/content";
import { absoluteUrl, LOCALE_META, type Locale } from "@/lib/i18n";
import { CONTACT_MEDIA, OFFICES, SITE } from "@/lib/site";
import { Offices } from "@/components/contact/Offices";
import { Marquee } from "@/components/home/Marquee";
import { GetInTouch } from "@/components/ui/shared/sections/GetInTouch";
import { InstagramFeed } from "@/components/ui/shared/sections/InstagramFeed";
import { PageHero } from "@/components/ui/shared/sections/PageHero";

/**
 * "Contact Us" in any locale. Mirrors the live /contact/ page — brand banner, the three
 * offices ("Shipping & Training Worldwide"), and the form 3 enquiry wizard with the
 * Marie Forleo quote — plus the homepage marquee and the Instagram feed.
 * Copy: src/content/<locale>/pages/contact.json.
 */
export function ContactSections({ locale }: { locale: Locale }) {
  const content = getContactContent(locale);
  const common = getCommonContent(locale);
  const home = getHomeContent(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: content.meta.title,
    description: content.meta.description,
    url: absoluteUrl(locale, "contact"),
    inLanguage: LOCALE_META[locale].htmlLang,
    about: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE.url,
      contactPoint: OFFICES.map((o, i) => ({
        "@type": "ContactPoint",
        telephone: o.phone.href.replace("tel:", ""),
        contactType: "sales",
        areaServed: content.offices.items[i].name,
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: common.nav.home, item: absoluteUrl(locale, "home") },
        { "@type": "ListItem", position: 2, name: common.nav.contact, item: absoluteUrl(locale, "contact") },
      ],
    },
  };

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      <PageHero
        locale={locale}
        common={common}
        current={common.nav.contact}
        image={{ src: CONTACT_MEDIA.hero, alt: content.hero.imageAlt, subject: "right" }}
        eyebrow={content.hero.eyebrow}
        titleBold={content.hero.titleBold}
        titleLight={content.hero.titleLight}
        subtitle={content.hero.subtitle}
        cta={{ label: content.hero.cta, href: "#get-in-touch" }}
      />
      <Marquee items={home.marquee} />
      <Offices content={content.offices} />
      <GetInTouch content={content.form} common={common} locale={locale} />
      <InstagramFeed locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
