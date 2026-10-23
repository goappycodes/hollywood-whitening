/**
 * Headers for every server-side request this app makes to the WordPress host —
 * same as allwhitelaser-next's lib/wp-headers.ts.
 *
 * - Basic auth for the nginx gate in front of staging (WP_BASIC_AUTH_USER/PASS).
 *   Absent in production, so nothing is sent there.
 * - `X-AWL-Internal` (WP_INTERNAL_KEY): lets the WordPress server exempt this app
 *   from per-IP rate limiting / firewall rules. Every visitor's blog request reaches
 *   WordPress from the app's few egress IPs, so the app is recognised by this secret
 *   instead of by address. Unset → not sent.
 */
export function wpServerHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const user = process.env.WP_BASIC_AUTH_USER;
  const pass = process.env.WP_BASIC_AUTH_PASS;
  if (user && pass) headers.Authorization = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  if (process.env.WP_INTERNAL_KEY) headers["X-AWL-Internal"] = process.env.WP_INTERNAL_KEY;
  return headers;
}
