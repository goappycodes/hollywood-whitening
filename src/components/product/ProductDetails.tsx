import {
  Check,
  ChevronDown,
  Clock,
  PackageCheck,
  SlidersHorizontal,
  Truck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ContentBlock, ProductContent } from "@/lib/content";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";

type Section = ProductContent["sections"][number];
type P = Extract<ContentBlock, { type: "p" }>;
const paragraphs = (blocks: ContentBlock[]) => blocks.filter((b): b is P => b.type === "p");

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="eyebrow">
      <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
      {children}
    </p>
  );
}

/**
 * Splits the live Description into copy and the spec card. The spec part starts at the
 * first heading that follows the intro paragraphs — the machine's own heading, e.g.
 * "Star One™ – LED Teeth Whitening System" / "Comet 2™ – … with 3 Light Sources" /
 * "Galaxy Laser™" — and runs to the end (tables or lists, then sizes and dimensions).
 */
function splitSpecs(blocks: ContentBlock[]): [ContentBlock[], ContentBlock[]] {
  let seenParagraph = false;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "p") seenParagraph = true;
    else if (blocks[i].type === "h" && seenParagraph) return [blocks.slice(0, i), blocks.slice(i)];
  }
  return [blocks, []];
}

/**
 * Spec blocks → card title + accordion groups. The leading heading is the machine's own
 * ("Comet 2™ – Teeth Whitening Machine with 3 Light Sources"); each later heading
 * ("Product Feature", "Technical Parameters", "Sizes and Dimensions") opens a group.
 * Anything before the first group heading (Star One™'s / Galaxy™'s spec table) becomes a
 * group under the generic label.
 */
function groupSpecs(specs: ContentBlock[], fallbackLabel: string) {
  const [head, ...body] = specs;
  const title = head?.type === "h" ? head.text : null;
  const groups: { label: string; blocks: ContentBlock[] }[] = [];
  for (const b of title ? body : specs) {
    if (b.type === "h") groups.push({ label: b.text, blocks: [] });
    else {
      if (!groups.length) groups.push({ label: fallbackLabel, blocks: [] });
      groups.at(-1)!.blocks.push(b);
    }
  }
  return { title, groups: groups.filter((g) => g.blocks.length) };
}

/**
 * Live "Description" section: copy left, specification card right. The spec card is an
 * accordion (first group open; each group opens independently) so long feature lists — Comet 2™'s — don't
 * leave the copy column with a tall empty gap; on desktop the columns centre on each other.
 */
