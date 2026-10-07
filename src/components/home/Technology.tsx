import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Zap } from "lucide-react";
import type { HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { TECHNOLOGY_MEDIA } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function Technology({ content, locale }: { content: HomeContent["technology"]; locale: Locale }) {
  const [line1, line2, line3] = content.title;
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-white lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 -left-40 size-[40rem] rounded-full bg-brand/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-cyan/10 blur-[120px]"
      />

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="pill border border-cyan/30 bg-cyan/10 text-cyan">{content.eyebrow}</p>
            <h2 className="mt-5 text-[2rem] leading-[1.08] font-bold tracking-tight sm:text-5xl xl:text-[3.5rem]">
              {line1}
              <br />
              {line2}
              <br />
              <span className="text-cyan-gradient">{line3}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 space-y-4 text-base leading-relaxed text-white/65 sm:text-lg">
            {content.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10">
            {content.highlights.map((h, i) => (
              <li key={h.title}>
                <Reveal delay={0.05 * i} className="h-full">
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors sm:p-5 hover:border-cyan/40 hover:bg-white/[0.07]">
                    <span className="text-xs font-bold text-cyan">0{i + 1}</span>
                    <h3 className="mt-2 text-sm leading-snug font-bold sm:text-base">{h.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/55 sm:text-sm">{h.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.15} className="mt-10">
            <Link
              href={pageHref(locale, "science")}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-brand-sky sm:inline-flex sm:w-auto"
            >
              {content.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Reveal>
        </div>

        {/* Image mosaic with floating detail chips */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-4">
            <Reveal className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-[#f0eeec] ring-1 ring-white/10">
              <Image
                src={TECHNOLOGY_MEDIA.image}
                alt={content.imageAlt}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal delay={0.1} className="glass-dark rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <GraduationCap className="size-4" aria-hidden /> {content.chipTraining.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{content.chipTraining.text}</p>
            </Reveal>
          </div>
          <div className="space-y-4 pt-10">
            <Reveal delay={0.1} className="glass-dark rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-cyan">
                <Zap className="size-4" aria-hidden /> {content.chipWavelengths.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{content.chipWavelengths.text}</p>
            </Reveal>
            {TECHNOLOGY_MEDIA.gallery.map((src, i) => (
              <Reveal
                key={src}
                delay={0.15 + i * 0.1}
                className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-navy-3 ring-1 ring-white/10"
              >
                <Image src={src} alt={content.galleryAlt} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
