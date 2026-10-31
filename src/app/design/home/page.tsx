import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DESIGN_ROUTES } from "@/components/design/Chrome";
import { LoopVideo } from "@/components/design/LoopVideo";
import { Enquire, FaqList, SectionLabel, ShadeGuide } from "@/components/design/Parts";
import { Reveal } from "@/components/ui/Reveal";
import { fill, getHomeContent } from "@/lib/content";
import { HERO_MEDIA, PACKAGES } from "@/lib/site";

export const metadata: Metadata = { title: { absolute: "New homepage design | Hollywood Whitening™" } };

const home = getHomeContent("en");

const NUMBERS = [
  { value: "20+", label: "Years empowering smiles" },
  { value: "3", label: "Continents with offices" },
  { value: "$2.5bn", label: "Annual whitening industry" },
  { value: "4.9", label: "Average package rating" },
];

const INCLUDED = [
  { title: "The machine", text: "High-end whitening devices, beautifully designed to fit any professional setting." },
  { title: "The treatments", text: "Between 20 and 50 treatments included, so you can start earning before you reorder." },
  { title: "The training", text: "Free with every package. Remote, covering the products, the legal requirements and marketing." },
  { title: "The brand", text: "A name your customers want and your competitors envy, without the cost of a franchise." },
  { title: "The referrals", text: "Customers can find you through our location finder, subject to our listing terms." },
];

const STEPS = [
  { title: "Choose your package", text: "Compare the three systems, or call us and we’ll help you pick." },
  { title: "Receive your kit", text: "Your machine and materials ship directly to your door." },
  { title: "Train and certify", text: "Book your remote training. It takes a few hours, and you can verify your certificate online." },
  { title: "Start whitening", text: "Open your doors or go mobile, with our team on hand for support." },
];

const FAQ_PICKS = [3, 1, 2, 5];

