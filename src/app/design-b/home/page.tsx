import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AudienceTabs, type Audience } from "@/components/design-b/AudienceTabs";
import { ROUTES } from "@/components/design-b/Chrome";
import { EnquirySection, Faqs, SectionIntro } from "@/components/design-b/Parts";
import { fill, getHomeContent } from "@/lib/content";
import { PACKAGES } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "Concept B homepage | Hollywood Whitening™" } };

const home = getHomeContent("en");

const TRUST = [
  { value: "20+ years", label: "in cosmetic teeth whitening" },
  { value: "3 continents", label: "with Hollywood Whitening offices" },
  { value: "4.9 out of 5", label: "average package rating" },
  { value: "Training included", label: "free with every package" },
];

const AUDIENCES: Audience[] = [
  {
    label: "Salons & beauty clinics",
    title: "A signature treatment for your menu",
    text: "Offer a recognised whitening brand alongside your existing services, with equipment that looks at home in a professional setting.",
    points: ["Designed to make a statement in any salon", "Colour touchscreen and three wavelengths", "Your team trained remotely, in a few hours"],
    image: "/images/science/teeth-whitening-machine.jpg",
    alt: "A smiling man seated beside a Comet 2 machine",
    cta: { href: ROUTES.product, label: "Comet 2™ is a natural fit" },
  },
  {
    label: "Dental practices",
    title: "A trusted system for your practice",
    text: "We sell our systems to salons and dentists worldwide, and use the same machines and gels in our own clinics.",
    points: ["Comet 2™ suits fixed rooms and shared premises", "Galaxy™ is built for fixed locations", "Training adapted to your professional status"],
    image: "/images/products/comet-2/2.jpg",
    alt: "The Comet 2 light head",
    cta: { href: "#packages", label: "Compare the packages" },
  },
  {
    label: "Mobile technicians",
    title: "A business that travels with you",
    text: "Lightweight, robust systems for home visits and rented rooms, with materials included to get you started.",
    points: ["Comet 2™ fits easily in a small car", "Star One™ offers great mobility", "No maintenance on either system"],
    image: "/images/science/operating-teeth-whitening-macihne.jpg",
    alt: "A man operating the Comet 2 touchscreen",
    tint: true,
    cta: { href: "#packages", label: "Compare the packages" },
  },
  {
    label: "New to the industry",
    title: "Everything in place from the start",
    text: "You don’t need to be a dentist to own a teeth whitening business. You do need the right equipment, training and guidance, and every package includes them.",
    points: ["Legal requirements covered in your training", "Marketing guidance included", "Our team on hand after you qualify"],
    image: "/images/science/teeth-led.jpg",
    alt: "A smiling man using a Hollywood Whitening LED device",
    cta: { href: ROUTES.service, label: "How training and support work" },
  },
];

const INCLUDED = [
  { title: "Professional equipment", text: "A high-end whitening system, designed to suit any professional setting." },
  { title: "Treatments to get started", text: "Between 20 and 50 treatments, depending on your package." },
  { title: "Training and certification", text: "Remote training with a certificate your clients can verify online." },
  { title: "A brand clients ask for", text: "Hollywood branding, plus a listing option on our location finder, subject to our terms." },
];

const FAQ_PICKS = [3, 1, 2, 5];

