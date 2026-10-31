import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, GraduationCap, MapPin, PackageCheck, ShieldCheck, Sparkles, Star } from "lucide-react";
import { BgVideo } from "@/components/design/BgVideo";
import { ROUTES } from "@/components/design-d/Chrome";
import { PackageFinder, type FinderResult } from "@/components/design-d/PackageFinder";
import { EnquirySection, Faqs, SectionHead } from "@/components/design-d/Parts";
import { COMPARE } from "@/components/design/data";
import { getHomeContent } from "@/lib/content";
import { PACKAGES } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept D homepage | Hollywood Whitening™" } };

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

const FAQ_PICKS = [3, 1, 2, 5];

const SMALL_TILES = [
  { value: "20+ years", label: "in cosmetic teeth whitening" },
  { value: "3 continents", label: "with Hollywood Whitening offices" },
  { value: "4.9 / 5", label: "average package rating" },
];

export default function ConceptHomePage() {
  const quotes = [home.testimonials.items[2], home.testimonials.items[1], home.testimonials.items[0]];

  return (
    <>
      <section className="hd-x pt-3">
        <div className="hd-tile hd-pearl relative flex flex-col pb-64 sm:pb-80 lg:min-h-[40rem] lg:justify-center lg:pb-0">
          {/* Phones: a band below the copy, because the 720p footage goes soft when zoomed to fill the tile. */}
          <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 lg:inset-0 lg:h-auto">
            <BgVideo buttonClassName="top-3 right-3 z-[5] lg:top-4 lg:right-4" />
          </div>
          <div className="hd-hero-wash absolute inset-0 hidden lg:block" />
          <div className="relative z-[4] max-w-2xl p-6 sm:p-10 lg:max-w-[44%] lg:p-14">
            <p className="hd-eyebrow">For salons, clinics and technicians</p>
            <h1 className="hd-h1 mt-3">
              The complete teeth whitening business, <span className="hd-accent">ready to open</span>
            </h1>
            <p className="hd-lead mt-5 max-w-xl">{home.packages.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#finder" className="hd-btn">
                Find your package <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#enquire" className="hd-btn-line">
                Request pricing
              </a>
            </div>
          </div>
          <Link href={ROUTES.product} className="hd-float absolute right-3 bottom-3 left-3 z-[4] flex items-center justify-between gap-4 p-4 sm:right-4 sm:bottom-4 sm:left-auto sm:min-w-72">
            <span>
              <span className="block text-xs font-semibold text-brand">Best seller</span>
              <span className="block font-semibold">Comet 2™ Complete Package</span>
            </span>
            <ArrowUpRight className="size-5 shrink-0" aria-hidden />
          </Link>
        </div>
        <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SMALL_TILES.map((tile) => (
            <div key={tile.value} className="hd-tile p-5 sm:p-6">
              <dd className="text-[1.35rem] font-semibold tracking-tight">{tile.value}</dd>
              <dt className="mt-1 text-sm text-muted">{tile.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section id="finder" className="hd-x scroll-mt-24 pt-16 sm:pt-24">
        <SectionHead eyebrow="Package finder" title={<>Start with <span className="hd-accent">how you work</span></>} />
        <PackageFinder results={FINDER} />
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <SectionHead eyebrow="What’s included" title={<>A franchise, <span className="hd-accent">without the costs</span></>}>
          A complete package is everything you need to begin offering treatments, under a name your clients already want.
        </SectionHead>
        <div className="mt-5 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="hd-tile relative min-h-72 bg-white sm:row-span-2">
            <Image src="/images/products/comet-2/6.jpg" alt="The Comet 2 colour touchscreen and stylus" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            <p className="hd-float absolute right-3 bottom-3 left-3 p-4 text-sm leading-snug">
              <span className="block font-semibold">Professional equipment</span>
              Designed to suit any professional setting.
            </p>
          </div>
          {[
            { icon: PackageCheck, title: "Treatments to start", text: "20 to 50 treatments included, depending on your package." },
            { icon: GraduationCap, title: "Training included", text: "Remote, covering the products, the law and marketing." },
            { icon: Sparkles, title: "#1 Hollywood branding", text: "A brand your customers want and your competitors envy." },
            { icon: MapPin, title: "Location finder", text: "Customers can find you on our website, subject to listing terms." },
            { icon: ShieldCheck, title: "Verified certificate", text: "Customers and insurers can check your qualification online." },
            { icon: Star, title: "Ongoing support", text: "Our team is on hand for treatment and customer queries." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="hd-tile hd-pearl p-5 sm:p-6">
              <Icon className="size-5 text-brand" aria-hidden />
              <h3 className="hd-h3 mt-5">{title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <SectionHead eyebrow="Compare" title={<>The range, <span className="hd-accent">side by side</span></>} />
        <div className="hd-tile mt-5 overflow-x-auto" tabIndex={0} role="region" aria-label="Package comparison">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr>
                <td className="w-[22%]" />
                {PACKAGES.map((p) => (
                  <th key={p.slug} scope="col" className={`p-4 align-bottom font-semibold ${p.slug === "comet-2" ? "bg-brand-sky/50" : ""}`}>
                    <Image src={p.image} alt="" width={1024} height={597} sizes="22rem" className="w-full rounded-xl" />
                    <span className="mt-3 block text-lg">{p.name}</span>
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
                    <td key={i} className={`px-4 py-3.5 font-medium ${i === 1 ? "bg-brand-sky/50" : ""}`}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <div className="grid gap-3 lg:grid-cols-[7fr_5fr]">
          <div className="hd-tile bg-white">
            <Image
              src="/images/teeth-guys.jpg"
              alt="Two men smiling as they look at a Hollywood Whitening product box"
              width={2560}
              height={1707}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="aspect-[3/2] size-full object-cover"
            />
          </div>
          <div className="hd-tile hd-ink flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="hd-eyebrow">Training & support</p>
            <h2 className="hd-h2 mt-2">
              Your team, <span className="hd-accent">confident from day one</span>
            </h2>
            <p className="hd-lead mt-4">
              Professional trainers guide you remotely through the products, the legal requirements and marketing. It takes a few hours, and we stay on hand afterwards.
            </p>
            <Link href={ROUTES.service} className="hd-btn relative z-[4] mt-8 self-start">
              How training works <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <SectionHead eyebrow="From our providers" title={<>Real businesses, <span className="hd-accent">real words</span></>} />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {quotes.map((t) => (
            <figure key={t.name} className="hd-tile hd-pearl flex flex-col justify-between gap-8 p-6 sm:p-8">
              <blockquote className="text-[1.15rem] leading-snug font-medium tracking-tight">“{t.quote}”</blockquote>
              <figcaption className="text-sm">
                <span className="block font-semibold">{t.name}</span>
                <span className="text-muted">{t.location}</span>
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
