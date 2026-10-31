import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { COMET, COMPARE, LIGHTS, SPECS } from "@/components/design/data";
import { ROUTES } from "@/components/design-b/Chrome";
import { Gallery, type GalleryImage } from "@/components/design-b/Gallery";
import { EnquirySection, Faqs, SectionIntro } from "@/components/design-b/Parts";
import { ProductVideo } from "@/components/product/ProductVideo";
import { StickyEnquiryBar } from "@/components/product/StickyEnquiryBar";
import { getProductContent } from "@/lib/content";
import { PACKAGES, SITE } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept B product page: Comet 2™ | Hollywood Whitening™" } };

const product = getProductContent("comet-2", "en");

const IMAGES: GalleryImage[] = [
  { src: "/images/products/comet-2/Comet-2-Landscape.jpg", alt: "Comet 2 with its complete kit", width: 1200, height: 700, position: "75% center" },
  { src: "/images/bg-white.jpg", alt: "A woman with her hand on the Comet 2 touchscreen", width: 2560, height: 1440 },
  { src: "/images/products/comet-2/2.jpg", alt: "The Comet 2 light head", width: 700, height: 1200, position: "center 58%" },
  { src: "/images/products/comet-2/6.jpg", alt: "The Comet 2 colour touchscreen", width: 700, height: 1200, position: "center 53%" },
];

const HIGHLIGHTS = ["Three light sources, adjustable for each customer", "40 treatments included", "Mobile and fixed use", "Training included, no maintenance"];

const BENEFITS = [
  { title: "For the treatment room", text: "Colour touchscreen, adjustable angles and height, and treatment times from 1 to 30 minutes." },
  { title: "For the road", text: "Lightweight and robust aluminium construction that fits easily in a small car." },
  { title: "For peace of mind", text: "High-intensity cold light that filters out harmful UV and infrared. With good care, it’s made to last without maintenance." },
];

const stripped = (html: string) => html.replace(/<[^>]+>/g, "").trim();
const delivery = product.sections.find((s) => s.kind === "delivery")!;
const deliveryText = delivery.blocks.flatMap((b) => (b.type === "p" ? [stripped(b.html)] : []));

export default function ConceptProductPage() {
  return (
    <>
      <section className="hb-x grid items-start gap-10 pt-8 pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pt-12">
        <Gallery images={IMAGES} />
        <div className="lg:sticky lg:top-8">
          <p className="hb-eyebrow">Complete business package</p>
          <h1 className="hb-h1 mt-3 !text-[clamp(2.5rem,4vw,3.5rem)]">Comet 2™</h1>
          <p className="mt-3 text-sm text-muted">
            {COMET.rating.toFixed(2)} out of 5 · {COMET.reviews} ratings
          </p>
          <p className="hb-lead mt-5">
            Our best-selling whitening system, with a unique combination of blue, red and purple light sources. Choose the wavelength that suits each customer’s teeth.
          </p>
          <ul className="mt-6 space-y-2.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="hb-card mt-8 p-5">
            <p className="text-sm text-muted">Pricing is provided on enquiry.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a id="price-cta" href="#enquire" className="hb-btn flex-1">
                Request pricing
              </a>
              <a href={SITE.phones[0].href} className="hb-btn-line flex-1">
                <Phone className="size-4" aria-hidden /> {SITE.phones[0].display}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="hb-porcelain hb-section">
        <div className="hb-x grid items-center gap-10 md:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="hb-arch mx-auto w-full max-w-sm">
            <Image
              src="/images/science/teeth-whitening-machine.jpg"
              alt="A smiling man seated beside the Comet 2"
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <SectionIntro eyebrow="Designed for professionals" title="At home in a salon, and on the move" />
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="leading-relaxed text-muted">{benefit.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hb-section">
        <div className="hb-x">
          <SectionIntro eyebrow="Triple wavelength technology" title="Three light sources, four settings">
            Select Blue, Red, Blue + Red + Purple or Blue + Purple, with three power levels to suit the customer’s condition.
          </SectionIntro>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {LIGHTS.map((light) => (
              <li key={light.name} className="hb-card p-6">
                <span className="block size-3 rounded-full" style={{ backgroundColor: light.color }} aria-hidden />
                <h3 className="hb-h3 mt-5">{light.name} light</h3>
                <p className="mt-2 text-muted">{light.range}</p>
                <p className="text-muted">{light.power}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hb-section !pt-0">
        <div className="hb-x grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <SectionIntro eyebrow="Specification" title="The details" />
          <dl className="divide-y divide-line border-y border-line">
            {SPECS.map((spec) => (
              <div key={spec.label} className="grid gap-1 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="text-muted">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {product.videoId && (
        <section className="hb-porcelain hb-section">
          <div className="hb-x">
            <div className="hb-video mx-auto max-w-4xl">
              <ProductVideo id={product.videoId} title={`${product.name} video`} playLabel="Play video" />
            </div>
          </div>
        </section>
      )}

      <section className="hb-section">
        <div className="hb-x">
          <SectionIntro eyebrow="Compare" title="How Comet 2™ compares" />
          <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-label="Package comparison">
            <table className="w-full min-w-[38rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <td className="py-3" />
                  {PACKAGES.map((p) => (
                    <th key={p.slug} scope="col" className={`hb-h3 px-4 py-3 ${p.slug === "comet-2" ? "bg-brand-sky" : ""}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <th scope="row" className="py-3.5 pr-4 font-normal text-muted">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className={`px-4 py-3.5 ${i === 1 ? "bg-brand-sky font-medium" : ""}`}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href={ROUTES.service} className="hb-link mt-8">
            Training is included with every package <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="hb-section !pt-0">
        <div className="hb-x grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <SectionIntro eyebrow="Ordering" title="Delivery and listing" />
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
      </section>

      <EnquirySection
        title="Request Comet 2™ pricing"
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