export default function ConceptHomePage() {
  const quotes = [home.testimonials.items[2], home.testimonials.items[1], home.testimonials.items[0]];

  return (
    <>
      <section className="grid items-center gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:py-16">
        <div className="pr-[var(--hb-gutter)] pl-[max(var(--hb-gutter),calc((100vw-var(--hb-max))/2+var(--hb-gutter)))]">
          <p className="hb-eyebrow">For salons, clinics and technicians</p>
          <h1 className="hb-h1 mt-4">Professional teeth whitening, made for your business</h1>
          <p className="hb-lead mt-6 max-w-lg">
            Complete systems, training and brand support, trusted worldwide by professionals for more than 20 years.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#packages" className="hb-btn">
              View packages
            </a>
            <a href="#enquire" className="hb-btn-line">
              Speak to our team
            </a>
          </div>
        </div>
        <div className="overflow-hidden lg:rounded-l-[1.5rem]">
          <Image
            src="/images/bg-white.jpg"
            alt="A smiling woman with her hand on the touchscreen of a Hollywood Whitening machine"
            width={2560}
            height={1440}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      </section>

      <section aria-label="Hollywood Whitening at a glance" className="border-y border-line">
        <dl className="hb-x grid grid-cols-2 gap-x-6 gap-y-6 py-8 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.value}>
              <dd className="hb-h3">{item.value}</dd>
              <dt className="mt-1 text-sm text-muted">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="hb-section">
        <div className="hb-x">
          <SectionIntro eyebrow="Find your fit" title="Which setup suits your business?" />
          <AudienceTabs items={AUDIENCES} />
        </div>
      </section>

      <section id="packages" className="hb-porcelain hb-section scroll-mt-6">
        <div className="hb-x">
          <SectionIntro eyebrow="Business packages" title="Three complete packages">
            {home.packages.intro}
          </SectionIntro>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PACKAGES.map((pkg) => {
              const item = home.packages.items[pkg.slug];
              const comet = pkg.slug === "comet-2";
              return (
                <article key={pkg.slug} className={`hb-card flex flex-col overflow-hidden ${comet ? "!border-ink" : ""}`}>
                  <Image src={pkg.image} alt="" width={1024} height={597} sizes="(min-width: 768px) 26rem, 100vw" className="w-full" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="hb-h3">{pkg.name}</h3>
                      {comet && <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-medium text-brand">{home.packages.mostPopular}</span>}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {pkg.rating.toFixed(2)} out of 5 · {fill(home.packages.ratingCount, { n: pkg.reviews })}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2 text-[0.95rem]">
                      {[item.treatments.replace(" Inc", " included"), ...item.features].map((feature) => (
                        <li key={feature} className="flex gap-2.5">
                          <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a href={comet ? ROUTES.product : "#enquire"} className={`mt-6 w-full ${comet ? "hb-btn" : "hb-btn-line"}`}>
                      {comet ? "View Comet 2™" : "Request details"}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-muted">Pricing is provided on enquiry.</p>
        </div>
      </section>

      <section className="hb-section">
        <div className="hb-x grid items-center gap-10 md:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <SectionIntro eyebrow="What’s included" title="More than a machine" />
            <ul className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li key={item.title} className="border-t border-line pt-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="hb-arch order-first mx-auto w-full max-w-md md:order-none">
            <Image
              src="/images/products/comet-2/6.jpg"
              alt="The Comet 2 colour touchscreen and stylus"
              fill
              sizes="(min-width: 768px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="hb-porcelain hb-section">
        <div className="hb-x">
          <SectionIntro eyebrow="From our providers" title="In their words" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {quotes.map((t) => (
              <figure key={t.name} className="hb-card flex flex-col justify-between gap-6 p-7">
                <blockquote className="hb-h3 !font-light">“{t.quote}”</blockquote>
                <figcaption className="text-sm text-muted">
                  <span className="font-medium text-ink">{t.name}</span> · {t.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="hb-section">
        <div className="hb-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="hb-photo">
            <Image
              src="/images/teeth-guys.jpg"
              alt="Two men smiling as they look at a Hollywood Whitening product box"
              width={2560}
              height={1707}
              sizes="(min-width: 1024px) 38rem, 100vw"
              className="w-full"
            />
          </div>
          <div>
            <SectionIntro eyebrow="Training & support" title="Your team, confident from day one">
              Professional trainers guide you remotely through the products, the legal requirements and marketing, and we stay on hand once you’re up and running.
            </SectionIntro>
            <Link href={ROUTES.service} className="hb-link mt-6">
              See how training works <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="hb-section !pt-0">
        <div className="hb-x grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <SectionIntro eyebrow="Questions" title="Good to know" />
          <Faqs items={FAQ_PICKS.map((i) => home.blogFaq.faqs[i])} />
        </div>
      </section>

      <EnquirySection
        title="Tell us about your business"
        body="Share a few details and our team will come back to you with pricing and the package that suits you best."
      />
    </>
  );
}
