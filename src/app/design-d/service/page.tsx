import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock, Globe, Minus, ShieldCheck } from "lucide-react";
import { FORMULA, TRAINING_FAQS, TRAINING_NOTE } from "@/components/design/data";
import { ROUTES } from "@/components/design-d/Chrome";
import { Curriculum, type Module } from "@/components/design-d/Curriculum";
import { EnquirySection, Faqs, SectionHead } from "@/components/design-d/Parts";
import { getTrainingContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";

export const metadata: Metadata = { title: { absolute: "Concept D service page: Training | Hollywood Whitening™" } };

const training = getTrainingContent("en");

const HIGHLIGHTS = [
  { icon: Globe, title: "Remote", text: "Delivered online by professional trainers." },
  { icon: Clock, title: "A few hours", text: "Better structure has cut days down to hours." },
  { icon: ShieldCheck, title: "Certified", text: "A certificate number anyone can verify." },
];

const PATH = [
  { title: "Choose a package", text: "Compare the systems, or ask our team what suits your business." },
  { title: "Receive your kit", text: "Your machine and materials ship directly to you." },
  { title: "Book your training", text: "Contact us when your items arrive to arrange your session." },
  { title: "Open for clients", text: "Start treating, with our team on hand for advice and support." },
];

const MODULES: Module[] = [
  {
    title: "Foundations",
    summary: "How whitening works, and who it’s right for.",
    items: ["Teeth types, shades and how the technology works", "Health and safety of teeth whitening", "Who can be treated", "Contraindications"],
  },
  {
    title: "Treatment",
    summary: "From the first conversation to aftercare.",
    items: ["Consultation and medical information", "Treatment plan and techniques", "Pre-treatment communications", "Key points during and after treatment", "Hands-on practical"],
  },
  {
    title: "Legal",
    summary: "What you can and can’t do where you operate.",
    items: ["The legality of a teeth whitening business", "What dentists and non-dentists cannot do in certain jurisdictions"],
  },
  {
    title: "Business",
    summary: "Bringing clients in, and proving your credentials.",
    items: ["Sales and marketing", "Hollywood Whitening™ approved certification"],
  },
];

function Mark({ good }: { good: boolean }) {
  return good ? (
    <span className="inline-flex items-center gap-2 font-medium">
      <Check className="size-4 text-brand" aria-hidden /> Quality
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-muted">
      <Minus className="size-4" aria-hidden /> Poor
    </span>
  );
}

export default function ConceptServicePage() {
  return (
    <>
      <section className="hd-x pt-3">
        <div className="grid gap-3 lg:grid-cols-[5fr_7fr]">
          <div className="hd-tile hd-pearl flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="hd-eyebrow">Training & support · Free with every package</p>
            <h1 className="hd-h1 mt-3">
              Training and support, <span className="hd-accent">built into every package</span>
            </h1>
            <p className="hd-lead mt-5">
              Learn from the people who use the same machines and gels in their own clinics worldwide.
            </p>
            <div className="relative z-[4] mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="hd-btn">
                Speak to our team <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#curriculum" className="hd-btn-line">
                View the syllabus
              </a>
            </div>
          </div>
          <div className="hd-tile relative bg-white">
            <Image
              src="/images/teeth-guys.jpg"
              alt="Two men smiling as they look at a Hollywood Whitening product box"
              width={2560}
              height={1707}
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="aspect-[3/2] size-full object-cover"
            />
          </div>
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="hd-tile flex items-start gap-4 p-5 sm:p-6">
              <Icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
              <div>
                <h2 className="hd-h3">{title}</h2>
                <p className="mt-1 text-[0.95rem] text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <SectionHead eyebrow="How it works" title={<>From order to <span className="hd-accent">first client</span></>} />
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PATH.map((step, i) => (
            <li key={step.title} className={`hd-tile p-6 ${i === PATH.length - 1 ? "hd-ink" : "hd-pearl"}`}>
              <span className="text-sm font-semibold text-muted">Step {i + 1}</span>
              <h3 className="hd-h3 mt-8">{step.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="curriculum" className="hd-x scroll-mt-24 pt-16 sm:pt-24">
        <SectionHead eyebrow="Syllabus" title={<>What your training <span className="hd-accent">covers</span></>}>
          Theory and practical. Some items may not apply if you are not a dentist.
        </SectionHead>
        <div className="mt-5 grid gap-3 lg:grid-cols-[8fr_4fr]">
          <div className="hd-tile p-6 sm:p-10">
            <div className="relative z-[4]">
              <Curriculum modules={MODULES} />
            </div>
          </div>
          <div className="hd-tile relative min-h-96 bg-white">
            <Image
              src="/images/science/teeth-whitening-machine.jpg"
              alt="A smiling man seated beside a Hollywood Whitening machine"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section className="hd-x pt-16 sm:pt-24">
        <div className="hd-tile grid gap-6 p-6 sm:p-10 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div>
            <p className="hd-eyebrow">Why it matters</p>
            <h2 className="hd-h2 mt-2">
              Great results <span className="hd-accent">take all three</span>
            </h2>
          </div>
          <div className="min-w-0 overflow-x-auto" tabIndex={0} role="region" aria-label="How machine, gel and training affect results">
            <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
              <thead>
                <tr className="text-sm text-muted">
                  <th scope="col" className="pb-2 font-medium">Machine</th>
                  <th scope="col" className="pb-2 font-medium">Gel</th>
                  <th scope="col" className="pb-2 font-medium">Training</th>
                  <th scope="col" className="pb-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {FORMULA.map((row, i) => (
                  <tr key={row.result} className="border-t border-line">
                    <td className="py-3 pr-3"><Mark good={row.machine} /></td>
                    <td className="py-3 pr-3"><Mark good={row.gel} /></td>
                    <td className="py-3 pr-3"><Mark good={row.training} /></td>
                    <td className={`py-3 ${i === 0 ? "font-bold" : "font-medium"}`}>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hd-x pt-3">
        <div className="grid gap-3 lg:grid-cols-[7fr_5fr]">
          <div className="hd-tile hd-ink p-6 sm:p-10">
            <p className="hd-eyebrow">Certification</p>
            <h2 className="hd-h2 mt-2">
              A qualification <span className="hd-accent">your clients can check</span>
            </h2>
            <p className="hd-lead mt-4 max-w-xl">Once qualified, your certificate number can be verified online by your customers and your insurance company.</p>
            <Link href={pageHref("en", "qualification-check")} className="hd-btn relative z-[4] mt-8">
              Verify a qualification <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="hd-tile p-6 sm:p-10">
            <h3 className="hd-h3">Please note</h3>
            <p className="mt-3 leading-relaxed text-muted">{TRAINING_NOTE}</p>
          </div>
        </div>
      </section>

      <section className="hd-x pt-3 pb-3">
        <div className="hd-tile grid gap-6 p-6 sm:p-10 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div>
            <p className="hd-eyebrow">Questions</p>
            <h2 className="hd-h2 mt-2">Training, answered</h2>
            <Link href={ROUTES.product} className="hd-link relative z-[4] mt-5">
              Training is included with Comet 2™ <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="relative z-[4]">
            <Faqs items={TRAINING_FAQS.map((q) => training.faq.items.find((item) => item.q === q)!)} />
          </div>
        </div>
      </section>

      <EnquirySection
        title={<>Ready to <span className="hd-accent">get started?</span></>}
        body="Tell us where you’re starting from, and our team will talk you through the right package and training."
      />
    </>
  );
}
