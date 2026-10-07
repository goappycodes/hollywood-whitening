#!/usr/bin/env node
/**
 * Snapshots the Instagram feed shown on the live WordPress homepage (Smash Balloon
 * "Instagram Feed Pro") into src/content/instagram.json + public/images/instagram/.
 *
 * Instagram CDN image URLs are signed and expire within days, so images are downloaded
 * and served locally; posts link out to instagram.com. Re-run to refresh the feed:
 *
 *   node scripts/instagram-snapshot.mjs
 *
 * A live feed would need an Instagram Graph API token from the client's Meta account;
 * src/content/instagram.json is the seam to replace if that is added later.
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = "https://www.hollywoodwhitening.com/";
const ROOT = path.resolve(import.meta.dirname, "..");
const IMG_DIR = path.join(ROOT, "public/images/instagram");
const OUT = path.join(ROOT, "src/content/instagram.json");
const UA = { "user-agent": "Mozilla/5.0" };

const decode = (s) =>
  s
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;br&gt;/g, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const html = await (await fetch(SOURCE, { headers: UA })).text();

// Profile stats from the feed header.
// Spans contain an icon <svg> before the number, so strip tags before reading.
const pick = (re) =>
  decode((html.match(re)?.[1] ?? "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, "")).trim();
const profile = {
  handle: pick(/<div class="sbi_header_text">\s*<h3[^>]*>([\s\S]*?)<\/h3>/),
  posts: pick(/class="sbi_posts_count"[^>]*>([\s\S]*?)<\/span>/),
  followers: pick(/class="sbi_followers"[^>]*>([\s\S]*?)<\/span>/),
};

// One block per post: <div class="sbi_item sbi_type_…" id="sbi_<id>" data-date="…"> … </div>
const blocks = html.split(/<div class="sbi_item /).slice(1);
const items = [];
for (const block of blocks) {
  const url = block.match(/<a class="sbi_photo" href="([^"]+)"/)?.[1];
  if (!url) continue;
  const shortcode = url.match(/\/(?:p|reel|tv)\/([^/]+)\//)?.[1];
  if (!shortcode || items.some((i) => i.shortcode === shortcode)) continue;
  const type = block.match(/^sbi_type_(\w+)/)?.[1] ?? "image"; // image | video | carousel
  const fullRes = decode(block.match(/data-full-res="([^"]+)"/)?.[1] ?? "");
  const caption = decode(block.match(/<img[^>]*alt="([^"]*)"/)?.[1] ?? "").trim();
  const date = Number(block.match(/data-date="(\d+)"/)?.[1] ?? 0);
  items.push({ shortcode, url, type: type === "video" ? "reel" : type, caption, date, fullRes });
}

if (!items.length) throw new Error("No Instagram posts found — has the live feed markup changed?");

await mkdir(IMG_DIR, { recursive: true });
for (const f of await readdir(IMG_DIR)) await rm(path.join(IMG_DIR, f)); // drop stale images

const feed = { profile, items: [] };
for (const item of items.slice(0, 12)) {
  // Stable endpoint first (640px+), signed CDN URL as fallback.
  let res = await fetch(`https://www.instagram.com/p/${item.shortcode}/media?size=l`, { headers: UA });
  if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) res = await fetch(item.fullRes, { headers: UA });
  if (!res.ok) {
    console.warn(`! skipped ${item.shortcode} (${res.status})`);
    continue;
  }
  const file = `${item.shortcode}.jpg`;
  await writeFile(path.join(IMG_DIR, file), Buffer.from(await res.arrayBuffer()));
  feed.items.push({
    shortcode: item.shortcode,
    url: item.url,
    type: item.type,
    image: `/images/instagram/${file}`,
    caption: item.caption,
    date: new Date(item.date * 1000).toISOString().slice(0, 10),
  });
  console.log(`✓ ${item.shortcode} (${item.type})`);
}

await writeFile(OUT, JSON.stringify(feed, null, 2) + "\n");
console.log(`→ ${path.relative(ROOT, OUT)}: ${feed.items.length} posts, @${profile.handle}, ${profile.followers} followers`);
