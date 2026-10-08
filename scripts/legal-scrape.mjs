#!/usr/bin/env node
/**
 * Rebuilds src/content/<locale>/pages/{privacy,terms,warranty}.json from the live
 * WordPress legal pages (all four locales).
 *
 * The live pages are plain WP editor content. They become a flat list of blocks:
 *   { type: "h", text }          — <h2–h6>, or a paragraph that is entirely bold
 *                                  (the live pages use <p><strong>…</strong></p> as headings)
 *   { type: "p", html }          — paragraph; inline markup reduced to a/strong/em/br
 *   { type: "ul" | "ol", items } — list items as the same inline html
 * The <h1> becomes `title`. Inline colour spans and other attributes are dropped.
 *
 * Copy is legal text: the body is kept verbatim. Only the brand, which live machine
 * translation renders as "Blanqueamiento Hollywood" / "Hollywood-Aufhellung" /
 * "голливудское отбеливание" (mostly in the <title>/description), is restored by
 * BRAND_FIXES. Have it reviewed by the
 * business before launch, not just by translators.
 *
 * Usage: node scripts/legal-scrape.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.hollywoodwhitening.com";
const OUT = path.resolve(import.meta.dirname, "../src/content");

const PAGES = {
  privacy: { en: "privacy", es: "privacidad", de: "datenschutz", ru: "конфиденциальность" },
  terms: { en: "terms-and-conditions", es: "terminos-y-condiciones", de: "geschaftsbedingungen", ru: "условия-и-положения" },
  warranty: { en: "warranty", es: "garantia", de: "garantie", ru: "гарантия" },
};

const ENTITIES = {
  "&nbsp;": " ", "&amp;": "&", "&#038;": "&", "&quot;": '"', "&#039;": "'", "&#39;": "'",
  "&#8217;": "’", "&rsquo;": "’", "&#8216;": "‘", "&#8220;": "“", "&#8221;": "”",
  "&#8230;": "…", "&#x2122;": "™", "&#8482;": "™", "&#8211;": "–", "&#8212;": "—",
  "&laquo;": "«", "&raquo;": "»", "&copy;": "©", "&gt;": ">", "&lt;": "<", "&#8243;": "″", "&euro;": "€", "&pound;": "£", "&#163;": "£",
};
const decode = (s) => s.replace(/&[#\w]+;/g, (e) => ENTITIES[e] ?? e);
const escapeHtml = (s) => s.replace(/&(?![#\w]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const textOf = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Same-site links become root-relative; everything else is kept as is. */
function rewriteHref(href) {
  const h = decode(href).trim();
  if (h.startsWith(ORIGIN)) return decodeURI(h.slice(ORIGIN.length)) || "/";
  return h;
}

/** Reduces inline HTML to a, strong, em and br, with entities normalised. */
function inline(html) {
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

function blocks(html) {
  let main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  main = main.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
  // The live site serves addresses through Cloudflare's email protection — restore them.
  main = main.replace(/<a[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/a>/gi, (_, hex) => {
    const email = cfDecode(hex);
    return `<a href="mailto:${email}">${email}</a>`;
  });
  main = main.replace(/<span[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/span>/gi, (_, hex) => cfDecode(hex));
  const title = textOf(main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  main = main.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");

  const out = [];
  const re = /<(h[2-6]|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const m of main.matchAll(re)) {
    const tag = m[1].toLowerCase();
    const body = m[2];
    if (tag === "ul" || tag === "ol") {
      const items = [...body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => inline(li[1])).filter(Boolean);
      if (items.length) out.push({ type: tag, items });
    } else if (tag.startsWith("h") || (allBold(body) && !/[.!]s*$/.test(textOf(body)))) {
      // A bold sentence ending in "." is an emphasised statement, not a heading.
      const text = textOf(body).replace(/:$/, "");
      if (text) out.push({ type: "h", text });
    } else {
      const html = inline(body);
      if (textOf(html)) out.push({ type: "p", html });
    }
  }
  const fixed = mergeLists(out).map((b) =>
    b.type === "h" ? { ...b, text: fixBrand(b.text) }
    : b.type === "p" ? { ...b, html: fixBrand(b.html) }
    : { ...b, items: b.items.map(fixBrand) },
  );
  return { title: fixBrand(title), blocks: fixed };
}

const BRAND = "Hollywood Whitening";
const BRAND_FIXES = [
  [/servicios de blanqueamiento Hollywood/g, `servicios de ${BRAND}`],
  [/\b[Ee]l blanqueamiento Hollywood/g, BRAND],
  [/Blanqueamiento (de )?Hollywood/g, BRAND],
  [/Hollywood-Aufhellung/g, BRAND],
  [/услуг по голливудскому отбеливанию зубов/g, `услуг ${BRAND}`],
  [/[Гг]олливудское отбеливание( зубов)?/g, BRAND],
];
function fixBrand(s) {
  return BRAND_FIXES.reduce((acc, [re, to]) => acc.replace(re, to), s);
}

function meta(html) {
  const pick = (re) => fixBrand(decode(html.match(re)?.[1] ?? ""));
  return { title: pick(/<title>([^<]*)<\/title>/), description: pick(/<meta name="description" content="([^"]*)"/) };
}

/** The live warranty page wraps each bullet in its own <ul>; join neighbouring lists. */
function mergeLists(list) {
  return list.reduce((acc, b) => {
    const prev = acc.at(-1);
    if (prev && b.items && prev.type === b.type) prev.items.push(...b.items);
    else acc.push(b);
    return acc;
  }, []);
}

for (const [page, slugs] of Object.entries(PAGES)) {
  for (const [locale, slug] of Object.entries(slugs)) {
    const url = `${ORIGIN}${locale === "en" ? "" : `/${locale}`}/${encodeURI(slug)}/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    const html = await res.text();
    const body = blocks(html);
    const json = { meta: meta(html), title: body.title, blocks: body.blocks };
    const dir = path.join(OUT, locale, "pages");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${page}.json`), JSON.stringify(json, null, 2) + "\n");
    console.log(`${locale}/${page}: "${body.title}" — ${body.blocks.length} blocks`);
  }
}
