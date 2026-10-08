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
| Page copy | `src/content/<locale>/pages/home.json` (generated from the live site), `about.json` / `contact.json` (hand-written from the live pages) |
| Header / footer / UI strings (hand-maintained) | `src/content/<locale>/common.json` |
| Locale-independent data (images, ratings, nav structure) | `src/lib/site.ts` |
| Localised catch-all route | `src/app/[[...lang]]/page.tsx` |
| Scrapers | `scripts/localize-scrape.mjs` (home), `scripts/legal-scrape.mjs` (privacy, terms, warranty) |
| Language switcher (flags, same page in each locale) / `<html lang>` sync | `src/components/site/LanguageSwitcher.tsx`, `Flag.tsx`, `HtmlLang.tsx` |
| Instagram section (live `aw3/v1/instagram` → snapshot fallback) | `src/lib/instagram.ts`, `src/components/ui/shared/sections/InstagramFeed.tsx` |
| "Get in touch" enquiry form (Gravity Forms form 3) | `src/components/site/EnquiryForm.tsx` → `src/app/api/enquiry/route.ts`; field ids `src/lib/gf-forms.ts`, countries `src/lib/gf-countries.ts`; labels `common.json → enquiryForm` |
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

## Refreshing the legal pages

```bash
node scripts/legal-scrape.mjs
```

Privacy, Terms and Warranty are scraped verbatim into blocks (heading / paragraph / list) for all four
locales. The script restores the brand where live machine translation broke it (`BRAND_FIXES`, mostly
in meta titles) and decodes Cloudflare-obfuscated email addresses. Inline HTML is reduced to
a/strong/em/br at scrape time; the page renders it with `dangerouslySetInnerHTML`, so only feed it
content from this script.

## Refreshing the Instagram feed

```bash
node scripts/instagram-snapshot.mjs
```

The section first asks WordPress for live posts via `${NEXT_PUBLIC_WP_URL}/wp-json/aw3/v1/instagram`
(same endpoint and env vars as allwhitelaser-next, cached 30 min). Hollywood's WordPress doesn't have
that endpoint yet, so it falls back to this snapshot: the 12 latest posts from the live homepage, with
images stored locally because Instagram CDN URLs expire. Install the same `aw3/v1/instagram`
endpoint on Hollywood's WordPress (see `.env.example`) and the feed goes live with no code change.

## Enquiry form

The About and Contact pages embed the live site's two-step "Get in touch" form (Gravity Forms **form 3**). It posts
to `/api/enquiry`, which submits to `/wp-json/gf/v2/forms/3/submissions` server-side, as in
allwhitelaser-next. Choice values (help-with, describes-you, country) are always the English values
GF stores; only their labels are translated. Country labels come from `Intl.DisplayNames`,
built on the server so they hydrate cleanly.

Hollywood's WordPress does **not** have the GF REST API enabled yet (`/wp-json/gf/v2/…` is a 404).
Until it is enabled and `GF_CONSUMER_KEY` / `GF_CONSUMER_SECRET` are set (see `.env.example`),
submissions fail and the form shows a "please call us" message. The reCAPTCHA uses the live
form's public key, so `localhost` must be added to its domains for local testing.

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

`about.json` is the live About page text except: the hero's split title, `who.title`,
`who.businesses`, `contact.body` / `callUs` and the eyebrows (new strings); Josefine's job title
(live es/de/ru translated the brand as "Hollywood"); and the live Spanish name "Josefina", kept as
"Josefine". `common.json → enquiryForm` uses the live form labels where they exist; the error,
success and button strings are new.

`contact.json` is the live Contact page text except: the hero title is sentence-cased (live is all
caps) with "in the teeth whitening!" smoothed to "in teeth whitening!" (German shortened to
"Die stärkste Marke" so it fits two lines); `offices.eyebrow`, `intro`, `directions`, `hero.cta`
and `form.eyebrow` are new; the Russian subtitle (live translated the brand as "голливудскую
отбеливающую технологию") and the Spanish quote author ("María") were corrected.
