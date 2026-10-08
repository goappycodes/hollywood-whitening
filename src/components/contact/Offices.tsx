import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import type { ContactContent } from "@/lib/content";
import { mapsUrl, OFFICES } from "@/lib/site";
import { Flag } from "@/components/site/Flag";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The live contact page's three offices: UK & EU, USA, Australia. */
export function Offices({ content }: { content: ContactContent["offices"] }) {
  return (
    <section className="bg-pearl py-16 sm:py-24 lg:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

        <ul className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-5">
          {OFFICES.map((office, i) => {
            const copy = content.items[i];
            return (
              <Reveal as="li" key={office.flag} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-shadow hover:shadow-lift sm:p-7">
                  <div className="flex items-center gap-3">
                    <Flag code={office.flag} className="h-5 w-7 rounded" />
                    <h3 className="text-lg font-bold text-ink">{copy.name}</h3>
                  </div>

                  <p className="mt-5 flex gap-2.5 text-[15px] leading-relaxed text-muted">
                    <MapPin className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                    {copy.address}
                  </p>
                  <a
                    href={mapsUrl(office.map)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 ml-6.5 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand hover:text-brand-deep"
                  >
                    {content.directions}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>

                  <span className="hidden flex-1 md:block md:min-h-6" aria-hidden />
                  <a
                    href={office.phone.href}
                    className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-sky/60 px-4 py-3.5 text-ink transition-colors hover:bg-brand hover:text-white md:mt-auto"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
                      <Phone className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.16em] uppercase opacity-60">
                        {content.tel}
                      </span>
                      <span className="block font-semibold whitespace-nowrap">{office.phone.display}</span>
                    </span>
                  </a>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
