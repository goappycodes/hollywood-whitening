import { NextResponse, type NextRequest } from "next/server";

/**
 * Sends WooCommerce-only product links on to WordPress.
 *
 * Product pages here are enquiry-led (no price or basket), like allwhitelaser-next.
 * Buying happens on WordPress: staff send customers a product link carrying a POA
 * parameter, and the `poa_url` plugin then shows that customer's price and an
 * add-to-cart. The plugin treats ANY query key containing "poa" as a POA link
 * (`?poa=…`, `?rent_poa=…`), so the same test is used here; `?add-to-cart=` and
 * WooCommerce's `wc-*` actions are cart operations. allwhitelaser keeps such links
 * on the shop host when rewriting content; this also catches a link that is pasted
 * with the frontend's domain.
 *
 * Target: NEXT_PUBLIC_WP_URL (the WordPress origin). If that is this same origin —
 * e.g. while WordPress still serves www.hollywoodwhitening.com — nothing is
 * redirected, to avoid a loop.
 */

const WP_URL = (process.env.NEXT_PUBLIC_WP_URL || "https://www.hollywoodwhitening.com").replace(/\/+$/, "");

const isWooOnlyKey = (key: string) => {
  const k = key.toLowerCase();
  return k.includes("poa") || k === "add-to-cart" || k.startsWith("wc-");
};

export function proxy(req: NextRequest) {
  const keys = [...req.nextUrl.searchParams.keys()];
  if (!keys.some(isWooOnlyKey)) return NextResponse.next();

  const incoming = new URL(req.url);
  const target = new URL(`${WP_URL}${incoming.pathname}${incoming.search}`);
  if (target.origin === incoming.origin) return NextResponse.next();

  return NextResponse.redirect(target, 307);
}

export const config = {
  // Product pages only: /product/… and the localised /es/producto/…, /de/produkt/…, /ru/product/….
  matcher: ["/product/:path*", "/:locale(es|de|ru)/product/:path*", "/:locale(es|de|ru)/producto/:path*", "/:locale(es|de|ru)/produkt/:path*"],
};
