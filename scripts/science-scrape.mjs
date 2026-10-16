#!/usr/bin/env node
/**
 * Rebuilds, for all four locales:
 *   src/content/<locale>/pages/science.json — "The Science & Technology behind Modern Laser
 *                                             Teeth Whitening" (article page)
 *   src/content/<locale>/pages/laser.json   — "Laser Teeth Whitening" (treatment guide:
 *                                             comparison, price table, info tabs, FAQ)
 * and downloads their images into public/images/science/.
 *
 * Both are Flatsome layouts whose locales share one template, so each page is split at
 * its headings by POSITION (the text is localised) and every region parsed into blocks
 * (scripts/lib/wp-html.mjs). Tabs, the FAQ accordion and the price table are read from
 * their markup.
 *
 * Usage: node scripts/science-scrape.mjs
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { clean, decode, fetchHtml, fixBrand, liveUrl, meta, parseBlocks, textOf } from "./lib/wp-html.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMG_DIR = path.join(ROOT, "public/images/science");

/** Keep in step with PAGE_SLUGS in src/lib/i18n.ts ("science", "laser"). */
const SLUGS = {
  science: {
    en: "the-science-technology-behind-modern-laser-teeth-whitening",
    es: "la-ciencia-y-la-tecnologia-detras-del-blanqueamiento-dental-laser-moderno",
    de: "die-wissenschaft-und-technologie-hinter-der-modernen-laser-zahnaufhellung",
    ru: "наука-технология-за-современным-лазе",
  },
  laser: {
    en: "laser-teeth-whitening",
    es: "blanqueamiento-dental-con-laser",
    de: "laser-zahnaufhellung",
    ru: "лазерное-отбеливание-зубов",
  },
};

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Downloads an uploads image once — the original size (WP's "-1024x683" suffix dropped),
 * unless the original is huge (TeethGuys.jpg is 10 MB), in which case the resized copy
 * the page itself uses is kept.
 */
const MAX_ORIGINAL = 1.5 * 1024 * 1024;
async function image(src) {
  const url = decode(src).replace(/-\d+x\d+(\.(?:jpe?g|png|webp))$/i, "$1");
  const file = path.basename(new URL(url).pathname);
  const dest = path.join(IMG_DIR, file);
  if (!(await exists(dest))) {
    let res = await fetch(url);
    let buf = res.ok ? Buffer.from(await res.arrayBuffer()) : null;
    if (!buf || buf.length > MAX_ORIGINAL) {
      res = await fetch(decode(src)); // original gone or too heavy: keep the size the page uses
      if (!res.ok) throw new Error(`${src} → ${res.status}`);
      buf = Buffer.from(await res.arrayBuffer());
    }
    await writeFile(dest, buf);
  }
  return `/images/science/${file}`;
}

function split(html) {
  const main = clean(html.slice(html.indexOf("<main"), html.indexOf("</main>")));
  const heads = [...main.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    text: fixBrand(textOf(m[2])),
    start: m.index,
    end: m.index + m[0].length,
  }));
  const region = (i) => main.slice(heads[i].end, heads[i + 1]?.start ?? main.length);
  const imgs = (h) =>
    [...h.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)]
      .map((m) => ({ src: m[1], alt: fixBrand(decode(m[0].match(/alt="([^"]*)"/)?.[1] ?? "")) }))
      .filter((i) => /wp-content\/uploads/.test(i.src) && !/sb-instagram|placeholder/.test(i.src));
  return { main, heads, region, imgs, text: (i) => heads[i].text };
}

const items = (blocks) => blocks.flatMap((b) => (b.items ? b.items : []));
const paragraphs = (blocks) => blocks.filter((b) => b.type === "p");

/* ------------------------------------------------------------------ */
/* Science                                                             */
/* ------------------------------------------------------------------ */

async function science(html) {
  const { main, heads, region, imgs, text } = split(html);
  if (heads.length < 9) throw new Error(`science: ${heads.length} headings`);
  // Heading order: 0 title · 1 subtitle · 2 lead · 3 benefits · 4 (empty) · 5 how a laser
  // works · 6 what is an SRD · 7 considerations · 8 still got doubts.
  // The quote is all bold+italic, so parseBlocks reads it as a heading — take the first
  // block whatever its type.
  const q = parseBlocks(region(1))[0];
  const quote = q ? (q.type === "h" ? q.text : q.type === "p" ? textOf(q.html) : "") : "";
  const doubts = region(8);
  // The industry cards after the (Contact Form 7) form: image + link pairs.
  const links = [...doubts.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((m) => ({ href: decode(m[1]).replace("https://www.hollywoodwhitening.com", ""), label: fixBrand(textOf(m[2])) }))
    .filter((l) => l.label && l.href.startsWith("/"));
  const cardImgs = imgs(doubts).slice(-links.length);
  const all = imgs(main);

  return {
    meta: meta(html),
    title: { bold: text(0), light: text(1) },
    quote,
    lead: text(2),
    benefits: { title: text(3), items: items(parseBlocks(region(3))) },
    body: paragraphs(parseBlocks(region(4))),
    laser: { title: text(5), blocks: paragraphs(parseBlocks(region(5))) },
    srd: { title: text(6), blocks: paragraphs(parseBlocks(region(6))) },
    considerations: { title: text(7), items: items(parseBlocks(region(7))) },
    doubts: { title: text(8), body: textOf(paragraphs(parseBlocks(doubts))[0]?.html ?? "") },
    industries: await Promise.all(links.map(async (l, i) => ({ ...l, image: cardImgs[i] ? await image(cardImgs[i].src) : null }))),
    images: {
      hero: await image(all[0].src),
      pen: await image(imgs(main.slice(heads[4].end, heads[5].start))[0]?.src ?? all[1].src),
      led: await image(imgs(region(6))[0]?.src ?? all[2].src),
      banner: await image(imgs(region(7))[0]?.src ?? all[3].src),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Laser teeth whitening                                               */
/* ------------------------------------------------------------------ */

function priceTable(html) {
  const cols = html.split(/<div class="pricing-table ux_price_table/).slice(1).map((col) => ({
    title: fixBrand(textOf(col.match(/<div class="title[^"]*">([\s\S]*?)<\/div>/)?.[1] ?? "")),
    price: textOf(col.match(/<div class="price[^"]*">([\s\S]*?)<\/div>/)?.[1] ?? ""),
    items: [...col.matchAll(/class="bullet-item"[^>]*>\s*<span class="text">([\s\S]*?)<\/span>/g)].map((m) => fixBrand(textOf(m[1]))),
  }));
  if (cols.length < 3) return null;
  const [labels, ...products] = cols;
  return {
    title: labels.title,
    priceLabel: labels.price,
    columns: products.map((p) => ({ title: p.title, price: p.price })),
    // One row per criterion: label, then each product's value (scores shown as "(10)" live).
    rows: labels.items.map((label, i) => [label, ...products.map((p) => (p.items[i] ?? "").replace(/^\((\d+)\)$/, "$1"))]),
  };
}

async function laser(html) {
  const { main, heads, region, imgs, text } = split(html);
  if (heads.length < 7) throw new Error(`laser: ${heads.length} headings`);
  // Heading order: 0 title · 1 comparison · 2 professional · 3 basic spa · 4 information ·
  // 5 FAQ · 6 "get answers".
  const contact = main.match(/<a [^>]*href="([^"]+)"[^>]*class="button[^"]*"[^>]*>\s*<span>([\s\S]*?)<\/span>/);

  const info = region(4);
  const tabLabels = [...info.matchAll(/<a [^>]*href="#tab_[^"]*"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => fixBrand(textOf(m[1])));
  const panels = [...info.matchAll(/<div id="tab_[^"]*" class="panel[^"]*"[^>]*>([\s\S]*?)(?=<div id="tab_|$)/g)].map((m) =>
    parseBlocks(m[1]).filter((b) => b.type !== "p" || textOf(b.html).replace(/[\s￼]/g, "")),
  );

  const faqHtml = region(6);
  const faqs = [
    ...faqHtml.matchAll(
      /class="accordion-title[^"]*"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div[^>]*class="accordion-inner"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g,
    ),
  ].map((m) => ({ q: fixBrand(textOf(m[1])), a: paragraphs(parseBlocks(m[2])).map((b) => b.html) }));

  const option = (i) => ({ title: text(i), html: paragraphs(parseBlocks(region(i))).map((b) => b.html)[0] ?? "" });

  return {
    meta: meta(html),
    title: text(0),
    comparisonTitle: text(1),
    options: [option(2), option(3)],
    table: priceTable(region(3)),
    contact: contact ? { href: decode(contact[1]).replace("https://www.hollywoodwhitening.com", ""), label: fixBrand(textOf(contact[2])) } : null,
    info: { title: text(4), tabs: tabLabels.map((label, i) => ({ label, blocks: panels[i] ?? [] })) },
    faq: { title: text(5), subtitle: text(6), items: faqs },
    images: { hero: await image(imgs(main)[0].src) },
  };
}

/** Table row labels live machine translation got wrong ("Power" as force / political power). */
const LABEL_FIXES = { es: { Fuerza: "Potencia" }, ru: { Власть: "Мощность" } };

await mkdir(IMG_DIR, { recursive: true });
for (const [page, slugs] of Object.entries(SLUGS)) {
  let enTable = null;
  for (const [locale, slug] of Object.entries(slugs)) {
    const html = await fetchHtml(liveUrl(locale, slug));
    const json = page === "science" ? await science(html) : await laser(html);
    if (page === "laser" && json.table) {
      if (locale === "en") enTable = json.table;
      // Column titles are treatment names and the prices currency figures — live
      // translation mangled both ("Голливудский белый", "Basic-Spa Weiß", prices spelled
      // out in words), so every locale shows the English ones.
      else if (enTable) json.table.columns = enTable.columns;
      const fixes = LABEL_FIXES[locale] ?? {};
      json.table.rows = json.table.rows.map(([label, ...v]) => [fixes[label] ?? label, ...v]);
    }
    const dir = path.join(ROOT, "src/content", locale, "pages");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${page}.json`), JSON.stringify(json, null, 2) + "\n");
    console.log(
      page === "science"
        ? `${locale}/science: "${json.title.bold} ${json.title.light}" — ${json.benefits.items.length} benefits, ${json.industries.length} industries`
        : `${locale}/laser: "${json.title}" — ${json.info.tabs.length} tabs, ${json.faq.items.length} FAQs, table ${json.table?.rows.length ?? 0} rows`,
    );
  }
}
