/**
 * Instagram client — same contract as allwhitelaser-next's lib/instagram.ts.
 *
 * Reads the WordPress custom endpoint `aw3/v1/instagram`, which surfaces the REAL
 * posts the site's Instagram Feed Pro (Smash Balloon) plugin has cached. Server-only:
 * a staging WP behind nginx basic auth needs credentials that must never reach the
 * browser.
 *
 * Hollywood's WordPress does not expose this endpoint yet — until it does (same
 * endpoint plugin as allwhitelaser), this returns [] and InstagramFeed falls back to
 * the snapshot in src/content/instagram.json (scripts/instagram-snapshot.mjs).
 *
 * Caching: Cache Components is enabled here, so instead of allwhitelaser's
 * `fetch(..., { next: { revalidate } })` the function is a `"use cache"` scope with a
 * 30-minute revalidate — the result stays part of the static prerender.
 */
import { cacheLife } from "next/cache";

const PUBLIC_MEDIA = (process.env.WP_PUBLIC_MEDIA_URL || "").replace(/\/+$/, "");

export type InstagramPost = {
  id: string;
  permalink: string;
  image: string;
  caption: string;
  type: string;
};

type RawResponse = {
  ok?: boolean;
  posts?: Array<{ id: string; permalink: string; image: string; caption?: string; type?: string }>;
};

function wpBase(): string | null {
  const v = process.env.NEXT_PUBLIC_WP_URL;
  return v ? v.replace(/\/+$/, "") : null;
}

/** nginx basic-auth gate in front of staging (absent in production). */
function gateHeaders(): Record<string, string> {
  const user = process.env.WP_BASIC_AUTH_USER;
  const pass = process.env.WP_BASIC_AUTH_PASS;
  if (!user || !pass) return {};
  return { Authorization: "Basic " + Buffer.from(`${user}:${pass}`).toString("base64") };
}

/**
 * The renderable image URL for a post. Instagram's scontent URLs block hotlinking and
 * expire, so rebuild the plugin's locally cached copy ("{basename}full.jpg").
 */
function displayImage(url: string, base: string): string {
  if (/cdninstagram\.com|scontent/i.test(url)) {
    const file = (url.split("?")[0].split("/").pop() || "").replace(/\.(jpe?g|png|webp)$/i, "");
    const host = PUBLIC_MEDIA || `${base}/wp-content/uploads`;
    if (file) return `${host}/sb-instagram-feed-images/${file}full.jpg`;
  }
  return url;
}

export async function getInstagramPosts(limit = 12): Promise<InstagramPost[]> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 86400 }); // refresh every 30 min

  const base = wpBase();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/wp-json/aw3/v1/instagram?limit=${limit}`, { headers: gateHeaders() });
    if (!res.ok) return [];
    const data = (await res.json()) as RawResponse;
    if (!data?.ok || !Array.isArray(data.posts)) return [];
    return data.posts
      .filter((p) => p.image && p.permalink)
      .map((p) => ({
        id: p.id,
        permalink: p.permalink,
        image: displayImage(p.image, base),
        caption: (p.caption ?? "").trim(),
        type: p.type ?? "IMAGE",
      }));
  } catch {
    return [];
  }
}
