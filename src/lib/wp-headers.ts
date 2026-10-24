/**
 * Headers for every server-side request to the WordPress backend (Gravity Forms,
 * store feed, Instagram) — as allwhitelaser-next's lib/wp-headers.ts. Server-only:
 * they carry secrets.
 *
 *   - User-Agent: Cloudflare on shop.hollywoodwhitening.com answers 403 to requests
 *     without one.
 *   - X-HW-Origin-Token (WP_ORIGIN_TOKEN): Cloudflare serves its "Just a moment…"
 *     challenge to requests from Vercel's servers, which a server can't solve. A
 *     Cloudflare custom rule that skips the challenge when this header matches lets
 *     only this app through, without opening the API paths to every bot.
 *   - Authorization (WP_BASIC_AUTH_USER/PASS): the nginx gate in front of a staging WP.
 */
export function wpServerHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "User-Agent": "HollywoodWhitening-Next/1.0" };

  const token = process.env.WP_ORIGIN_TOKEN;
  if (token) headers["X-HW-Origin-Token"] = token;

  const user = process.env.WP_BASIC_AUTH_USER;
  const pass = process.env.WP_BASIC_AUTH_PASS;
  if (user && pass) headers.Authorization = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  return headers;
}
