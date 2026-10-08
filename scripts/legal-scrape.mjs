#!/usr/bin/env node
/**
 * Rebuilds src/content/<locale>/pages/{privacy,terms,warranty}.json from the live
 * WordPress legal pages (all four locales).
 *
 * The live pages are plain WP editor content; it becomes a flat list of blocks
 * (see scripts/lib/wp-html.mjs). The <h1> becomes `title`.
 *
 * Copy is legal text: the body is kept verbatim. Only the brand, which live machine
 * translation renders as "Blanqueamiento Hollywood" / "Hollywood-Aufhellung" /
 * "голливудское отбеливание" (mostly in the <title>/description), is restored.
 * Have it reviewed by the business before launch, not just by translators.
 *
 * Usage: node scripts/legal-scrape.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { clean, fetchHtml, fixBrand, liveUrl, meta, parseBlocks, textOf } from "./lib/wp-html.mjs";

const OUT = path.resolve(import.meta.dirname, "../src/content");

const PAGES = {
  privacy: { en: "privacy", es: "privacidad", de: "datenschutz", ru: "конфиденциальность" },
  terms: { en: "terms-and-conditions", es: "terminos-y-condiciones", de: "geschaftsbedingungen", ru: "условия-и-положения" },
  warranty: { en: "warranty", es: "garantia", de: "garantie", ru: "гарантия" },
};

for (const [page, slugs] of Object.entries(PAGES)) {
  for (const [locale, slug] of Object.entries(slugs)) {
    const html = await fetchHtml(liveUrl(locale, slug));
    let main = clean(html.slice(html.indexOf("<main"), html.indexOf("</main>")));
    const title = fixBrand(textOf(main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ""));
    main = main.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");
    const blocks = parseBlocks(main);

    const dir = path.join(OUT, locale, "pages");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${page}.json`), JSON.stringify({ meta: meta(html), title, blocks }, null, 2) + "\n");
    console.log(`${locale}/${page}: "${title}" — ${blocks.length} blocks`);
  }
}
