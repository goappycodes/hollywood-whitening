#!/usr/bin/env node
/**
 * Rebuilds src/content/{en,es,de}/pages/training.json from the live "Teeth Whitening
 * Training" page, and downloads its images into public/images/training/.
 *
 * The page is a Flatsome layout whose four locales share one template, so it is split
 * at its headings (by POSITION — the text is localised) and each region parsed into
 * blocks (scripts/lib/wp-html.mjs). The FAQ is a real accordion and is read from its
 * markup.
 *
 * RUSSIAN IS NOT SCRAPED: on the live site /ru/обучение-отбеливанию-зубов/ redirects to
 * the "Additional training" product that shares its slug, so the Russian page cannot be
 * reached. src/content/ru/pages/training.json is translated by hand from the English —
 * keep it in step when this script's English output changes.
 *
 * Usage: node scripts/training-scrape.mjs
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { clean, decode, fetchHtml, fixBrand, inline, liveUrl, meta, parseBlocks, textOf } from "./lib/wp-html.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SLUGS = { en: "teeth-whitening-training", es: "formacion-para-blanqueamiento-dental-2", de: "zahnaufhellungstraining" };

/** Heading order on the live page (index → meaning). */
const H = {
  heroTitle: 0,
  heroLine1: 1,
  heroLine2: 2,
  intro: 3,
  safe: 4,
  results: 5,
  technique: 6,
  better: 7,
  comparison: 9,
  whyUs: 10,
  faq: 11,
  start: 12,
};

/** Images, in page order (downloaded once, shared by every locale). */
const IMAGES = {
  hero: "2022/04/Hollywood-Banner-5.jpg",
  intro: "2022/07/michael-frattaroli-gKbrJTDV6os-unsplash.jpg",
  safe: "2022/07/ivana-cajina-dnL6ZIpht2s-unsplash-small.jpg",
  technique: "2022/10/Web-Banner-Group-11.jpg",
  better: "2015/09/smile-girl-rightHollywoodCopyright.jpg",
  start: "2015/09/banner-girl-smile-scaled.jpg",
};

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function downloadImages() {
  const dir = path.join(ROOT, "public/images/training");
  await mkdir(dir, { recursive: true });
  const out = {};
  for (const [key, rel] of Object.entries(IMAGES)) {
    const file = path.basename(rel);
    const dest = path.join(dir, file);
    if (!(await exists(dest))) {
      const res = await fetch(`https://www.hollywoodwhitening.com/wp-content/uploads/${rel}`);
      if (!res.ok) throw new Error(`${rel} → ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    out[key] = `/images/training/${file}`;
  }
  return out;
}

function page(html) {
  const main = clean(html.slice(html.indexOf("<main"), html.indexOf("</main>")));
  const heads = [...main.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    text: fixBrand(textOf(m[2])),
    start: m.index,
    end: m.index + m[0].length,
  }));
  if (heads.length < 13) throw new Error(`expected ≥13 headings, got ${heads.length}`);
  /** HTML between heading i and the next heading. */
  const region = (i) => main.slice(heads[i].end, heads[i + 1]?.start ?? main.length);
  const text = (i) => heads[i].text;
  /** First link (href + label) in a region. */
  const link = (i) => {
    const m = region(i).match(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    return m ? { href: inline(`<a href="${m[1]}">x</a>`).match(/href="([^"]+)"/)[1], label: fixBrand(textOf(m[2])) } : null;
  };

  // FAQ accordion: title in the <a>'s <span>, answer in .accordion-inner.
  const faqHtml = region(H.faq);
  const faqs = [
    ...faqHtml.matchAll(
      /class="accordion-title[^"]*"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div[^>]*class="accordion-inner"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g,
    ),
  ].map((m) => ({ q: fixBrand(textOf(m[1])), a: parseBlocks(m[2]).filter((b) => b.type === "p").map((b) => b.html) }));

  // Flatsome text widgets leave the <p> unclosed (a <style> sat inside it), so read
  // "text" widgets up to their </div> instead of relying on </p>.
  const textWidgets = (html) =>
    [...html.matchAll(/<div[^>]*class="text"[^>]*>\s*<p>([\s\S]*?)(?:<\/p>|<\/div>)/g)].map((m) =>
      m[1].split(/<br\s*\/?>/).map((part) => fixBrand(inline(part))).filter((s) => textOf(s)),
    );
  // After the accordion: the closing line ("Teeth Whitening Training by … extraordinary results!").
  const closing = textWidgets(faqHtml.slice(faqHtml.lastIndexOf("accordion-inner"))).flat().join(" ");

  // Comparison region: one live list holds the "machine + gel + training = result" lines
  // AND the advantages; split them back apart (comparison lines contain "=").
  const items = parseBlocks(region(H.comparison)).flatMap((b) => (b.type === "ul" ? b.items : []));
  const compLinks = [...region(H.comparison).matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((m) => ({ href: decode(m[1]).replace("https://www.hollywoodwhitening.com", ""), label: fixBrand(textOf(m[2])) }))
    .filter((l) => l.label);

  const [quote = "", author = ""] = textWidgets(region(H.start))[0] ?? [];

  return {
    meta: meta(html),
    hero: { title: text(H.heroTitle), line1: text(H.heroLine1), line2: text(H.heroLine2) },
    intro: { title: text(H.intro), blocks: parseBlocks(region(H.intro)) },
    safe: { title: text(H.safe), blocks: parseBlocks(region(H.safe)).filter((b) => b.type !== "p" || textOf(b.html) !== link(H.safe)?.label), cta: link(H.safe) },
    results: text(H.results),
    technique: {
      title: text(H.technique),
      // The live syllabus nests its first <li>, which parses as a duplicate — drop repeats.
      blocks: parseBlocks(region(H.technique)).map((b) =>
        b.items ? { ...b, items: b.items.filter((item, i) => item !== b.items[i - 1]) } : b,
      ),
    },
    better: text(H.better),
    comparison: {
      title: text(H.comparison),
      lines: items.filter((i) => i.includes("=")),
      advantages: items.filter((i) => !i.includes("=")),
      links: compLinks,
    },
    whyUs: text(H.whyUs),
    faq: { title: text(H.faq), items: faqs, closing },
    start: { title: text(H.start), quote, author: textOf(author).replace(/^[–—-]\s*/, "") },
  };
}

const images = await downloadImages();
for (const [locale, slug] of Object.entries(SLUGS)) {
  const html = await fetchHtml(liveUrl(locale, slug));
  const json = { ...page(html), images };
  const dir = path.join(ROOT, "src/content", locale, "pages");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "training.json"), JSON.stringify(json, null, 2) + "\n");
  console.log(`${locale}/training: ${json.faq.items.length} FAQs, ${json.comparison.lines.length} comparisons, ${json.comparison.advantages.length} advantages`);
}
