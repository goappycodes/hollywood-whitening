import { BadgeCheck, Globe, GraduationCap, Lightbulb, type LucideIcon } from "lucide-react";
import type { HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { PILLAR_ICONS } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ICONS: Record<(typeof PILLAR_ICONS)[number], { Icon: LucideIcon; tone: string }> = {
  training: { Icon: GraduationCap, tone: "bg-brand-sky text-brand" },
  machine: { Icon: Lightbulb, tone: "bg-cyan-50 text-cyan-600" },
  business: { Icon: BadgeCheck, tone: "bg-emerald-50 text-emerald-600" },
  globe: { Icon: Globe, tone: "bg-amber-50 text-amber-600" },
};

export function WhyChoose({ content, locale }: { content: HomeContent["why"]; locale: Locale }) {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading align="left" eyebrow={content.eyebrow} title={content.title} className="max-w-3xl" />
          <Reveal className="hidden shrink-0 lg:block">
            <Button href={pageHref(locale, "contact")}>{content.cta}</Button>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-6 grid gap-4 text-base leading-relaxed text-muted lg:grid-cols-2 lg:gap-12">
          {content.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>
        {/* On phones the CTA follows the copy rather than splitting heading and text */}
        <Reveal className="mt-8 lg:hidden">
          <Button href={pageHref(locale, "contact")} className="w-full">
            {content.cta}
          </Button>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {content.pillars.map((p, i) => {
            const { Icon, tone } = ICONS[PILLAR_ICONS[i]];
            return (
              <li key={p.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="group h-full rounded-[var(--radius-card)] border border-line bg-pearl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-brand/30 hover:bg-white hover:shadow-lift sm:p-7">
                    {/* Phones: icon beside the title, text full width below. sm+: icon stacked above. */}
                    <div className="flex items-center gap-3 sm:block">
                      <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-12 sm:rounded-2xl ${tone}`}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="font-bold text-ink sm:mt-6">{p.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-2">{p.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
