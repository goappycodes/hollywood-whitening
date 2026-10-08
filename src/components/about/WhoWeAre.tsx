import { Award, Building2, Globe, Star } from "lucide-react";
import type { AboutContent, HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { BUSINESSES_VALUE, PACKAGES, STAT_VALUES } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const avgRating = (PACKAGES.reduce((n, p) => n + p.rating, 0) / PACKAGES.length).toFixed(1);
const stat = (icon: (typeof STAT_VALUES)[number]["icon"]) => STAT_VALUES.findIndex((s) => s.icon === icon);

type Props = { content: AboutContent["who"]; stats: HomeContent["stats"]; locale: Locale };

/** The live page's "Who We Are" copy, with its claims pulled out into a fact grid. */
export function WhoWeAre({ content, stats, locale }: Props) {
  const years = stat("award");
  const continents = stat("globe");
  const rating = stat("star");

  return (
    <section className="bg-pearl py-16 sm:py-24 lg:py-32">
      <div className="container-x grid gap-10 sm:gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading align="left" eyebrow={content.eyebrow} title={content.title} />
          <Reveal delay={0.08}>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{content.body}</p>
            <Button href={pageHref(locale, "contact")} className="mt-8 w-full sm:w-auto">
              {content.cta}
            </Button>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* years — the dark anchor tile */}
          <Reveal as="li" className="col-span-2 sm:col-span-1 sm:row-span-2">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-navy p-6 text-white sm:p-7">
              <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-brand/40 blur-3xl" />
              <span className="relative grid size-11 place-items-center rounded-xl bg-white/10 text-cyan">
                <Award className="size-5" aria-hidden />
              </span>
              <div className="relative mt-10 sm:mt-16">
                <p className="font-display text-6xl font-bold tracking-tight sm:text-7xl">
                  <span className="text-cyan-gradient">{STAT_VALUES[years].value}</span>
                </p>
                <p className="mt-2 text-sm font-medium text-white/70">{stats.items[years]}</p>
              </div>
            </div>
          </Reveal>

          <Reveal as="li" delay={0.06}>
            <Fact
              icon={<Building2 className="size-5" aria-hidden />}
              value={BUSINESSES_VALUE}
              label={content.businesses}
              tone="bg-brand-sky/70"
            />
          </Reveal>
          <Reveal as="li" delay={0.12}>
            <Fact
              icon={<Star className="size-5 fill-star text-star" aria-hidden />}
              value={`${avgRating}/5`}
              label={stats.items[rating]}
              tone="border border-line bg-white"
            />
          </Reveal>

          {/* continents, with the three regions named */}
          <Reveal as="li" delay={0.18} className="col-span-2">
            <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
                  <Globe className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-ink">{STAT_VALUES[continents].value}</p>
                  <p className="text-sm text-muted">{stats.items[continents]}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.regions.map((r) => (
                  <span key={r} className="rounded-full border border-brand/20 bg-brand-sky/50 px-3 py-1 text-xs font-semibold text-brand-deep">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

function Fact({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: string }) {
  return (
    <div className={`flex h-full flex-col justify-between gap-6 rounded-[var(--radius-card)] p-5 sm:p-6 ${tone}`}>
      <span className="grid size-10 place-items-center rounded-xl bg-white text-brand shadow-soft">{icon}</span>
      <div>
        <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{value}</p>
        <p className="mt-1 text-xs leading-snug break-words hyphens-auto text-muted sm:text-sm">{label}</p>
      </div>
    </div>
  );
}
