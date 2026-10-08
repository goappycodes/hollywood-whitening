#!/usr/bin/env node
/**
 * Rebuilds src/content/<locale>/products/<key>.json from the live WooCommerce product
 * pages (all four locales), and downloads the gallery into public/images/products/<key>/.
 *
 * Same pattern as allwhitelaser-next's product pages: copy is verbatim from live; the
 * page is enquiry-led, so price / quantity / basket are NOT carried over (the live
 * pages show "Call for Price" to everyone; a staff-sent ?poa= link unlocks the price
 * on WordPress — see src/proxy.ts).
 *
 * Usage: node scripts/product-scrape.mjs            (all products)
 *        node scripts/product-scrape.mjs star-one   (one product)
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { clean, decode, fetchHtml, fixBrand, liveUrl, meta, parseBlocks, textOf } from "./lib/wp-html.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");

/** Keep in step with PAGE_SLUGS in src/lib/i18n.ts. */
const PRODUCTS = {
  "star-one": {
    en: "product/star-1-teeth-whitening-machine",
    es: "producto/maquina-de-blanqueamiento-dental-estrella-1",
    de: "produkt/stern-1-zahnaufhellungsmaschine",
    ru: "product/аппарат-для-отбеливания-зубов-star-1",
  },
  "comet-2": { en: "product/comet-2", es: "producto/cometa-2", de: "produkt/komet-2", ru: "product/комета-2" },
  galaxy: {
    en: "product/galaxy-laser",
    es: "producto/laser-galactico",
    de: "produkt/galaxie-laser",
    ru: "product/галактический-лазер",
  },
};

/**
 * Spec-table labels live machine translation got wrong ("Power" as political power /
 * physical force). Keyed by locale; applied to table cells only.
 */
const SPEC_FIXES = {
  es: { Fuerza: "Potencia" },
  ru: { Власть: "Мощность" },
};

const between = (html, start, endMarkers) => {
  const i = html.indexOf(start);
  if (i < 0) return "";
  const ends = endMarkers.map((m) => html.indexOf(m, i + start.length)).filter((n) => n > 0);
  return html.slice(i, ends.length ? Math.min(...ends) : undefined);
};

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/** Gallery from the EN page: full-size image URL + alt, downloaded once for every locale. */
async function gallery(html, key) {
  const items = [...html.matchAll(/<img[^>]*?alt="([^"]*)"[^>]*?data-large_image="([^"]+)"/g)].map((m) => ({
    url: m[2],
    alt: decode(m[1]),
  }));
  const dir = path.join(ROOT, "public/images/products", key);
  await mkdir(dir, { recursive: true });
  const out = [];
  for (const { url, alt } of items) {
    const file = path.basename(new URL(url).pathname);
    const dest = path.join(dir, file);
    if (!(await exists(dest))) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} → ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    out.push({ src: `/images/products/${key}/${file}`, alt });
  }
  return out;
}

function product(html, key, images, locale) {
  const main = clean(html.slice(html.indexOf("<main"), html.indexOf("</main>")));

  const name = fixBrand(textOf(main.match(/<h1[^>]*product_title[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""));
  const category = fixBrand(textOf(main.match(/woocommerce-breadcrumb[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? ""));
  const rating = {
    value: Number(main.match(/<strong class="rating">([\d.]+)<\/strong>/)?.[1] ?? 0),
    count: Number(main.match(/<span class="rating">(\d+)<\/span>/)?.[1] ?? 0),
  };
  const callForPrice = textOf(main.match(/class="price[^"]*"[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "");

  // Short description — up to the embedded enquiry form.
  const short = between(main, 'class="product-short-description"', ["gform_wrapper", "</form>", 'class="cart"']);
  const videoId = short.match(/youtube-player" data-id="([^"]+)"/)?.[1] ?? null;
  const intro = parseBlocks(short);

  const formTitle = fixBrand(textOf(main.match(/class="gform_title">([\s\S]*?)<\/h2>/)?.[1] ?? ""));

  // Product footer sections (Description, Delivery …): <h5> heading + panel.
  const sections = [];
  for (const m of main.matchAll(/<h5 class="uppercase mt">([\s\S]*?)<\/h5>[\s\S]*?<div class="panel entry-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g)) {
    const fixes = SPEC_FIXES[locale] ?? {};
    // Table labels: fixed translation, and no trailing colon ("Wavelength:" → "Wavelength").
    const label = (c) => (fixes[c] ?? c).replace(/\s*[:：]\s*$/, "");
    const blocks = parseBlocks(m[2], { tables: true }).map((b) =>
      b.type === "table" ? { ...b, rows: b.rows.map((r) => r.map((c, i) => (i === 0 ? label(c) : c))) } : b,
    );
    sections.push({ heading: fixBrand(textOf(m[1])), blocks });
  }

  const relatedBlock = between(main, 'class="related products"', ["</section>"]);
  const relatedTitle = fixBrand(textOf(relatedBlock.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? ""));
  const related = [...new Set([...relatedBlock.matchAll(/href="[^"]*\/(?:product|producto|produkt)\/([^/"]+)\/"/g)].map((m) => decodeURIComponent(m[1])))]
    .map((slug) => Object.keys(PRODUCTS).find((k) => Object.values(PRODUCTS[k]).some((s) => s.endsWith(`/${slug}`))))
    .filter((k) => k && k !== key);

  return {
    meta: meta(html),
    name,
    category,
    rating,
    callForPrice,
    videoId,
    intro,
    gallery: images,
    formTitle,
    sections,
    related: { title: relatedTitle, items: related },
  };
}

/**
 * What each product-footer section is, so the page can lay it out (checklist, FAQ
 * accordion, delivery cards …). Classified from the ENGLISH heading and applied by
 * position to the other locales — the four live pages share one template.
 */
const KIND_BY_EN_HEADING = {
  description: "description",
  "complete package": "package",
  training: "training",
  "about hollywood whitening": "about",
  faqs: "faq",
  delivery: "delivery",
  "delivery & warranty": "delivery",
};
const kindOf = (heading) => KIND_BY_EN_HEADING[heading.toLowerCase()] ?? "other";

const only = process.argv[2];
for (const [key, slugs] of Object.entries(PRODUCTS)) {
  if (only && key !== only) continue;
  const enHtml = await fetchHtml(liveUrl("en", slugs.en));
  const enImages = await gallery(enHtml, key);
  let enKinds = null;

  for (const [locale, slug] of Object.entries(slugs)) {
    const html = locale === "en" ? enHtml : await fetchHtml(liveUrl(locale, slug));
    // Same images everywhere; alt text from this locale's page where it lines up.
    const alts = [...html.matchAll(/<img[^>]*?alt="([^"]*)"[^>]*?data-large_image="/g)].map((m) => fixBrand(decode(m[1])));
    const images = enImages.map((img, i) => ({ ...img, alt: alts[i] || img.alt }));

    const json = product(html, key, images, locale);
    if (locale === "en") enKinds = json.sections.map((s) => kindOf(s.heading));
    if (enKinds.length !== json.sections.length) {
      throw new Error(`${locale}/${key}: ${json.sections.length} sections, English has ${enKinds.length}`);
    }
    json.sections = json.sections.map((s, i) => ({ kind: enKinds[i], ...s }));
    const dir = path.join(ROOT, "src/content", locale, "products");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${key}.json`), JSON.stringify(json, null, 2) + "\n");
    console.log(
      `${locale}/${key}: "${json.name}" — ${json.gallery.length} images, ${json.sections.length} sections, related ${json.related.items.join(",") || "–"}`,
    );
  }
}
