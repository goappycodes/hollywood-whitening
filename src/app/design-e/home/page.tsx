import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, GraduationCap, MapPin, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { BgVideo } from "@/components/design/BgVideo";
import { PackageFinder, type FinderResult } from "@/components/design-d/PackageFinder";
import { EnquirySection, Faqs, SectionHead } from "@/components/design-d/Parts";
import { Badge } from "@/components/design-e/Badge";
import { ROUTES, Ticker } from "@/components/design-e/Chrome";
import { fill, getHomeContent } from "@/lib/content";
import { PACKAGES, type PackageSlug } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept E homepage | Hollywood Whitening™" } };

const home = getHomeContent("en");

const FINDER: FinderResult[] = [
  {
    answer: "On the move",
    name: "Star One™",
    why: "Great mobility in a starter package, with 20 treatments included to get you going.",
    image: "/images/products/star-one/Star-1-Landscape.jpg",
    facts: ["Great mobility", "Single wavelength", "20 treatments included", "No maintenance"],
    rating: "5.00 out of 5 · 9 ratings",
    cta: { href: "#enquire", label: "Enquire about Star One™" },
    alternative: "Want triple wavelengths on the road? Comet 2™ fits easily in a small car.",
  },
  {
    answer: "On the move and in a room",
    name: "Comet 2™",
    why: "Our best seller, ideal for home visits and fixed locations alike, with triple wavelength technology.",
    image: "/images/products/comet-2/Comet-2-Landscape.jpg",
    facts: ["Mobile and fixed use", "Triple wavelengths", "40 treatments included", "No maintenance"],
    rating: "4.93 out of 5 · 14 ratings",
    cta: { href: ROUTES.product, label: "Explore Comet 2™" },
  },
  {
    answer: "In a fixed location",
    name: "Galaxy™",
    why: "Built for fixed use only, with the most treatments included of any package.",
    image: "/images/products/galaxy/Galaxy1200x700px.png",
    facts: ["Fixed use only", "Single wavelength", "50 treatments included", "High maintenance"],
    rating: "4.78 out of 5 · 9 ratings",
    cta: { href: "#enquire", label: "Enquire about Galaxy™" },
    alternative: "Prefer no maintenance? Comet 2™ also suits a fixed room.",
  },
];

/** Tall studio shots, sharp in the capsule frames. */
const PORTRAITS: Record<PackageSlug, { src: string; contain?: boolean }> = {
  "star-one": { src: "/images/products/star-one/3.jpg" },
  "comet-2": { src: "/images/products/comet-2/2.jpg" },
  galaxy: { src: "/images/products/galaxy/Galaxy.jpg", contain: true },
};

const STATS = [
  { value: "20+", label: "years" },
  { value: "3", label: "continents" },
  { value: "4.9/5", label: "average rating" },
];

const INCLUDED = [
  { icon: PackageCheck, title: "Treatments to start", text: "20 to 50 treatments included, depending on your package." },
  { icon: Sparkles, title: "#1 Hollywood branding", text: "A brand your customers want and your competitors envy." },
  { icon: MapPin, title: "Location finder", text: "Customers can find you on our website, subject to listing terms." },
  { icon: ShieldCheck, title: "Verified certificate", text: "Customers and insurers can check your qualification online." },
];

const FAQ_PICKS = [3, 1, 2, 5];

