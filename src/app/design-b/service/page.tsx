import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { FORMULA, TRAINING_FAQS, TRAINING_NOTE } from "@/components/design/data";
import { ROUTES } from "@/components/design-b/Chrome";
import { EnquirySection, Faqs, SectionIntro } from "@/components/design-b/Parts";
import { getTrainingContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";

export const metadata: Metadata = { title: { absolute: "Concept B service page: Training | Hollywood Whitening™" } };

const training = getTrainingContent("en");

const HIGHLIGHTS = [
  { title: "Remote", text: "Delivered online by professional trainers, wherever your business is based." },
  { title: "A few hours", text: "Better structure and technique have cut training from days to hours." },
  { title: "Certified", text: "Your certificate number can be verified online by customers and insurers." },
];

const PATH = [
  { title: "Choose a package", text: "Compare the systems, or ask our team what suits your business." },
  { title: "Receive your kit", text: "Your machine and materials ship directly to you." },
  { title: "Book your training", text: "Contact us once your items arrive to arrange your session." },
  { title: "Open for clients", text: "Start treating, with our team available for advice and support." },
];

const SYLLABUS_GROUPS = [
  {
    title: "Foundations",
    items: ["Teeth types, shades and how the technology works", "Health and safety of teeth whitening", "Who can be treated", "Contraindications"],
  },
  {
    title: "Treatment",
    items: ["Consultation and medical information", "Treatment plan and techniques", "Pre-treatment communications", "Key points during and after treatment", "Hands-on practical"],
  },
  {
    title: "Legal",
    items: ["The legality of a teeth whitening business", "What dentists and non-dentists cannot do in certain jurisdictions"],
  },
  {
    title: "Business",
    items: ["Sales and marketing", "Hollywood Whitening™ approved certification"],
  },
];

function Mark({ good }: { good: boolean }) {
  return good ? (
    <span className="inline-flex items-center gap-2">
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
      <section className="hb-x pt-12 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="hb-eyebrow">Training & support</p>
          <h1 className="hb-h1 mt-4">Training and support, included with every package</h1>
          <p className="hb-lead mt-6">
            Learn from the people who use the same machines and gels in their own clinics worldwide, then keep our team on call as your business grows.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#enquire" className="hb-btn">
              Speak to our team
            </a>
            <a href="#syllabus" className="hb-btn-line">
              View the syllabus
            </a>
          </div>
        </div>
        <div className="hb-photo mt-12">
          <Image
            src="/images/teeth-guys.jpg"
            alt="Two men smiling as they look at a Hollywood Whitening product box"
            width={2560}
            height={1707}
            priority
            sizes="(min-width: 1280px) 74rem, 100vw"
            className="aspect-[3/2] w-full object-cover object-top md:aspect-[2/1]"
          />
        </div>
      </section>

      <section className="hb-x py-12">
        <ul className="grid gap-8 md:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className="border-t border-line pt-4">
              <h2 className="hb-h3">{item.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="hb-porcelain hb-section">
        <div className="hb-x">
          <SectionIntro eyebrow="How it works" title="From order to first client" />
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PATH.map((step, i) => (
              <li key={step.title}>
                <span className="grid size-10 place-items-center rounded-full border border-ink bg-white text-sm font-medium">{i + 1}</span>
                <h3 className="hb-h3 mt-5">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="syllabus" className="hb-section scroll-mt-6">
        <div className="hb-x">
          <SectionIntro eyebrow="Syllabus" title="What your training covers">
            Theory and practical. Some items may not apply if you are not a dentist.
          </SectionIntro>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SYLLABUS_GROUPS.map((group) => (
              <div key={group.title} className="hb-card p-6">
                <h3 className="hb-h3">{group.title}</h3>
                <ul className="mt-4 space-y-3 text-[0.95rem] leading-snug text-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hb-section !pt-0">
        <div className="hb-x grid items-center gap-10 md:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="hb-arch hb-arch-tint mx-auto w-full max-w-sm">
            <Image
              src="/images/science/operating-teeth-whitening-macihne.jpg"
              alt="A man operating the Comet 2 touchscreen"
              fill
              sizes="(min-width: 768px) 24rem, 100vw"
              className="object-cover object-bottom"
            />
          </div>
          <div className="min-w-0">
            <SectionIntro eyebrow="Why it matters" title="Great results take all three" />
            <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-label="How machine, gel and training affect results">
              <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
                <thead>
                  <tr className="border-b border-line text-sm text-muted">
                    <th scope="col" className="py-2 font-normal">Machine</th>
                    <th scope="col" className="py-2 font-normal">Gel</th>
                    <th scope="col" className="py-2 font-normal">Training</th>
                    <th scope="col" className="py-2 font-normal">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {FORMULA.map((row, i) => (
                    <tr key={row.result} className="border-b border-line">
                      <td className="py-3 pr-3"><Mark good={row.machine} /></td>
                      <td className="py-3 pr-3"><Mark good={row.gel} /></td>
                      <td className="py-3 pr-3"><Mark good={row.training} /></td>
                      <td className={`py-3 ${i === 0 ? "font-semibold" : ""}`}>{row.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="hb-porcelain hb-section">
        <div className="hb-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionIntro eyebrow="Certification" title="A qualification your clients can check">
              Once qualified, your certificate number can be verified online, giving customers and insurers peace of mind.
            </SectionIntro>
            <Link href={pageHref("en", "qualification-check")} className="hb-link mt-6">
              Verify a qualification <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="hb-card self-start p-6 sm:p-8">
            <h3 className="font-semibold">Please note</h3>
            <p className="mt-2 leading-relaxed text-muted">{TRAINING_NOTE}</p>
          </div>
        </div>
      </section>

      <section className="hb-section">
        <div className="hb-x grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <SectionIntro eyebrow="Questions" title="Training, answered" />
            <Link href={ROUTES.product} className="hb-link mt-6">
              Training is included with Comet 2™ <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <Faqs items={TRAINING_FAQS.map((q) => training.faq.items.find((item) => item.q === q)!)} />
        </div>
      </section>

      <EnquirySection
        title="Ready to get started?"
        body="Tell us where you’re starting from, and our team will talk you through the right package and training."
      />
    </>
  );
}
