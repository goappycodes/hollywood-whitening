import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone, Star } from "lucide-react";
import { COMET, COMPARE, LIGHTS, SPECS } from "@/components/design/data";
import { ROUTES } from "@/components/design-d/Chrome";
import { Gallery, type GalleryImage } from "@/components/design-d/Gallery";
import { EnquirySection, Faqs, SectionHead } from "@/components/design-d/Parts";
import { ProductVideo } from "@/components/product/ProductVideo";
import { StickyEnquiryBar } from "@/components/product/StickyEnquiryBar";
import { getProductContent } from "@/lib/content";
import { PACKAGES, SITE } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept D product page: Comet 2™ | Hollywood Whitening™" } };

const product = getProductContent("comet-2", "en");

const IMAGES: GalleryImage[] = [
  { src: "/images/bg-white.jpg", alt: "A woman with her hand on the Comet 2 touchscreen" },
  { src: "/images/products/comet-2/Comet-2-Landscape.jpg", alt: "Comet 2 with its complete kit", position: "75% center" },
  { src: "/images/products/comet-2/2.jpg", alt: "The Comet 2 light head", position: "center 58%" },
  { src: "/images/products/comet-2/6.jpg", alt: "The Comet 2 colour touchscreen", position: "center 53%" },
];

const HIGHLIGHTS = ["Three light sources, adjustable for each customer", "40 treatments included", "Mobile and fixed use", "Training included, no maintenance"];

const SECTIONS = [
  { href: "#light", label: "Light" },
  { href: "#design", label: "Design" },
  { href: "#specification", label: "Specification" },
  { href: "#compare", label: "Compare" },
  { href: "#ordering", label: "Ordering" },
];

const LIGHT_TINTS: Record<string, string> = {
  Blue: "linear-gradient(160deg, #e3ebff, #fff 70%)",
  Red: "linear-gradient(160deg, #ffe4e7, #fff 70%)",
  Purple: "linear-gradient(160deg, #efe4ff, #fff 70%)",
};

const stripped = (html: string) => html.replace(/<[^>]+>/g, "").trim();
const delivery = product.sections.find((s) => s.kind === "delivery")!;
const deliveryText = delivery.blocks.flatMap((b) => (b.type === "p" ? [stripped(b.html)] : []));

