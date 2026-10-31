import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LightSelector } from "@/components/design/LightSelector";
import { Enquire, FaqList, SectionLabel } from "@/components/design/Parts";
import { ProductVideo } from "@/components/product/ProductVideo";
import { StickyEnquiryBar } from "@/components/product/StickyEnquiryBar";
import { Reveal } from "@/components/ui/Reveal";
import { getHomeContent, getProductContent } from "@/lib/content";
import { PACKAGES, SITE } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "New product page design: Comet 2™ | Hollywood Whitening™" } };

const product = getProductContent("comet-2", "en");
const packages = getHomeContent("en").packages;
const comet = PACKAGES.find((p) => p.slug === "comet-2")!;

const FACTS = [
  { value: "3", label: "Light sources" },
  { value: "40", label: "Treatments included" },
  { value: "1–30", label: "Minute treatment time" },
  { value: comet.rating.toFixed(2), label: `Rating from ${comet.reviews} reviews` },
];

const SPECS = [
  { label: "Display", value: "5-inch colour touchscreen" },
  { label: "Light output", value: "Blue, Red, Blue + Red + Purple, Blue + Purple" },
  { label: "Power output", value: "Three-stage selection, to suit the customer’s condition" },
  { label: "Treatment time", value: "1–30 minutes" },
  { label: "Frame", value: "Aluminium, with adjustable angles and height" },
  { label: "Standby", value: "Auto sleep after 60 seconds not in use" },
  { label: "Hygiene", value: "Disposable sheath, to help prevent cross-infection" },
  { label: "Voltage", value: "AC 100V–240V" },
  { label: "Machine box", value: "46 × 67 × 20 cm, 11 kg" },
  { label: "Material box", value: "30 × 15 × 25 cm, 4 kg" },
];

const USES = [
  { title: "Made to travel", text: "Lightweight, robust and aluminium-built. It fits easily in a small car, for home visits or rented rooms." },
  { title: "At home in a salon", text: "Equally suited to a fixed location, and designed to make a statement in any salon or dental office." },
  { title: "Safe by design", text: "High-intensity cold light that filters out harmful UV and infrared, without irritating the nerve of the tooth." },
];

const stripped = (html: string) => html.replace(/<[^>]+>/g, "").trim();
const delivery = product.sections.find((s) => s.kind === "delivery")!;
const deliveryText = delivery.blocks.flatMap((b) => (b.type === "p" ? [stripped(b.html)] : []));

const COMPARE = [
  { label: "Use", values: ["Great mobility", "Mobile and fixed", "Fixed only"] },
  { label: "Treatments included", values: PACKAGES.map((p) => packages.items[p.slug].treatments.replace(" Treatments Inc", "")) },
  { label: "Wavelengths", values: ["Single", "Triple", "Single"] },
  { label: "Maintenance", values: ["None", "None", "High"] },
  { label: "Results", values: PACKAGES.map((p) => `${p.results}/10`) },
  { label: "Rating", values: PACKAGES.map((p) => p.rating.toFixed(2)) },
];

