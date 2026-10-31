import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DESIGN_ROUTES } from "@/components/design/Chrome";
import { Enquire, FaqList, SectionLabel, shadeAt } from "@/components/design/Parts";
import { Reveal } from "@/components/ui/Reveal";
import { getTrainingContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";

export const metadata: Metadata = { title: { absolute: "New service page design: Training | Hollywood Whitening™" } };

const training = getTrainingContent("en");

const SYLLABUS = [
  "How to determine teeth type and shades, and how the technology works",
  "What dentists and non-dentists cannot do in certain jurisdictions",
  "Health and safety of teeth whitening",
  "Consultation and medical information",
  "Treatment plan and techniques",
  "Who can be treated",
  "Hands-on practical",
  "The legality of a teeth whitening business",
  "Sales and marketing",
  "Pre-treatment communications",
  "Key points during and after treatment",
  "Contraindications",
  "Hollywood Whitening™ approved certification",
];

const FORMULA = [
  { machine: true, gel: true, training: true, result: "Greatest Hollywood Whitening results", shade: 1 },
  { machine: false, gel: true, training: true, result: "Good results", shade: 0.75 },
  { machine: true, gel: true, training: false, result: "OK results", shade: 0.5 },
  { machine: true, gel: false, training: false, result: "Very poor results", shade: 0.25 },
  { machine: false, gel: false, training: false, result: "Next to no results", shade: 0 },
];

const CLAIMS = [
  { value: "70%", text: "less preparation time than other systems, say experienced practitioners and dentists." },
  { value: "95%", text: "of the work is done for you by our system." },
  { value: "Hours", text: "not weeks. Better structure means training now takes just a few hours." },
];

const FAQ_QUESTIONS = [
  "Who can be trained for teeth whitening?",
  "How long is the training?",
  "Does online Teeth Whitening Training mean we get less of an experience?",
  "Do I need insurance?",
  "I have trained with another company but I am not happy, what can you offer me?",
  "How do I go ahead?",
];

export default function DesignServicePage() {
  return (
    <>
      <section className="hw-x pt-6 sm:pt-10">
        <p className="hw-label text-muted">Free with all business packages</p>
        <h1 className="hw-display hw-h1 rise mt-4 !text-[clamp(3.2rem,11.5vw,11.5rem)]">
          Trained in hours.
          <br />
          <em>Supported after.</em>
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[4fr_8fr] lg:gap-14">
          <div>
            <p className="max-w-md text-xl leading-snug sm:text-2xl">
              Remote teeth whitening training from the people who use the same machines and gels in their own clinics worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="hw-btn">
                Talk to our team <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#syllabus" className="hw-btn-ghost">
                See the syllabus
              </a>
            </div>
          </div>
          <div className="hw-lit">
            <Image
              src={training.images.technique}
              alt="Two men sitting and smiling together"
              width={1600}
              height={600}
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="hw-fade w-full"
            />
          </div>
        </div>
      </section>

      <section id="syllabus" className="hw-x scroll-mt-6 py-20 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="hw-display hw-h2">
                What you’ll <em>learn.</em>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                Theory and practical, from the first consultation to sales and marketing. Some items may not apply if you are not a dentist.
              </p>
            </Reveal>
          </div>
          <ol className="border-b border-line">
            {SYLLABUS.map((item, i) => (
              <li key={item} className="hw-rule grid grid-cols-[3rem_1fr] py-4 text-lg">
                <span className="hw-label pt-1.5 text-muted">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hw-dark py-20 sm:py-32">
        <div className="hw-x">
          <SectionLabel>{training.better}</SectionLabel>
          <h2 className="hw-display hw-h2 mt-4 max-w-5xl">
            Machine + gel + training. <em>Skimp on one, and it shows.</em>
          </h2>
          <div className="mt-12 overflow-x-auto" tabIndex={0} role="region" aria-label="How machine, gel and training affect results">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="hw-label text-white/70">
                  <th scope="col" className="pb-4 font-normal">Machine</th>
                  <th scope="col" className="pb-4 font-normal">Gel</th>
                  <th scope="col" className="pb-4 font-normal">Training</th>
                  <th scope="col" className="pb-4 font-normal">Result</th>
                </tr>
              </thead>
              <tbody>
                {FORMULA.map((row) => (
                  <tr key={row.result} className="hw-rule">
                    {[row.machine, row.gel, row.training].map((good, i) => (
                      <td key={i} className={`py-5 pr-4 ${good ? "" : "text-white/55"}`}>
                        {good ? "Quality" : "Poor"}
                      </td>
                    ))}
                    <td className="py-5">
                      <span className="flex items-center gap-4">
                        <span className="hw-tab !flex-none h-10 w-7" style={{ backgroundColor: shadeAt(row.shade) }} aria-hidden />
                        <span className="hw-display text-2xl sm:text-3xl">{row.result}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hw-x py-20 sm:py-32">
        <div className="grid gap-10 md:grid-cols-3">
          {CLAIMS.map((claim) => (
            <Reveal key={claim.value}>
              <div className="hw-rule pt-4">
                <p className="hw-display text-7xl sm:text-8xl">{claim.value}</p>
                <p className="mt-4 text-lg leading-relaxed text-muted">{claim.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hw-x">
        <div className="grid items-center gap-10 border border-line bg-white p-6 sm:p-10 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:p-14">
          <div>
            <SectionLabel>Certification</SectionLabel>
            <h2 className="hw-display hw-h2 mt-4">
              A certificate anyone <em>can check.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Once qualified, the number on your certificate can be verified online, so customers and insurers can check it’s authentic.
            </p>
            <Link href={pageHref("en", "qualification-check")} className="hw-btn-ghost mt-8">
              Verify a qualification <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="text-[0.95rem] leading-relaxed text-muted">
            <p className="hw-label text-ink">Please note</p>
            <p className="mt-3">
              Methods and distribution vary depending on your country and professional status. You must not offer anything that may be considered dentistry if you are not a dentist. Non-dentists in the EU have guidelines and protocols to follow, which are explained during training.
            </p>
          </div>
        </div>
      </section>

      <section className="hw-x py-20 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <h2 className="hw-display hw-h2">
              Training, <em>answered.</em>
            </h2>
            <Link href={DESIGN_ROUTES.product} className="mt-8 inline-flex items-center gap-2 font-semibold underline underline-offset-4">
              Training comes with Comet 2™ <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <FaqList items={FAQ_QUESTIONS.map((q) => training.faq.items.find((item) => item.q === q)!)} />
        </div>
      </section>

      <Enquire
        title={
          <>
            “Start before
            <br />
            <em>you’re ready.”</em>
          </>
        }
        body={`${training.start.author} said it best. Tell us where you’re starting from, and we’ll tell you what’s next.`}
      />
    </>
  );
}
