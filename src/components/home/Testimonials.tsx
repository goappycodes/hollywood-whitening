import { MapPin, Quote, Star } from "lucide-react";
import type { HomeContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const AVATAR_TONES = ["bg-brand", "bg-cyan-600", "bg-indigo-600", "bg-emerald-600"];

export function Testimonials({ content }: { content: HomeContent["testimonials"] }) {
  return (
    <section className="bg-pearl py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          intro={content.intro}
        />

        {/* Phones: swipeable row. sm+: grid. */}
        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {content.items.map((t, i) => (
            <li key={t.name} className="w-[82%] shrink-0 snap-center sm:w-auto">
              <Reveal delay={i * 0.08} className="h-full">
                <figure className="flex h-full flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-soft ring-1 ring-line transition-shadow duration-500 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <div className="flex" aria-hidden>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-4 fill-star text-star" aria-hidden />
                      ))}
                    </div>
                    <Quote className="size-7 text-brand/15" aria-hidden />
                  </div>
                  <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-graphite">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span
                      className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                    >
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{t.name}</span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MapPin className="size-3" aria-hidden />
                        {t.location}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