export default function DesignProductPage() {
  return (
    <>
      <section className="hw-x grid gap-8 pt-6 sm:pt-10 lg:grid-cols-[7fr_5fr] lg:gap-10">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="hw-label text-muted">Best seller · Ultimate package</p>
            <h1 className="hw-display hw-h1 rise mt-4 whitespace-nowrap !text-[clamp(4rem,10.5vw,10.5rem)]">
              Comet <em>2</em>
              <span className="align-[0.9em] text-[0.3em]">™</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-snug sm:text-2xl">
              The only teeth whitening accelerator in our range with three light sources. Tune the wavelength to suit each customer’s teeth.
            </p>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <a id="price-cta" href="#enquire" className="hw-btn">
                Register your interest <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href={SITE.phones[0].href} className="font-semibold underline underline-offset-4">
                Call for price
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {FACTS.map((fact) => (
                <div key={fact.label} className="hw-rule pt-3">
                  <dd className="hw-display text-5xl">{fact.value}</dd>
                  <dt className="mt-2 text-sm text-muted">{fact.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="hw-lit">
          <Image
            src="/images/products/comet-2/Comet-2-Full-Kit.jpg"
            alt="The Comet 2 machine on its wheeled stand, beside the complete kit"
            width={700}
            height={1200}
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="hw-fade mx-auto w-full max-w-md lg:h-[calc(100dvh-7rem)] lg:min-h-[32rem] lg:w-auto lg:max-w-none"
          />
        </div>
      </section>

      <section className="hw-dark mt-14 overflow-hidden py-16 sm:mt-20 sm:py-28">
        <div className="hw-x">
          <SectionLabel>Triple wavelength technology</SectionLabel>
          <h2 className="hw-display hw-h2 mt-4 mb-12 max-w-4xl">
            Three lights. <em>Four ways</em> to use them.
          </h2>
          <LightSelector />
        </div>
      </section>

      <section className="hw-x py-20 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-3">
          {USES.map((use) => (
            <Reveal key={use.title}>
              <div className="hw-rule pt-4">
                <h2 className="hw-display text-4xl sm:text-5xl">{use.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{use.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hw-x">
        <div className="hw-lit">
          <Image
            src="/images/products/comet-2/Comet-2-Landscape.jpg"
            alt="Comet 2 with its light head on, beside the kit: shade guide, protective glasses, gels and mouth trays"
            width={1200}
            height={700}
            sizes="(min-width: 1536px) 90rem, 100vw"
            className="hw-fade mx-auto w-full max-w-6xl"
          />
        </div>
        <p className="mt-3 text-sm text-muted">Pictures are for illustration only.</p>
      </section>

      <section className="hw-x py-20 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <h2 className="hw-display hw-h2">
            The <em>spec sheet.</em>
          </h2>
          <dl className="border-b border-line">
            {SPECS.map((spec) => (
              <div key={spec.label} className="hw-rule grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="hw-label pt-1 text-muted">{spec.label}</dt>
                <dd className="text-lg">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {product.videoId && (
        <section className="hw-x">
          <div className="hw-video mx-auto max-w-6xl">
            <ProductVideo id={product.videoId} title={`${product.name} video`} playLabel="Play video" />
          </div>
        </section>
      )}

      <section className="hw-x py-20 sm:py-32">
        <h2 className="hw-display hw-h2">
          How it <em>compares.</em>
        </h2>
        <div className="mt-10 overflow-x-auto" tabIndex={0} role="region" aria-label="Package comparison">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr>
                <td />
                {PACKAGES.map((p) => (
                  <th key={p.slug} scope="col" className={`hw-display px-4 py-4 text-3xl sm:text-4xl ${p.slug === "comet-2" ? "bg-white" : ""}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.label} className="hw-rule">
                  <th scope="row" className="hw-label py-4 pr-4 font-normal text-muted">
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={i} className={`px-4 py-4 ${i === 1 ? "bg-white font-semibold" : ""}`}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hw-x">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <h2 className="hw-display hw-h2">
            Good to <em>know.</em>
          </h2>
          <FaqList
            items={[
              { q: "Delivery", a: deliveryText },
              {
                q: "Getting listed on our location finder",
                a: [
                  "A complete package is technically a franchise without the costs: customers can find you on our website by searching for their nearest location.",
                  "We have the right to choose who we list. Listing is available to everyone who buys our systems, but we may decline to list a business that lacks professionalism.",
                ],
              },
            ]}
          />
        </div>
      </section>

      <Enquire
        title={
          <>
            Register your
            <br />
            <em>interest.</em>
          </>
        }
        body="Comet 2™ is priced on enquiry. Leave your details and our team will come back to you with pricing and next steps."
        form="interest"
        productName={product.name}
      />

      <StickyEnquiryBar
        ctaId="price-cta"
        formId="enquire"
        name={comet.name}
        priceLabel={product.callForPrice}
        cta="Register interest"
        phone={{ href: SITE.phones[0].href, label: "Call us" }}
      />
    </>
  );
}
