import type { ContentBlock } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Renders scraped WordPress editor content (scripts/lib/wp-html.mjs blocks): headings,
 * paragraphs, lists and spec tables. Paragraph/list html is reduced to a/strong/em/br at
 * scrape time, which is why it is safe to inject — only feed this scraper output.
 *
 * Headings get the anchor id from `ids[blockIndex]` when given (legal pages' contents).
 * `size="sm"` is for cards and asides (cn() joins classes, it does not resolve
 * Tailwind conflicts, so sizes are a prop rather than className overrides).
 */
export function Prose({
  blocks,
  ids,
  size = "base",
  className,
}: {
  blocks: ContentBlock[];
  ids?: Record<number, string>;
  size?: "base" | "sm";
  className?: string;
}) {
  const sm = size === "sm";
  return (
    <div
      className={cn(
        sm ? "text-sm" : "text-[15px] sm:text-base",
        "leading-relaxed text-muted [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-deep [&_strong]:font-semibold [&_strong]:text-ink",
        className,
      )}
    >
      {blocks.map((b, i) => {
        if (b.type === "h")
          return (
            <h2
              key={i}
              id={ids?.[i]}
              className={cn(
                "flex scroll-mt-28 items-start gap-3 leading-snug font-bold text-ink first:mt-0",
                sm ? "mt-6 text-base sm:text-lg" : "mt-10 text-xl sm:mt-12 sm:text-2xl",
              )}
            >
              <span aria-hidden className="mt-[0.55em] h-0.5 w-4 shrink-0 rounded-full bg-brand" />
              {b.text}
            </h2>
          );
        if (b.type === "p")
          return (
            <p
              key={i}
              className={sm ? "mt-3 first:mt-0" : "mt-4 first:mt-0"}
              dangerouslySetInnerHTML={{ __html: b.html }}
            />
          );
        if (b.type === "table")
          return (
            <div key={i} className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-line">
                  {b.rows.map((row, j) => (
                    <tr key={j} className="even:bg-pearl/70">
                      {row.map((cell, k) => (
                        <td
                          key={k}
                          className={cn("px-4 py-3 align-top", k === 0 ? "w-1/2 font-medium text-ink" : "text-muted")}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        if (b.type === "ol")
          return (
            <ol key={i} className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brand">
              {b.items.map((li, j) => (
                <li key={j} className="pl-1" dangerouslySetInnerHTML={{ __html: li }} />
              ))}
            </ol>
          );
        return (
          <ul key={i} className="mt-4 space-y-2.5">
            {b.items.map((li, j) => (
              <li key={j} className="flex gap-3">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-brand" />
                <span className="min-w-0" dangerouslySetInnerHTML={{ __html: li }} />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
