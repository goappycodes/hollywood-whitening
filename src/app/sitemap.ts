import type { MetadataRoute } from "next";
import { absoluteUrl, BUILT_PAGES, languageAlternates, LOCALES } from "@/lib/i18n";

// Every built page in every locale, each with its full hreflang set.
export default function sitemap(): MetadataRoute.Sitemap {
  return BUILT_PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(locale, page),
      changeFrequency: "weekly" as const,
      priority: page === "home" ? 1 : 0.7,
      alternates: { languages: languageAlternates(page) },
    })),
  );
}
