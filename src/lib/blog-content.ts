/**
 * Blog HTML clean-up — makes WordPress post bodies render on the Next site, as
 * allwhitelaser-next's lib/blog-content.ts does. Server-only (called from lib/blog.ts).
 *
 * The bodies are authored for the live Flatsome theme, so:
 *  - inline `style` / `<style>` / editor `data-*` noise is dropped (the prose styles in
 *    globals.css → `.blog-prose` take over);
 *  - Flatsome `banner` widgets (a background photo + a text box with a button, which
 *    only lay out with the theme's CSS) become our own `.blog-cta` card;
 *  - same-site links become root-relative, except WooCommerce-only ones;
 *  - tables are wrapped so wide ones scroll; `<h2>`s get anchor ids for the contents list.
 */
import { fixBrand } from "../../scripts/lib/wp-html.mjs";

/** Hosts whose links mirror a page of this site (WordPress rewrites links to its own home URL). */
const SITE_HOST = /^https?:\/\/(?:(?:www|shop|business)\.)?hollywoodwhitening\.com(?=[/?#]|$)/i;

/** Paths only WordPress can serve — account, basket, checkout, admin, uploads. */
const BACKEND_ONLY_PATH =
  /^\/(?:[a-z]{2}\/)?(?:my-account|mi-cuenta|mein-konto|cart|basket|checkout|shop|wc-[^/]+|wp-admin|wp-login|wp-json|wp-content|wp-includes)(?:[/?#]|$)/i;

/** POA / add-to-cart links drive the WooCommerce flow (see src/proxy.ts). */
const BACKEND_ONLY_QUERY = /[?&](?:[^=&]*poa[^=&]*|add-to-cart|wc-[^=&]+)=/i;

const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", trade: "™", copy: "©", reg: "®",
};

/** Decodes HTML entities in a plain-text field (titles, excerpts). */
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** Rendered HTML → one line of plain text. */
export function plainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Same-site absolute link → root-relative (unless WordPress must handle it). */
export function siteHref(href: string): string {
  const m = href.match(SITE_HOST);
  if (!m) return href;
  const rest = href.slice(m[0].length) || "/";
  if (BACKEND_ONLY_PATH.test(rest) || BACKEND_ONLY_QUERY.test(rest)) return href;
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/** End index (exclusive) of the `<div>` element opening at `start`, by tag depth. */
function divEnd(html: string, start: number): number {
  const tag = /<(\/?)div\b[^>]*>/gi;
  tag.lastIndex = start;
  let depth = 0;
  for (let m = tag.exec(html); m; m = tag.exec(html)) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return tag.lastIndex;
  }
  return html.length;
}

/** A Flatsome banner → `.blog-cta` card (photo, heading, copy, button). */
function bannerToCta(banner: string): string {
  const img = banner.match(/<img[^>]*\ssrc="([^"]+)"[^>]*>/i);
  const alt = img?.[0].match(/\salt="([^"]*)"/i)?.[1] ?? "";
  const inner = banner.match(/class="text-inner[^"]*"[^>]*>([\s\S]*)/i)?.[1] ?? banner;
  const heading = inner.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const paras = [...inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((p) => plainText(p[1])).filter(Boolean);
  const button = inner.match(/<a\b([^>]*)>([\s\S]*?)<\/a>/i);
  const href = button?.[1].match(/\shref="([^"]+)"/i)?.[1];

  const title = heading ? plainText(heading[1]) : "";
  if (!title && !paras.length) return "";
  return (
    `<aside class="blog-cta">` +
    (img ? `<img src="${escapeAttr(img[1])}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async">` : "") +
    `<div class="blog-cta-body">` +
    (title ? `<p class="blog-cta-title">${escapeAttr(title)}</p>` : "") +
    paras.map((p) => `<p>${escapeAttr(p)}</p>`).join("") +
    (button && href ? `<a class="blog-cta-button" href="${escapeAttr(siteHref(href))}">${escapeAttr(plainText(button[2]))}</a>` : "") +
    `</div></aside>`
  );
}

function replaceBanners(html: string): string {
  let out = "";
  let from = 0;
  const open = /<div class="banner\b[^"]*"[^>]*>/gi;
  for (let m = open.exec(html); m; m = open.exec(html)) {
    const end = divEnd(html, m.index);
    out += html.slice(from, m.index) + bannerToCta(html.slice(m.index, end));
    from = end;
    open.lastIndex = end;
  }
  return out + html.slice(from);
}

export type TocEntry = { id: string; text: string };

/**
 * A post's rendered HTML, ready for `.blog-prose`, plus the contents list built from
 * its `<h2>`s. Ids are positional (`section-n`) so Cyrillic headings work too.
 */
export function processBlogContent(html: string): { html: string; toc: TocEntry[] } {
  let out = replaceBanners(html)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s(?:style|data-[\w-]+|aria-level|width|height)="[^"]*"/gi, (m) =>
      // Image dimensions are kept: they reserve space before the image loads.
      /^\s(?:width|height)/i.test(m) ? m : "",
    )
    // Table markup keeps only its spans (editor widths/heights break the layout on phones).
    .replace(/<(table|thead|tbody|tr|td|th)\b([^>]*)>/gi, (_m, tag: string, attrs: string) =>
      `<${tag}${(attrs.match(/\s(?:colspan|rowspan)="\d+"/gi) ?? []).join("")}>`,
    )
    .replace(/<(div|span)>\s*<\/\1>/gi, "")
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/<span>([\s\S]*?)<\/span>/gi, "$1");

  out = out.replace(/(<a\b[^>]*\shref=")([^"]+)(")/gi, (_m, a: string, href: string, b: string) => {
    const next = siteHref(href);
    // Links leaving the site open in a new tab, as on the live blog.
    const external = /^https?:\/\//i.test(next) && !SITE_HOST.test(next);
    return `${a}${next}${b}${external && !/\starget=/i.test(a) ? ' target="_blank" rel="noopener"' : ""}`;
  });

  // WordPress answers 403 to image requests that carry another site's Referer (hotlink
  // protection) but serves them with none.
  out = out.replace(/<img\b(?![^>]*\sreferrerpolicy=)/gi, '<img referrerpolicy="no-referrer"');

  out = out
    .replace(/<table/gi, '<div class="blog-table"><table')
    .replace(/<\/table>/gi, "</table></div>");

  const toc: TocEntry[] = [];
  out = out.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_m, attrs: string, inner: string) => {
    const text = fixBrand(plainText(inner));
    if (!text) return "";
    const id = `section-${toc.length + 1}`;
    toc.push({ id, text });
    return `<h2 id="${id}"${attrs.replace(/\sid="[^"]*"/i, "")}>${inner}</h2>`;
  });

  return { html: fixBrand(out).trim(), toc };
}

/** Reading time at ~200 words a minute (the live site's Yoast estimate uses the same rate). */
export function readingMinutes(html: string): number {
  const words = plainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