export default function ConceptHomePage() {
  const lead = home.testimonials.items[2];
  const others = [home.testimonials.items[1], home.testimonials.items[0]];

  return (
    <>
      <section className="hd-x pt-3">
        <div className="relative grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="hd-tile hd-pearl flex flex-col justify-center gap-10 p-6 pb-24 sm:p-10 sm:pb-28 lg:min-h-[43rem] lg:p-14 lg:pr-[20%]">
            <div>
              <p className="hd-eyebrow">For salons, clinics and technicians</p>
              <h1 className="hd-h1 mt-3">
                The complete teeth whitening business, <span className="hd-accent">ready to open</span>
              </h1>
              <p className="hd-lead mt-5 max-w-xl">{home.packages.intro}</p>
              <div className="relative z-[4] mt-8 flex flex-wrap gap-3">
                <a href="#finder" className="hd-btn">
                  Find your package <ArrowRight className="size-4" aria-hidden />
                </a>
                <a href="#enquire" className="hd-btn-line">
                  Request pricing
                </a>
              </div>
            </div>
            <dl className="flex flex-wrap gap-2">
              {STATS.map((stat) => (
                <div key={stat.label} className="he-pill flex items-baseline gap-2 px-4 py-2">
                  <dd className="text-lg font-semibold tracking-tight">{stat.value}</dd>
                  <dt className="text-sm text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative z-10 mx-auto -mt-16 h-[30rem] w-[min(100%,24rem)] sm:h-[36rem] sm:w-[28rem] lg:mt-0 lg:mr-0 lg:-ml-[22%] lg:h-[40rem] lg:w-auto lg:self-center">
            <div className="he-capsule absolute inset-0">
              <BgVideo buttonClassName="bottom-6 left-1/2 -translate-x-1/2" />
            </div>
            <Badge className="absolute top-8 -left-3 z-20 lg:top-16 lg:-left-14" />
            <Link href={ROUTES.product} className="hd-float absolute right-0 bottom-20 z-20 flex items-center gap-4 p-4 lg:-right-2 lg:bottom-28">
              <span>
                <span className="block text-xs font-semibold text-brand">Best seller</span>
                <span className="block font-semibold whitespace-nowrap">Comet 2™ package</span>
              </span>
              <ArrowUpRight className="size-5 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <Ticker />

      <section id="finder" className="hd-x scroll-mt-24 pt-16 sm:pt-24">
        <SectionHead eyebrow="Package finder" title={<>Start with <span className="hd-accent">how you work</span></>} />
        <PackageFinder results={FINDER} />
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <SectionHead eyebrow="Business packages" title={<>Three systems, <span className="hd-accent">one standard</span></>}>
          Pricing is provided on enquiry.
        </SectionHead>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {PACKAGES.map((pkg, i) => {
            const item = home.packages.items[pkg.slug];
            const portrait = PORTRAITS[pkg.slug];
            const comet = pkg.slug === "comet-2";
            return (
              <article key={pkg.slug} className={`hd-tile flex flex-col p-5 sm:p-6 ${i > 0 ? `he-stagger-${i + 1}` : ""} ${comet ? "hd-ink he-iris" : "hd-pearl"}`}>
                <div className="he-capsule mx-auto aspect-[3/4] w-[70%]">
                  <Image
                    src={portrait.src}
                    alt={`${pkg.name} machine`}
                    fill
                    sizes="(min-width: 768px) 22vw, 70vw"
                    className={portrait.contain ? "object-contain p-6" : "object-cover"}
                  />
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <h3 className="text-[1.7rem] font-medium tracking-tight">{pkg.name}</h3>
                  {comet && <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2c2098]">{home.packages.mostPopular}</span>}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {pkg.rating.toFixed(2)} out of 5 · {fill(home.packages.ratingCount, { n: pkg.reviews })}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-[0.95rem] font-medium">
                  {[item.treatments.replace(" Inc", " included"), ...item.features].map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <Check className="mt-1 size-4 shrink-0" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={comet ? ROUTES.product : "#enquire"} className={`relative z-[4] mt-6 w-full ${comet ? "hd-btn" : "hd-btn-line"}`}>
                  {comet ? "Explore Comet 2™" : "Request details"}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <SectionHead eyebrow="What’s included" title={<>A franchise, <span className="hd-accent">without the costs</span></>} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="hd-tile hd-ink he-iris flex flex-col justify-between gap-10 p-6 sm:col-span-2 sm:p-8 lg:row-span-2">
            <GraduationCap className="size-7" aria-hidden />
            <div>
              <h3 className="hd-h2">Training included, free</h3>
              <p className="hd-lead mt-3 max-w-md">Remote training on the products, the legal requirements and marketing, with our team on hand afterwards.</p>
              <Link href={ROUTES.service} className="hd-btn relative z-[4] mt-6">
                How training works <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          {INCLUDED.map(({ icon: Icon, title, text }) => (
            <div key={title} className="hd-tile hd-pearl p-5 sm:p-6">
              <Icon className="size-5 text-brand" aria-hidden />
              <h3 className="hd-h3 mt-5">{title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-[7fr_5fr] lg:gap-14">
          <div className="he-capsule aspect-[2/1] max-sm:aspect-[3/2] max-sm:!rounded-[3rem]">
            <Image
              src="/images/teeth-guys.jpg"
              alt="Two men smiling as they look at a Hollywood Whitening product box"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[center_20%]"
            />
          </div>
          <figure className="px-1">
            <span className="he-numeral block" aria-hidden>
              “
            </span>
            <blockquote className="hd-h2 -mt-3">{lead.quote}</blockquote>
            <figcaption className="mt-5 font-semibold">
              {lead.name}, <span className="font-normal text-muted">{lead.location}</span>
            </figcaption>
          </figure>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {others.map((t) => (
            <figure key={t.name} className="hd-tile hd-pearl flex flex-col justify-between gap-6 p-6 sm:p-8">
              <blockquote className="text-[1.2rem] leading-snug font-medium tracking-tight">“{t.quote}”</blockquote>
              <figcaption className="text-sm font-semibold">
                {t.name}, <span className="font-normal text-muted">{t.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="hd-x pt-16 pb-3 sm:pt-24">
        <div className="hd-tile grid gap-6 p-6 sm:p-10 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div>
            <p className="hd-eyebrow">Questions</p>
            <h2 className="hd-h2 mt-2">Good to know</h2>
          </div>
          <div className="relative z-[4]">
            <Faqs items={FAQ_PICKS.map((i) => home.blogFaq.faqs[i])} />
          </div>
        </div>
      </section>

      <EnquirySection
        title={<>Let’s talk about <span className="hd-accent">your business</span></>}
        body="Share a few details and our team will come back to you with pricing and the package that suits you."
      />
    </>
  );
}
