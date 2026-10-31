import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMET, COMPARE, SPECS } from "@/components/design/data";
import { ROUTES } from "@/components/design-c/Chrome";
import { LightConsole } from "@/components/design-c/LightConsole";
import { LitText } from "@/components/design-c/LitText";
import { EnquirySection, Faqs } from "@/components/design-c/Parts";
import { ProductVideo } from "@/components/product/ProductVideo";
import { StickyEnquiryBar } from "@/components/product/StickyEnquiryBar";
import { getProductContent } from "@/lib/content";
import { PACKAGES, SITE } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept C product page: Comet 2™ | Hollywood Whitening™" } };

const product = getProductContent("comet-2", "en");

const NUMBERS = [
  { value: "3", label: "Light sources" },
  { value: "40", label: "Treatments included" },
  { value: "1–30", label: "Minute treatment time" },
  { value: COMET.rating.toFixed(2), label: `Rating from ${COMET.reviews} reviews` },
];

const stripped = (html: string) => html.replace(/<[^>]+>/g, "").trim();
const delivery = product.sections.find((s) => s.kind === "delivery")!;
const deliveryText = delivery.blocks.flatMap((b) => (b.type === "p" ? [stripped(b.html)] : []));

export default function ConceptProductPage() {
  return (
    <>
      <section className="hc-off overflow-hidden pt-24 pb-12 sm:pt-28 lg:min-h-dvh">
        <div className="hc-x flex flex-col gap-8 lg:min-h-[calc(100dvh-10rem)] lg:justify-between">
          <div>
            <p className="hc-tag">Best seller · Complete business package</p>
            <h1 className="hc-display mt-4 whitespace-nowrap text-[clamp(5rem,21vw,23rem)] leading-[0.82] tracking-[-0.055em]">
              Comet 2<span className="align-[3.9em] text-[0.14em] tracking-normal">™</span>
            </h1>
          </div>
          <LightConsole />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="hc-lead max-w-3xl">Three light sources in one machine, adjustable to suit each customer’s teeth.</p>
            <div className="flex flex-wrap gap-3">
              <a id="price-cta" href="#enquire" className="hc-btn">
                Request pricing <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href={SITE.phones[0].href} className="hc-btn-line">
                {SITE.phones[0].display}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-on">
        <Image
          src="/images/bg-white.jpg"
          alt="A smiling woman with her hand on the Comet 2 touchscreen"
          width={2560}
          height={1440}
          sizes="100vw"
          className="w-full"
        />
      </section>

      <section className="hc-on hc-section">
        <div className="hc-x">
          <p className="hc-display hc-h2 max-w-[90rem]">Lightweight and aluminium-built. It fits in a small car, and makes a statement in any salon or dental office.</p>
          <div className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <figure className="col-span-2">
              <div className="relative aspect-[12/7]">
                <Image src="/images/products/comet-2/Comet-2-Landscape.jpg" alt="Comet 2 with its complete kit" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="hc-tag mt-3">The complete kit. Pictures are for illustration only.</figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[12/7] lg:aspect-auto lg:h-[calc(100%-2rem)]">
                <Image src="/images/products/comet-2/2.jpg" alt="The Comet 2 light head" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="hc-tag mt-3">High-intensity cold light</figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[12/7] lg:aspect-auto lg:h-[calc(100%-2rem)]">
                <Image src="/images/products/comet-2/6.jpg" alt="The Comet 2 colour touchscreen" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="hc-tag mt-3">5-inch colour touchscreen</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="hc-off hc-section">
        <div className="hc-x">
          <LitText
            className="hc-display hc-h2 max-w-[92rem]"
            text="Cold light that filters out harmful UV and infrared, for a treatment without irritation to the nerve of the tooth. With good care, it’s made to last a lifetime without maintenance."
          />
          <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {NUMBERS.map((n) => (
              <div key={n.label} className="hc-rule pt-5">
                <dd className="hc-display text-[clamp(2.75rem,11vw,6rem)] lg:text-[clamp(3rem,6vw,6rem)]">{n.value}</dd>
                <dt className="mt-3 text-muted">{n.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="hc-on hc-section">
        <div className="hc-x grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <h2 className="hc-display hc-h2">Spec sheet.</h2>
          <dl className="border-b border-line">
            {SPECS.map((spec) => (
              <div key={spec.label} className="hc-rule grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="text-muted">{spec.label}</dt>
                <dd className="text-lg">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {product.videoId && (
        <section className="hc-off">
          <div className="hc-video">
            <ProductVideo id={product.videoId} title={`${product.name} video`} playLabel="Play video" />
          </div>
        </section>
      )}

      <section className="hc-on hc-section">
        <div className="hc-x">
          <h2 className="hc-display hc-h2">The range.</h2>
          <div className="mt-12 overflow-x-auto" tabIndex={0} role="region" aria-label="Package comparison">
            <table className="w-full min-w-[40rem] border-collapse text-left text-lg">
              <thead>
                <tr>
                  <td />
                  {PACKAGES.map((p) => (
                    <th key={p.slug} scope="col" className={`hc-display hc-h3 p-5 ${p.slug === "comet-2" ? "rounded-t-2xl bg-[var(--hc-black)] text-white" : ""}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, r) => (
                  <tr key={row.label} className="border-t border-line">
                    <th scope="row" className="py-4 pr-4 font-normal text-muted">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={i}
                        className={`px-5 py-4 ${i === 1 ? `bg-[var(--hc-black)] font-medium text-white ${r === COMPARE.length - 1 ? "rounded-b-2xl" : ""}` : ""}`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href={ROUTES.service} className="hc-btn-line mt-10">
            Training included with every package <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="hc-on hc-section !pt-0">
        <div className="hc-x grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <h2 className="hc-display hc-h2">Good to know.</h2>
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
        title="Request Comet 2™ pricing."
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
