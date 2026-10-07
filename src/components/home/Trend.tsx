import Image from "next/image";
import type { HomeContent } from "@/lib/content";
import { TREND_IMAGE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function Trend({ content }: { content: HomeContent["trend"] }) {
  return (
    <section className="pb-16 sm:pb-24 lg:pb-32">
      <div className="container-x">
        <Reveal>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-sky via-[#e8f9ff] to-[#eef3f8] p-6 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:p-16">
            <div>
              <p className="font-script text-[1.65rem] leading-tight text-brand sm:text-4xl">{content.kicker}</p>
              <h2 className="mt-3 text-[1.75rem] leading-[1.12] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {content.title}
              </h2>
              <figure className="mt-6 max-w-xl">
                <blockquote className="text-base leading-relaxed text-graphite italic sm:text-lg">“{content.quote}”</blockquote>
                <figcaption className="mt-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
                  — {content.attribution}
                </figcaption>
              </figure>
            </div>

            <div className="relative mx-auto size-56 sm:size-72">
              <div className="absolute inset-0 overflow-hidden rounded-full bg-[#a3cbd3] shadow-lift ring-8 ring-white">
                <Image
                  src={TREND_IMAGE}
                  alt={content.imageAlt}
                  fill
                  sizes="288px"
                  className="scale-150 object-cover object-[78%_55%]"
                />
              </div>
              <div className="absolute -bottom-2 -left-4 rounded-2xl bg-white px-5 py-3 text-center shadow-lift">
                <p className="text-3xl font-bold text-ink">#1</p>
                <p className="text-[10px] font-bold tracking-[0.18em] text-muted uppercase">{content.badge}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
