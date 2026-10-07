# Localisation

Four locales, mirroring the live WordPress site and following the allwhitelaser-next pattern
(hand-rolled, no middleware or i18n library):

| Locale | URL prefix | `lang` |
| --- | --- | --- |
| English | none (`/`) | `en-GB` |
| Spanish | `/es/` | `es-ES` |
| German | `/de/` | `de-DE` |
| Russian | `/ru/` | `ru-RU` |

## Where things live

| Concern | File |
| --- | --- |
| Locales, URL slugs per page, path helpers, hreflang | `src/lib/i18n.ts` |
| Typed content loaders | `src/lib/content.ts` |
| Page copy (generated from the live site) | `src/content/<locale>/pages/home.json` |
| Header / footer / UI strings (hand-maintained) | `src/content/<locale>/common.json` |
| Locale-independent data (images, ratings, nav structure) | `src/lib/site.ts` |
| Localised catch-all route | `src/app/[[...lang]]/page.tsx` |
| Scraper | `scripts/localize-scrape.mjs` |
| Language switcher (flags, same page in each locale) / `<html lang>` sync | `src/components/site/LanguageSwitcher.tsx`, `Flag.tsx`, `HtmlLang.tsx` |
| Instagram section (live `aw3/v1/instagram` → snapshot fallback) | `src/lib/instagram.ts`, `src/components/ui/shared/sections/InstagramFeed.tsx` |
| Instagram fallback snapshot (same posts in every locale) | `scripts/instagram-snapshot.mjs` → `src/content/instagram.json`, `public/images/instagram/` |

- `PAGE_SLUGS` mirrors the live WordPress URLs exactly (Russian slugs stored decoded), so pages
  can replace WordPress 1:1 without redirects. Always link with `pageHref(locale, pageKey)`.
- Only keys in `BUILT_PAGES` are rendered; everything else is a valid link target that 404s
  until built (`account` and `shop` link to WordPress).
- `<html lang>` stays `en-GB`; the header, footer and page wrappers set `lang` from the URL.
- Every page emits canonical + full hreflang (`x-default` → English); `sitemap.xml` too.

## Adding a page

1. Add copy to `src/content/<locale>/pages/<page>.json` for all four locales (English defines the type).
2. Add a loader in `src/lib/content.ts` and a sections component in `src/components/pages/`.
3. Add the key to `BUILT_PAGES` and render it from `src/app/[[...lang]]/page.tsx`.

## Refreshing copy from the live site

```bash
node scripts/localize-scrape.mjs
```

Copy is picked by line index from the live homepages (the four languages share one template).
Review the diff after running it: if WordPress content changes shape, indices in `LINE` need updating.

## Refreshing the Instagram feed

```bash
node scripts/instagram-snapshot.mjs
```

The section first asks WordPress for live posts via `${NEXT_PUBLIC_WP_URL}/wp-json/aw3/v1/instagram`
(same endpoint and env vars as allwhitelaser-next, cached 30 min). Hollywood's WordPress doesn't have
that endpoint yet, so it falls back to this snapshot: the 12 latest posts from the live homepage, with
images stored locally because Instagram CDN URLs expire. Install the same `aw3/v1/instagram`
endpoint on Hollywood's WordPress (see `.env.example`) and the feed goes live with no code change.

## Needs native-speaker review

The scraper layers two things on top of the live text — both listed in `scripts/localize-scrape.mjs`:

- **`OVERRIDES`** — corrections to live machine translation: brand, product and testimonial
  business names kept in their original form (live had e.g. "Hollywood-Aufhellungsanbieter",
  "Голливуд рядом с Челси"), and mistranslated short labels fixed (package tiers such as
  "ЦЕНИТЬ" / "GRAVE", treatment counts, two Russian feature labels).
- **`DESIGN`** — strings for UI the redesign adds (eyebrows, stats, chips, aria labels, the
  hero's second line). These are new translations, not from the live site.

`common.json` uses the live header/footer labels except: "Home" (live "Heim" / "Hogar" / "Дом"),
shortened "Science & FAQ" (es/ru) and "Find a Provider" (ru) to fit the desktop nav, and product
names kept as Star One™ / Comet 2™ / Galaxy™ (live es/ru nav translated them).
