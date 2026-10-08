/**
 * Shared helpers for the scrapers that turn live WordPress editor content into the
 * block JSON the Next pages render (legal-scrape.mjs, product-scrape.mjs).
 *
 * Blocks:
 *   { type: "h", text }               — <h2–h6>, or a short paragraph that is entirely bold
 *                                       (the live pages use <p><strong>…</strong></p> as headings)
 *   { type: "p", html }               — paragraph; inline markup reduced to a/strong/em/br
 *   { type: "ul" | "ol", items }      — list items as the same inline html
 *   { type: "table", rows }           — [[cell, cell], …] as plain text (opt-in)
 */

export const ORIGIN = "https://www.hollywoodwhitening.com";

const ENTITIES = {
  "&nbsp;": " ", "&amp;": "&", "&#038;": "&", "&quot;": '"', "&#039;": "'", "&#39;": "'",
  "&#8217;": "’", "&rsquo;": "’", "&#8216;": "‘", "&#8220;": "“", "&#8221;": "”",
  "&#8230;": "…", "&#x2122;": "™", "&#8482;": "™", "&#8211;": "–", "&#8212;": "—",
  "&laquo;": "«", "&raquo;": "»", "&copy;": "©", "&gt;": ">", "&lt;": "<", "&#8243;": "″",
  "&euro;": "€", "&pound;": "£", "&#163;": "£", "&#036;": "$", "&times;": "×", "&#215;": "×",
};
export const decode = (s) => s.replace(/&[#\w]+;/g, (e) => ENTITIES[e] ?? e);
const escapeHtml = (s) => s.replace(/&(?![#\w]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const textOf = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

/** Live machine translation renders the brand as words; restore it. */
const BRAND = "Hollywood Whitening";
const BRAND_FIXES = [
  [/servicios de blanqueamiento Hollywood/g, `servicios de ${BRAND}`],
  [/\b[Ee]l blanqueamiento Hollywood/g, BRAND],
  [/Blanqueamiento (de )?Hollywood/g, BRAND],
  [/Acerca del blanqueamiento Hollywood/g, `Acerca de ${BRAND}`],
  [/de blanqueamiento de Hollywood/g, `de ${BRAND}`],
  [/de blanqueamiento Hollywood(?! Whitening)/g, `de ${BRAND}`],
  [/Hollywood-Aufhellung/g, BRAND],
  [/Hollywood-Zahnaufhellungsbehandlungen/g, `${BRAND}-Behandlungen`],
  [/Hollywood-Zahnaufhellung\b/g, BRAND],
  [/Hollywood-Bleaching/g, BRAND],
  [/услуг по голливудскому отбеливанию зубов/g, `услуг ${BRAND}`],
  [/[Гг]олливудское отбеливание( зубов)?/g, BRAND],
  [/голливудские процедуры/g, `процедуры ${BRAND}`],
];
export const fixBrand = (s) => BRAND_FIXES.reduce((acc, [re, to]) => acc.replace(re, to), s);

/* ------------------------------------------------------------------ */
/* Inline HTML                                                         */
/* ------------------------------------------------------------------ */

/** Same-site links become root-relative; everything else is kept as is. */
function rewriteHref(href) {
  const h = decode(href).trim();
  if (h.startsWith(ORIGIN)) return decodeURI(h.slice(ORIGIN.length)) || "/";
  return h;
}

/** Reduces inline HTML to a, strong, em and br, with entities normalised. */
export function inline(html) {
  let out = "";
  const re = /<\/?([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  for (const m of html.matchAll(re)) {
    if (m[3] !== undefined) {
      out += escapeHtml(decode(m[3]));
      continue;
    }
    const closing = m[0].startsWith("</");
    const tag = m[1].toLowerCase();
    if (tag === "br") out += "<br>";
    else if (tag === "strong" || tag === "b") out += closing ? "</strong>" : "<strong>";
    else if (tag === "em" || tag === "i") out += closing ? "</em>" : "<em>";
    else if (tag === "a") {
      if (closing) out += "</a>";
      else {
        const href = m[2].match(/href=["']([^"']+)["']/)?.[1];
        out += href ? `<a href="${escapeHtml(rewriteHref(href))}">` : "<a>";
      }
    }
  }
  return out
    .replace(/\s+/g, " ")
    .replace(/<strong>\s*<\/strong>|<em>\s*<\/em>/g, "")
    .replace(/<\/strong>(\s*)<strong>/g, "$1")
    // <b><strong>…</strong></b> on the live pages → a single <strong>
    .replace(/(<strong>\s*)+/g, "<strong>")
    .replace(/(\s*<\/strong>)+/g, "</strong>")
    .replace(/(<br>\s*)+$/g, "")
    .replace(/^(\s*<br>)+/g, "")
    .trim();
}

/** True when a paragraph's visible text is entirely inside <strong>/<b>. */
function allBold(html) {
  const text = textOf(html);
  if (!text || text.length > 140) return false;
  const bold = [...html.matchAll(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => textOf(m[2])).join(" ");
  return bold.replace(/\s+/g, "") === text.replace(/\s+/g, "");
}

/** Cloudflare email obfuscation: hex string whose first byte is the XOR key. */
function cfDecode(hex) {
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return out;
}

/** Strips scripts/styles/comments and restores Cloudflare-protected email addresses. */
export function clean(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "")
    .replace(/<a[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/a>/gi, (_, hex) => {
      const email = cfDecode(hex);
      return `<a href="mailto:${email}">${email}</a>`;
    })
    .replace(/<span[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/span>/gi, (_, hex) => cfDecode(hex));
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

/** Neighbouring lists of the same kind are one list (the live warranty page splits them). */
function mergeLists(list) {
  return list.reduce((acc, b) => {
    const prev = acc.at(-1);
    if (prev && b.items && prev.type === b.type) prev.items.push(...b.items);
    else acc.push(b);
    return acc;
  }, []);
}

/** Editor HTML → blocks (see the top of this file). `tables: true` keeps <table>s as rows. */
export function parseBlocks(fragment, { tables = false } = {}) {
  const out = [];
  const re = tables
    ? /<(h[2-6]|p|ul|ol|table)\b[^>]*>([\s\S]*?)<\/\1>/gi
    : /<(h[2-6]|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const m of clean(fragment).matchAll(re)) {
    const tag = m[1].toLowerCase();
    const body = m[2];
    if (tag === "table") {
      const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
        .map((tr) => [...tr[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((td) => textOf(td[1])))
        .filter((r) => r.some(Boolean));
      if (rows.length) out.push({ type: "table", rows });
    } else if (tag === "ul" || tag === "ol") {
      const items = [...body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => inline(li[1])).filter(Boolean);
      if (items.length) out.push({ type: tag, items });
    } else if (tag.startsWith("h") || (allBold(body) && !/[.!]\s*$/.test(textOf(body)))) {
      // A bold sentence ending in "." is an emphasised statement, not a heading.
      const text = textOf(body).replace(/:$/, "");
      if (text) out.push({ type: "h", text });
    } else {
      const html = inline(body);
      if (textOf(html)) out.push({ type: "p", html });
    }
  }
  return mergeLists(out).map((b) =>
    b.type === "h"
      ? { ...b, text: fixBrand(b.text) }
      : b.type === "p"
        ? { ...b, html: fixBrand(b.html) }
        : b.type === "table"
          ? { ...b, rows: b.rows.map((r) => r.map(fixBrand)) }
          : { ...b, items: b.items.map(fixBrand) },
  );
}

/** <title> and meta description, brand restored. */
export function meta(html) {
  const pick = (re) => fixBrand(decode(html.match(re)?.[1] ?? ""));
  return { title: pick(/<title>([^<]*)<\/title>/), description: pick(/<meta name="description" content="([^"]*)"/) };
}

/** Live URL for a locale + slug (slug may contain "/" and non-ASCII). */
export const liveUrl = (locale, slug) => `${ORIGIN}${locale === "en" ? "" : `/${locale}`}/${encodeURI(slug)}/`;

export async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}
