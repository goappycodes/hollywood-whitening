import { fill, getCommonContent, getHomeContent, getProductContent, type ProductKey } from "@/lib/content";
import { absoluteUrl, LOCALE_META, type Locale } from "@/lib/i18n";
import { PACKAGES, SITE } from "@/lib/site";
import { ProductHero } from "@/components/product/ProductHero";
import {
  ProductDelivery,
  ProductDescription,
  ProductFaq,
  ProductPackage,
  ProductTextSection,
} from "@/components/product/ProductDetails";
import { ProductVideo } from "@/components/product/ProductVideo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { StickyEnquiryBar } from "@/components/product/StickyEnquiryBar";
import { GetInTouch } from "@/components/ui/shared/sections/GetInTouch";

/**
 * A package (product) page in any locale, built the way allwhitelaser-next builds its
 * machine pages: static and **enquiry-led** — no price, quantity or basket. The live
 * "Call for Price" leads to the page's "Register Your Interest" form (Gravity Forms 7).
 *
 * Buying stays on WordPress: staff send a `?poa=…` link (the `poa_url` plugin), which
 * shows that customer's price and add-to-cart on the WooCommerce page. src/proxy.ts
 * sends any such link that lands here on to WordPress.
 *
 * Copy: src/content/<locale>/products/<key>.json (scripts/product-scrape.mjs); the
 * highlights reuse the homepage package card (home.json → packages.items).
 */
export function ProductSections({ product, locale }: { product: ProductKey; locale: Locale }) {
  const live = getProductContent(product, locale);
  // The live Galaxy™ page has no enquiry form, so no form title — every package here is
  // enquiry-led, so borrow the same form 7 title from Star One™ in this locale.
  const content = { ...live, formTitle: live.formTitle || getProductContent("star-one", locale).formTitle };
  const common = getCommonContent(locale);
  const home = getHomeContent(locale);
  const pkg = PACKAGES.find((p) => p.slug === product)!;
  const card = home.packages.items[product];
  const t = common.product;

  // Live product-footer sections by kind (Star One™/Comet 2™: description + delivery;
  // Galaxy™ adds complete package, training, about and FAQs).
  const of = (kind: string) => content.sections.filter((s) => s.kind === kind);
  const [description] = of("description");
  const [packageList] = of("package");
  const delivery = of("delivery");
  const longform = content.sections.filter((s) => ["training", "about", "other"].includes(s.kind));
  const faq = of("faq");

  const url = absoluteUrl(locale, product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.name,
    description: content.meta.description,
    url,
    image: content.gallery.map((g) => `${SITE.url}${g.src}`),
    brand: { "@type": "Brand", name: SITE.name },
    category: content.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: pkg.rating,
      reviewCount: pkg.reviews,
      bestRating: 5,
    },
    inLanguage: LOCALE_META[locale].htmlLang,
  };

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      <ProductHero content={content} pkg={pkg} card={card} packages={home.packages} common={common} locale={locale} />

      {content.videoId && (
        <section className="relative isolate overflow-hidden bg-navy py-16 sm:py-20 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -left-40 size-[32rem] rounded-full bg-brand/25 blur-[140px]"
          />
          <div className="container-x relative mx-auto max-w-5xl">
            <ProductVideo
              id={content.videoId}
              title={fill(t.videoTitle, { name: content.name })}
              playLabel={t.playVideo}
            />
          </div>
        </section>
      )}

      {description && <ProductDescription section={description} specsLabel={t.specs} />}
      {packageList && <ProductPackage section={packageList} />}

      <GetInTouch
        id="enquire"
        form="interest"
        content={{ eyebrow: pkg.name, title: content.formTitle, body: t.formIntro, callUs: t.speak }}
        common={common}
        locale={locale}
      />

      {longform.map((s, i) => (
        <ProductTextSection key={s.heading} section={s} tone={i % 2 ? "pearl" : "white"} />
      ))}
      {faq.map((s) => (
        <ProductFaq key={s.heading} section={s} />
      ))}
      {delivery.map((s) => (
        <ProductDelivery key={s.heading} section={s} />
      ))}

      <RelatedProducts
        title={content.related.title}
        // Live's related product first, then the other packages, so the row is complete.
        slugs={[...new Set([...content.related.items, ...PACKAGES.map((p) => p.slug)])].filter((s) => s !== product)}
        packages={home.packages}
        viewLabel={t.viewPackage}
        locale={locale}
      />

      <StickyEnquiryBar
        ctaId="price-cta"
        formId="enquire"
        name={pkg.name}
        priceLabel={content.callForPrice}
        // Short label — the live form title is too long for a phone-width bar in es/de/ru.
        cta={t.stickyCta}
        phone={{ href: SITE.phones[0].href, label: t.speak }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
