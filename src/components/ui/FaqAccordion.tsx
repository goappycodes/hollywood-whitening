import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Question/answer accordion (native <details>, first item open). Answers are scraped
 * paragraph html reduced to a/strong/em/br — only feed it scraper output.
 */
export function FaqAccordion({ items, tone = "pearl" }: { items: { q: string; a: string[] }[]; tone?: "pearl" | "white" }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={Math.min(i, 4) * 0.04}>
          <details
            className={`group rounded-2xl border border-line transition-colors open:border-brand/25 open:bg-white open:shadow-soft ${
              tone === "white" ? "bg-white" : "bg-pearl"
            }`}
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold sm:text-[15px] text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown
                className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 [&_a]:text-brand [&_a]:underline [&_strong]:text-ink">
              {f.a.map((a, j) => (
                <p key={j} dangerouslySetInnerHTML={{ __html: a }} />
              ))}
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