export default function ConceptProductPage() {
  return (
    <>
      <section className="hd-x pt-3">
        <div className="grid gap-3 lg:grid-cols-[7fr_5fr]">
          <Gallery images={IMAGES} />
          <div className="hd-tile hd-pearl flex flex-col justify-between gap-8 p-6 sm:p-10">
            <div>
              <p className="hd-eyebrow">Best seller · Complete business package</p>
              <h1 className="hd-h1 mt-2">Comet 2™</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                <Star className="size-4 fill-brand text-brand" aria-hidden />
                {COMET.rating.toFixed(2)} out of 5 · {COMET.reviews} ratings
              </p>
              <p className="hd-lead mt-5">
                A high-intensity cold light whitening system with a unique combination of blue, red and purple light. <span className="hd-accent">Tuned to each customer.</span>
              </p>
              <ul className="mt-5 space-y-2 font-medium">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative z-[4]">
              <p className="text-sm text-muted">Pricing is provided on enquiry.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a id="price-cta" href="#enquire" className="hd-btn flex-1">
                  Request pricing <ArrowRight className="size-4" aria-hidden />
                </a>
                <a href={SITE.phones[0].href} className="hd-btn-line flex-1">
                  <Phone className="size-4" aria-hidden /> {SITE.phones[0].display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="On this page" className="hd-x sticky top-[7.25rem] z-30 pt-3 md:top-[4.75rem]">
        <div className="hd-float flex gap-5 overflow-x-auto !rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap sm:gap-8">
          {SECTIONS.map((section) => (
            <a key={section.href} href={section.href} className="hover:text-brand">
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="light" className="hd-x scroll-mt-40 pt-14 sm:pt-20">
        <SectionHead eyebrow="Triple wavelength technology" title={<>Three light sources, <span className="hd-accent">four settings</span></>}>
          Select Blue, Red, Blue + Red + Purple or Blue + Purple, with three power levels to suit the customer’s condition.
        </SectionHead>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {LIGHTS.map((light) => (
            <li key={light.name} className="hd-tile p-6" style={{ background: LIGHT_TINTS[light.name] }}>
              <span className="block size-3 rounded-full" style={{ backgroundColor: light.color, boxShadow: `0 0 16px 3px ${light.color}` }} aria-hidden />
              <h3 className="hd-h3 mt-6">{light.name} light</h3>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Wavelength</dt>
                  <dd className="font-semibold">{light.range}</dd>
                </div>
                <div>
                  <dt className="text-muted">Power</dt>
                  <dd className="font-semibold">{light.power}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section id="design" className="hd-x scroll-mt-40 pt-14 sm:pt-20">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="hd-tile hd-ink flex flex-col justify-center p-6 sm:p-10 md:col-span-2">
            <p className="hd-eyebrow">Designed for professionals</p>
            <h2 className="hd-h2 mt-2">
              At home in a salon, <span className="hd-accent">and on the move</span>
            </h2>
            <p className="hd-lead mt-4">
              Lightweight, robust aluminium construction that fits easily in a small car, with a colour touchscreen that makes a statement in any salon or dental office.
            </p>
          </div>
          <div className="hd-tile relative min-h-80 bg-white">
            <Image src="/images/products/comet-2/2.jpg" alt="The Comet 2 light head" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            <p className="hd-float absolute right-3 bottom-3 left-3 p-3 text-sm font-medium">Filters out harmful UV and infrared</p>
          </div>
          <div className="hd-tile relative min-h-80 bg-white">
            <Image src="/images/products/comet-2/6.jpg" alt="The Comet 2 colour touchscreen" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            <p className="hd-float absolute right-3 bottom-3 left-3 p-3 text-sm font-medium">5-inch touch display</p>
          </div>
        </div>
      </section>

      <section id="specification" className="hd-x scroll-mt-40 pt-14 sm:pt-20">
        <div className="hd-tile grid gap-6 p-6 sm:p-10 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div>
            <p className="hd-eyebrow">Specification</p>
            <h2 className="hd-h2 mt-2">The details</h2>
          </div>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {SPECS.map((spec) => (
              <div key={spec.label} className="border-t border-line py-3.5">
                <dt className="text-sm text-muted">{spec.label}</dt>
                <dd className="mt-0.5 font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {product.videoId && (
        <section className="hd-x pt-3">
          <div className="hd-video">
            <ProductVideo id={product.videoId} title={`${product.name} video`} playLabel="Play video" />
          </div>
        </section>
      )}

      <section id="compare" className="hd-x scroll-mt-40 pt-14 sm:pt-20">
        <SectionHead
          eyebrow="Compare"
          title={<>How Comet 2™ <span className="hd-accent">compares</span></>}
          action={
            <Link href={ROUTES.service} className="hd-link">
              Training is included with every package <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        />
        <div className="hd-tile mt-5 overflow-x-auto" tabIndex={0} role="region" aria-label="Package comparison">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr>
                <td className="w-[22%]" />
                {PACKAGES.map((p) => (
                  <th key={p.slug} scope="col" className={`px-5 py-4 text-lg font-semibold ${p.slug === "comet-2" ? "bg-brand-sky/50" : ""}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th scope="row" className="px-5 py-3.5 text-[0.95rem] font-medium text-muted">
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={i} className={`px-5 py-3.5 font-medium ${i === 1 ? "bg-brand-sky/50" : ""}`}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="ordering" className="hd-x scroll-mt-40 pt-14 pb-3 sm:pt-20">
        <div className="hd-tile grid gap-6 p-6 sm:p-10 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div>
            <p className="hd-eyebrow">Ordering</p>
            <h2 className="hd-h2 mt-2">Delivery and listing</h2>
          </div>
          <div className="relative z-[4]">
            <Faqs
              items={[
                { q: "Delivery", a: deliveryText },
                {
                  q: "Listing on our location finder",
                  a: [
                    "A complete package is technically a franchise without the costs: customers can find you on our website by searching for their nearest location.",
                    "We have the right to choose who we list. Listing is available to everyone who buys our systems, but we may decline to list a business that lacks professionalism.",
                  ],
                },
              ]}
            />
          </div>
        </div>
      </section>

      <EnquirySection
        title={<>Request <span className="hd-accent">Comet 2™ pricing</span></>}
        body="Leave your details and our team will come back to you with pricing and next steps."
        form="interest"
        productName={product.name}
      />

      <StickyEnquiryBar
        ctaId="price-cta"
        formId="enquire"
        name={COMET.name}
        priceLabel={product.callForPrice}
        cta="Request pricing"
        phone={{ href: SITE.phones[0].href, label: "Call us" }}
      />
    </>
  );
}
