import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Arc } from "@/components/design-c/Arc";
import { ROUTES } from "@/components/design-c/Chrome";
import { LitText } from "@/components/design-c/LitText";
import { EnquirySection, Faqs } from "@/components/design-c/Parts";
import { SwitchOnHero } from "@/components/design-c/SwitchOnHero";
import { fill, getHomeContent } from "@/lib/content";
import { PACKAGES, type PackageSlug } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept C homepage | Hollywood Whitening™" } };

const home = getHomeContent("en");

/** Tall studio shots, sharp at full screen height. */
const PORTRAITS: Record<PackageSlug, { src: string; width: number; height: number; contain?: boolean }> = {
  "star-one": { src: "/images/products/star-one/3.jpg", width: 700, height: 1200 },
  "comet-2": { src: "/images/products/comet-2/2.jpg", width: 700, height: 1200 },
  galaxy: { src: "/images/products/galaxy/Galaxy.jpg", width: 700, height: 933, contain: true },
};

const NUMBERS = [
  { value: "20+", label: "Years in cosmetic whitening" },
  { value: "3", label: "Continents with offices" },
  { value: "4.9", label: "Average package rating" },
  { value: "$2.5bn", label: "Annual whitening industry" },
];

const FAQ_PICKS = [3, 1, 2, 5];

export default function ConceptHomePage() {
  const [lead, ...others] = [home.testimonials.items[2], home.testimonials.items[0], home.testimonials.items[1], home.testimonials.items[3]];

  return (
    <>
      <SwitchOnHero
        headline={
          <h1 className="hc-display hc-giant">
            Cold light.
            <br />
            Serious business.
          </h1>
        }
        plate={
          <div className="hc-x flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <p className="hc-lead max-w-3xl">Complete teeth whitening systems, training and brand, for salons, clinics and technicians.</p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a href="#systems" className="hc-btn">
                See the systems <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#enquire" className="hc-btn-line">
                Enquire
              </a>
            </div>
          </div>
        }
      />

      <section className="hc-off hc-section">
        <div className="hc-x">
          <LitText
            className="hc-display hc-h2 max-w-[92rem]"
            text="For more than 20 years, we have put professional whitening in the hands of salons, clinics and technicians. The machine, the treatments, the training and the brand, in one complete package."
          />
          <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {NUMBERS.map((n) => (
              <div key={n.label} className="hc-rule pt-5">
                <dd className="hc-display text-[clamp(2.5rem,10vw,5rem)] lg:text-[clamp(2.75rem,4.6vw,5rem)]">{n.value}</dd>
                <dt className="mt-3 text-muted">{n.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="systems" className="hc-off hc-section scroll-mt-0 !pt-0">
        <div className="hc-x">
          <div className="hc-rule flex flex-col gap-4 pt-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <h2 className="hc-display hc-h2">Three systems, one standard.</h2>
            <p className="text-muted">Pricing is provided on enquiry.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
            {PACKAGES.map((pkg, i) => {
              const item = home.packages.items[pkg.slug];
              const portrait = PORTRAITS[pkg.slug];
              const comet = pkg.slug === "comet-2";
              return (
                <article key={pkg.slug} className={`hc-card flex flex-col p-5 sm:p-7 ${comet ? "hc-card-lit" : ""} ${i === 1 ? "md:mt-10" : i === 2 ? "md:mt-20" : ""}`}>
                  <div className="hc-capsule mx-auto aspect-[3/4] w-[72%]">
                    <Image
                      src={portrait.src}
                      alt={`${pkg.name} machine`}
                      fill
                      sizes="(min-width: 768px) 22vw, 72vw"
                      className={portrait.contain ? "object-contain p-6" : "object-cover"}
                    />
                  </div>
                  <p className="hc-tag mt-8">
                    {String(i + 1).padStart(2, "0")} / 03 · {comet ? "Best seller" : item.badge}
                  </p>
                  <h3 className="hc-display hc-h3 mt-2">{pkg.name}</h3>
                  <ul className="mt-6 flex-1">
                    {[item.treatments.replace(" Inc", " included"), ...item.features].map((feature) => (
                      <li key={feature} className="hc-rule py-2.5">
                        {feature}
                      </li>
                    ))}
                    <li className="hc-rule py-2.5 text-muted">
                      {pkg.rating.toFixed(2)} / 5 · {fill(home.packages.ratingCount, { n: pkg.reviews })}
                    </li>
                  </ul>
                  <a href={comet ? ROUTES.product : "#enquire"} className={`mt-6 w-full ${comet ? "hc-btn" : "hc-btn-line"}`}>
                    {comet ? "Explore Comet 2™" : "Enquire"} <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hc-on">
        <Image
          src="/images/teeth-guys.jpg"
          alt="Two men smiling as they look at a Hollywood Whitening product box"
          width={2560}
          height={1707}
          sizes="100vw"
          className="aspect-[4/3] w-full object-cover object-top lg:aspect-[21/10]"
        />
        <div className="hc-x hc-section grid gap-10 !pt-12 lg:grid-cols-[3fr_2fr] lg:gap-20 lg:!pt-20">
          <h2 className="hc-display hc-h2">Trained in hours. Certified for good.</h2>
          <div>
            <p className="hc-lead text-muted">
              Free with every package. Professional trainers take you through the products, the legal requirements and marketing, remotely.
            </p>
            <Link href={ROUTES.service} className="hc-btn mt-8">
              How training works <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="hc-off hc-section overflow-hidden">
        <div className="hc-x">
          <Arc className="w-full max-w-md" stroke={4} />
          <figure className="mt-12">
            <blockquote className="hc-display hc-h2 max-w-[92rem]">“{lead.quote}”</blockquote>
            <figcaption className="mt-8 text-muted">
              {lead.name}, {lead.location}
            </figcaption>
          </figure>
          <div className="mt-20 grid gap-10 md:grid-cols-3">
            {others.map((t) => (
              <figure key={t.name} className="hc-rule pt-5">
                <blockquote className="hc-lead">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted">
                  {t.name}, {t.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-on hc-section">
        <div className="hc-x grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <h2 className="hc-display hc-h2">Clear answers.</h2>
          <Faqs items={FAQ_PICKS.map((i) => home.blogFaq.faqs[i])} />
        </div>
      </section>

      <EnquirySection
        title="Switch on your business."
        body="Tell us about your plans and our team will talk you through the packages, pricing and next steps."
      />
    </>
  );
}
