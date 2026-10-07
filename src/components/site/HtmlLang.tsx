"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOCALE_META, resolvePathname } from "@/lib/i18n";

/**
 * Keeps `<html lang>` in sync with the URL's locale (as in allwhitelaser-next).
 *
 * The root layout sits above the [[...lang]] segment, so it can't know the locale
 * without going dynamic. SSR stays `en-GB`; this corrects it on load and on every
 * client-side navigation. Localised content is also wrapped in `<div lang>`, so it
 * carries the right language even before hydration.
 */
export function HtmlLang() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = LOCALE_META[resolvePathname(pathname ?? "/").locale].htmlLang;
  }, [pathname]);
  return null;
}
