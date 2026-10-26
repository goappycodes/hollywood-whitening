import { NextResponse } from "next/server";
import { submitToGravityForms } from "@/lib/gf";
import { GF_MACHINE_AUTH_FORM_ID, GF_QUAL_CHECK_FORM_ID, GF_VERIFY_CODE_FIELD, RECAPTCHA_SITE_KEY } from "@/lib/gf-forms";
import { wpServerHeaders } from "@/lib/wp-headers";

/**
 * Server side of the two code checks (/machine-authentication/, /qualification-check/),
 * shared by /api/machine-authentication and /api/qualification-check.
 *
 * Each submit does two things, as the WordPress page does:
 *   1. VERDICT: asks Hollywood's WordPress (hollywood-wp custom/verify-api.php,
 *      aw3/v1/machine-authentication | qualification-check), which runs the same
 *      table lookups as the live `[auth_result]` / `[qual_result]` shortcodes.
 *   2. RECORD: posts the code to the page's Gravity Form (2 / 1), so checks keep
 *      appearing as entries. Best-effort: GF's REST API is still disabled on
 *      Hollywood's WordPress, and a logging failure must not hide the verdict.
 *
 * Server-only (reads the GF secret and the WP host).
 */

export type VerifyKind = "machine" | "qualification";
export type Verdict = "positive" | "negative" | "unknown";

const ROUTE: Record<VerifyKind, string> = {
  machine: "aw3/v1/machine-authentication",
  qualification: "aw3/v1/qualification-check",
};
const FORM_ID: Record<VerifyKind, number> = { machine: GF_MACHINE_AUTH_FORM_ID, qualification: GF_QUAL_CHECK_FORM_ID };
const MAX_CODE_LENGTH = 100;

/** Same host as the blog API (lib/blog.ts): WP_API_URL, else NEXT_PUBLIC_WP_URL, else www. */
function wpBase(): string {
  return (process.env.WP_API_URL || process.env.NEXT_PUBLIC_WP_URL || "https://www.hollywoodwhitening.com").replace(/\/+$/, "");
}

/** `?rest_route=` rather than `/wp-json/…`, which answers a Cloudflare 502 on shop. */
async function lookup(kind: VerifyKind, code: string): Promise<{ verdict: Verdict; detail: string }> {
  const url = `${wpBase()}/?rest_route=/${ROUTE[kind]}&code=${encodeURIComponent(code)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...wpServerHeaders() },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[verify:${kind}] WordPress answered ${res.status}`);
      return { verdict: "unknown", detail: "" };
    }
    const data = (await res.json()) as { genuine?: boolean; qualified?: boolean; detail?: string };
    const yes = kind === "machine" ? data.genuine : data.qualified;
    if (typeof yes !== "boolean") return { verdict: "unknown", detail: "" };
    return { verdict: yes ? "positive" : "negative", detail: (data.detail ?? "").trim().slice(0, 300) };
  } catch (err) {
    console.error(`[verify:${kind}] lookup failed`, err);
    return { verdict: "unknown", detail: "" };
  }
}

async function record(kind: VerifyKind, code: string, token: string): Promise<void> {
  try {
    const values: Record<string, string> = { [GF_VERIFY_CODE_FIELD]: code };
    // GF's captcha field reads Google's token from this exact key.
    if (token) values["g-recaptcha-response"] = token;
    const result = await submitToGravityForms(FORM_ID[kind], values);
    if (!result.ok) console.error(`[verify:${kind}] GF record failed`, { status: result.status, message: result.message });
  } catch (err) {
    console.error(`[verify:${kind}] GF unavailable (record skipped)`, err);
  }
}

/** Per-instance rate limit — the lookup is public, so slow down anyone walking the tables. */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

type Payload = { code?: string; recaptchaToken?: string; website?: string };

/** POST handler body for both routes. Errors are codes; the form shows its own localised text. */
export async function handleVerify(req: Request, kind: VerifyKind): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(`${kind}:${ip}`)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: answer like a miss so a bot learns nothing, and look nothing up.
  if (body.website) return NextResponse.json({ ok: true, verdict: "unknown", detail: "" });

  const code = (body.code ?? "").trim();
  if (!code || code.length > MAX_CODE_LENGTH) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const token = (body.recaptchaToken ?? "").trim();
  if (RECAPTCHA_SITE_KEY && !token) return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });

  const [{ verdict, detail }] = await Promise.all([lookup(kind, code), record(kind, code, token)]);
  return NextResponse.json({ ok: true, verdict, detail });
}