export default function DesignHomePage() {
  const [lead, ...quotes] = [home.testimonials.items[2], ...home.testimonials.items.filter((_, i) => i !== 2)];

  return (
    <>
      <section className="hw-x pt-6 sm:pt-10">
        <h1 className="hw-display hw-h1 rise">
          Yellow’s out.
          <br />
          <em className="sm:pl-[0.9em]">White’s in.</em>
        </h1>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div className="flex flex-col gap-8">
            <div>
              <SectionLabel>Teeth whitening business packages</SectionLabel>
              <p className="mt-4 max-w-md text-xl leading-snug sm:text-2xl">{home.packages.intro}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#packages" className="hw-btn">
                Explore packages <ArrowRight className="size-4" aria-hidden />
              </a>
              <Link href={DESIGN_ROUTES.service} className="hw-btn-ghost">
                How training works
              </Link>
            </div>
          </div>
          <LoopVideo src={HERO_MEDIA.video} poster={HERO_MEDIA.poster} />
        </div>

        <ShadeGuide className="mt-10 h-16 sm:mt-14 sm:h-28" />
      </section>

      <section aria-label={home.stats.label} className="hw-x mt-14 sm:mt-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label} className="hw-rule pt-4">
              <dd className="hw-display text-6xl sm:text-7xl xl:text-8xl">{n.value}</dd>
              <dt className="mt-3 text-sm text-muted">{n.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="hw-x py-20 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <Reveal>
            <h2 className="hw-display hw-h2">
              One package.
              <br />
              <em>A whole business.</em>
            </h2>
          </Reveal>
          <ol className="border-b border-line">
            {INCLUDED.map((item, i) => (
              <li key={item.title} className="hw-rule grid gap-2 py-6 sm:grid-cols-[3rem_13rem_1fr] sm:gap-4">
                <span className="hw-label pt-1.5 text-muted">0{i + 1}</span>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#cdcfd0]">
        <Image
          src="/images/training/Hollywood-Banner-5.jpg"
          alt="A smiling woman holding a Hollywood Whitening shade guide"
          width={1600}
          height={600}
          sizes="100vw"
          className="w-full"
        />
        <figure className="hw-x py-10 xl:absolute xl:inset-0 xl:flex xl:items-center xl:justify-end xl:py-0">
          <div className="xl:w-[46%]">
            <blockquote className="hw-display text-4xl leading-[1.04] sm:text-5xl xl:text-6xl">
              A brand that your customers want, your competitors envy and your business will love.
            </blockquote>
            <figcaption className="hw-label mt-6">{home.trend.attribution}</figcaption>
          </div>
        </figure>
      </section>

      <section id="packages" className="hw-x scroll-mt-6 py-20 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="hw-display hw-h2">
            Three systems.
            <br />
            <em>Pick your scale.</em>
          </h2>
          <p className="hw-label text-muted">All packages: call for price</p>
        </div>

        <div className="mt-12 border-b border-line">
          {PACKAGES.map((pkg) => {
            const item = home.packages.items[pkg.slug];
            const comet = pkg.slug === "comet-2";
            return (
              <Reveal key={pkg.slug}>
                <article className="hw-rule grid items-center gap-6 py-8 lg:grid-cols-[3fr_4fr_3fr_auto] lg:gap-10">
                  <div className="hw-lit">
                    <Image src={pkg.image} alt="" width={1024} height={597} sizes="(min-width: 1024px) 25vw, 100vw" className="hw-fade w-full" />
                  </div>
                  <div>
                    <p className="hw-label text-muted">
                      {item.tier} · {comet ? "Best seller" : item.badge}
                    </p>
                    <h3 className="hw-display mt-2 text-5xl sm:text-6xl">{pkg.name}</h3>
                    <p className="mt-3 text-sm text-muted">
                      {pkg.rating.toFixed(2)} / 5 · {fill(home.packages.ratingCount, { n: pkg.reviews })} ·{" "}
                      {fill(home.packages.results, { n: pkg.results })}
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-[0.95rem]">
                    <li className="font-semibold">{item.treatments}</li>
                    {item.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="lg:text-right">
                    <a href={comet ? DESIGN_ROUTES.product : "#enquire"} className={comet ? "hw-btn" : "hw-btn-ghost"}>
                      {comet ? "View Comet 2™" : "Enquire"} <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="hw-dark py-20 sm:py-32">
        <div className="hw-x">
          <SectionLabel>{home.testimonials.title}</SectionLabel>
          <figure className="mt-8">
            <blockquote className="hw-display text-[2.6rem] leading-[1.02] sm:text-7xl xl:text-8xl">“{lead.quote}”</blockquote>
            <figcaption className="mt-6 text-sm text-white/70">
              {lead.name}, {lead.location}
            </figcaption>
          </figure>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {quotes.map((t) => (
              <figure key={t.name} className="hw-rule pt-5">
                <blockquote className="text-lg leading-snug">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-white/70">
                  {t.name}, {t.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="hw-x py-20 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="hw-display hw-h2">
            Simple as <em>1, 2, 3, 4.</em>
          </h2>
          <Link href={DESIGN_ROUTES.service} className="hw-btn-ghost">
            See the training <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="hw-rule pt-4">
              <span className="hw-display text-6xl">{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#a3cbd3]">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden">
          <Image
            src="/images/banana-white.jpg"
            alt="A white banana"
            width={1650}
            height={965}
            sizes="100vw"
            className="ml-auto w-full lg:absolute lg:top-1/2 lg:right-0 lg:w-[72%] lg:-translate-y-1/2"
          />
          <div className="hw-x relative pb-14 lg:py-40">
            <h2 className="hw-display hw-h2 max-w-3xl">
              {home.trend.title.replace(" Teeth Whitening", "")}
              <br />
              <em>in teeth whitening.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed">
              An industry worth an estimated $2.5 billion a year, and a brand clients will happily pay a little extra for.
            </p>
          </div>
        </div>
      </section>

      <section className="hw-x pt-20 sm:pt-32">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <h2 className="hw-display hw-h2">
            Clear <em>answers.</em>
          </h2>
          <FaqList items={FAQ_PICKS.map((i) => home.blogFaq.faqs[i])} />
        </div>
      </section>

      <Enquire
        title={
          <>
            Start before
            <br />
            <em>you’re ready.</em>
          </>
        }
        body="Tell us a little about your plans and our team will talk you through the packages, pricing and next steps."
      />
    </>
  );
}
