import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SYLLABUS, TRAINING_FAQS, TRAINING_NOTE } from "@/components/design/data";
import { Arc } from "@/components/design-c/Arc";
import { ROUTES } from "@/components/design-c/Chrome";
import { LitText } from "@/components/design-c/LitText";
import { EnquirySection, Faqs } from "@/components/design-c/Parts";
import { ResultsDial } from "@/components/design-c/ResultsDial";
import { getTrainingContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";

export const metadata: Metadata = { title: { absolute: "Concept C service page: Training | Hollywood Whitening™" } };

const training = getTrainingContent("en");

const PATH = [
  { title: "Choose", text: "Pick your package, or ask our team what suits your business." },
  { title: "Receive", text: "Your machine and materials ship directly to you." },
  { title: "Train", text: "Contact us when your items arrive to book your remote session." },
  { title: "Open", text: "Start treating, with our team available for advice and support." },
];

export default function ConceptServicePage() {
  return (
    <>
      <section className="hc-off overflow-hidden pt-28 sm:pt-36">
        <div className="hc-x">
          <p className="hc-tag">Training & support · Free with every package</p>
          <h1 className="hc-display hc-giant mt-5">
            Hours,
            <br />
            not weeks.
          </h1>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-8 pb-12">
            <p className="hc-lead max-w-2xl text-muted">
              Learn from the people who use the same machines and gels in their own clinics worldwide, with our team on hand long after you qualify.
            </p>
            <a href="#syllabus" className="hc-btn">
              See the syllabus <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>
        </div>
        <Arc className="-mb-2 w-full" stroke={3} />
      </section>

      <section className="hc-on">
        <Image
          src="/images/teeth-guys.jpg"
          alt="Two men smiling as they look at a Hollywood Whitening product box"
          width={2560}
          height={1707}
          priority
          sizes="100vw"
          className="aspect-[4/3] w-full object-cover object-top lg:aspect-[21/10]"
        />
      </section>

      <section id="syllabus" className="hc-on hc-section scroll-mt-0">
        <div className="hc-x grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <div>
            <h2 className="hc-display hc-h2 lg:sticky lg:top-24">Thirteen things you’ll know.</h2>
          </div>
          <div>
            <ol className="border-b border-line">
              {SYLLABUS.map((item, i) => (
                <li key={item} className="hc-rule grid grid-cols-[3rem_1fr] items-baseline py-4 sm:grid-cols-[5rem_1fr] sm:py-5">
                  <span className="hc-tag">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xl tracking-tight sm:text-2xl">{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-muted">Theory and practical. Some items may not apply if you are not a dentist.</p>
          </div>
        </div>
      </section>

      <section className="hc-off hc-section overflow-hidden">
        <div className="hc-x">
          <p className="hc-tag mb-14 text-center">Machine + gel + training. See what each one does to the result.</p>
          <ResultsDial />
        </div>
      </section>

      <section className="hc-on hc-section">
        <div className="hc-x">
          <h2 className="hc-display hc-h2">From order to open.</h2>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PATH.map((step, i) => (
              <li key={step.title}>
                <div className="hc-spectrum-line" style={{ opacity: 0.4 + i * 0.2 }} />
                <p className="hc-tag mt-4">{i + 1}</p>
                <h3 className="hc-display hc-h3 mt-6">{step.title}</h3>
                <p className="mt-3 text-lg leading-snug text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hc-off hc-section">
        <div className="hc-x">
          <LitText
            className="hc-display hc-h2 max-w-[92rem]"
            text="Once qualified, your certificate number can be verified online. Your customers and your insurer can check it’s real."
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
            <div>
              <Link href={pageHref("en", "qualification-check")} className="hc-btn">
                Verify a qualification <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
            <p className="max-w-3xl leading-relaxed text-muted">
              <span className="font-medium text-white">Please note.</span> {TRAINING_NOTE}
            </p>
          </div>
        </div>
      </section>

      <section className="hc-on hc-section">
        <div className="hc-x grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <div>
            <h2 className="hc-display hc-h2">Training, answered.</h2>
            <Link href={ROUTES.product} className="hc-btn-line mt-8">
              Included with Comet 2™ <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <Faqs items={TRAINING_FAQS.map((q) => training.faq.items.find((item) => item.q === q)!)} />
        </div>
      </section>

      <EnquirySection
        title="Start before you’re ready."
        body={`${training.start.author} said it best. Tell us where you’re starting from, and we’ll tell you what’s next.`}
      />
    </>
  );
}