export function ProductDescription({ section, specsLabel }: { section: Section; specsLabel: string }) {
  const [all, specs] = splitSpecs(section.blocks);
  // The live panel opens with its own heading ("Product Description") — use it as the title.
  const [first, ...rest] = all;
  const title = first?.type === "h" ? first.text : null;
  const copy = title ? rest : all;
  const spec = groupSpecs(specs, specsLabel);

  return (
    <section className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <Reveal className="min-w-0">
          <Eyebrow>{section.heading}</Eyebrow>
          {title && (
            <h2 className="mt-4 text-[1.75rem] leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl">
              {title}
            </h2>
          )}
          <Prose blocks={copy} className="mt-8 max-w-2xl" />
        </Reveal>

        {spec.groups.length > 0 && (
          <Reveal delay={0.08} className="min-w-0">
            <aside className="rounded-[var(--radius-card)] border border-line bg-pearl p-5 sm:p-6">
              {/* The machine's heading titles the card ("Specifications" then labels the
                  untitled spec-table group, so it isn't repeated as an eyebrow). */}
              <h3 className="flex items-start gap-2.5 text-lg leading-snug font-bold text-ink">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-sky text-brand">
                  <SlidersHorizontal className="size-4" aria-hidden />
                </span>
                {spec.title ?? specsLabel}
              </h3>

              <div className="mt-4 space-y-2">
                {spec.groups.map((g, i) => (
                  <details
                    key={g.label}
                    open={i === 0}
                    className="group rounded-2xl border border-line bg-white open:shadow-soft"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      {g.label}
                      <ChevronDown
                        className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <div className="px-4 pb-4">
                      <Prose blocks={g.blocks} size="sm" className="[&>*:first-child]:mt-0" />
                    </div>
                  </details>
                ))}
              </div>
            </aside>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/**
 * Live "Complete Package" — the panel is <br>-separated lines; shown as a checklist.
 * Lines starting with "*" are terms, shown as a note under the list.
 */
export function ProductPackage({ section }: { section: Section }) {
  const lines = paragraphs(section.blocks)
    .flatMap((p) => p.html.split(/<br\s*\/?>/))
    .map((l) => l.trim())
    .filter(Boolean);
  const isNote = (l: string) => /^(<strong>|<em>)*\s*\*/.test(l);
  const items = lines.filter((l) => !isNote(l));
  const notes = lines.filter(isNote);

  return (
    <section className="bg-pearl py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <Eyebrow>{section.heading}</Eyebrow>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((html, i) => (
            <Reveal as="li" key={i} delay={Math.min(i, 8) * 0.03}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-sky text-brand">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span
                  className="min-w-0 text-[15px] leading-snug text-ink"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </Reveal>
          ))}
        </ul>
        {notes.map((html, i) => (
          <p
            key={i}
            className="mt-5 max-w-4xl text-xs leading-relaxed text-muted"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>
    </section>
  );
}

/** Long-form live sections (Training, About Hollywood Whitening): title left, copy right. */
export function ProductTextSection({ section, tone = "white" }: { section: Section; tone?: "white" | "pearl" }) {
  return (
    <section className={tone === "pearl" ? "bg-pearl py-16 sm:py-24" : "bg-white py-16 sm:py-24"}>
      <div className="container-x grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{section.heading}</Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.05} className="min-w-0">
          <Prose blocks={section.blocks} className="max-w-3xl" />
        </Reveal>
      </div>
    </section>
  );
}

/** Live "FAQs" — each paragraph is "<strong>Question</strong> answer"; shown as an accordion. */
export function ProductFaq({ section }: { section: Section }) {
  const faqs = paragraphs(section.blocks)
    .map((p) => p.html.match(/^<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/))
    .filter((m): m is RegExpMatchArray => !!m && !!m[2].trim())
    .map((m) => ({ q: m[1].replace(/<[^>]+>/g, "").trim(), a: m[2].trim() }));
  if (!faqs.length) return null;

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-x grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <Eyebrow>{section.heading}</Eyebrow>
        </Reveal>
        <div className="min-w-0 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i, 4) * 0.04}>
              <details
                className="group rounded-2xl border border-line bg-pearl transition-colors open:border-brand/25 open:bg-white open:shadow-soft"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p
                  className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 [&_a]:text-brand [&_a]:underline [&_strong]:text-ink"
                  dangerouslySetInnerHTML={{ __html: f.a }}
                />
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const DELIVERY_ICONS: LucideIcon[] = [Truck, Clock, TriangleAlert, PackageCheck];

/**
 * Live "Delivery" / "Delivery & Warranty". Up to four paragraphs → one card each; longer
 * panels (Galaxy™'s, where paragraphs continue one another) → one card of flowing text.
 */
export function ProductDelivery({ section }: { section: Section }) {
  const ps = paragraphs(section.blocks);
  return (
    <section className="bg-pearl py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <Eyebrow>{section.heading}</Eyebrow>
        </Reveal>
        {ps.length <= 4 ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
            {ps.map((p, i) => {
              const Icon = DELIVERY_ICONS[i % DELIVERY_ICONS.length];
              return (
                <Reveal as="li" key={i} delay={i * 0.05}>
                  {/* phones: icon above the text so the copy gets the full card width */}
                  <div className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:flex-row sm:p-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-sky text-brand">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <Prose blocks={[p]} size="sm" />
                  </div>
                </Reveal>
              );
            })}
          </ul>
        ) : (
          <Reveal className="mt-8">
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-8">
              <Prose blocks={ps} size="sm" className="gap-10 md:columns-2 [&_p]:break-inside-avoid" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
