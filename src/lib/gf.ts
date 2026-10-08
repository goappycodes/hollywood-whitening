import crypto from "node:crypto";

/**
 * Server-only Gravity Forms REST v2 client (as in allwhitelaser-next).
 *
 * Never import this from a client component — it reads the API secret.
 *
 * Auth is OAuth 1.0a (signed query string) rather than Basic, so the single
 * `Authorization` header stays free for an nginx basic-auth gate on staging.
 *
 * Posts to `/submissions` (not `/entries`): only `/submissions` runs validation,
 * notifications and feeds, so the lead actually reaches someone.
 *
 * Needs the GF REST API enabled on Hollywood's WordPress (Forms → Settings → REST
 * API) and a key in GF_CONSUMER_KEY / GF_CONSUMER_SECRET. Until then every
 * submission fails and the form shows its "call us" fallback.
 */

const rfc3986 = (s: string) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/** Signs a URL with OAuth 1.0a (HMAC-SHA1), the scheme GF v2 expects. */
function signUrl(method: string, url: string): string {
  const params: Record<string, string> = {
    oauth_consumer_key: env("GF_CONSUMER_KEY"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(8).toString("hex"),
  };
  const normalised = Object.keys(params)
    .sort()
    .map((k) => `${rfc3986(k)}=${rfc3986(params[k])}`)
    .join("&");
  const base = [method.toUpperCase(), rfc3986(url), rfc3986(normalised)].join("&");
  const signature = crypto
    .createHmac("sha1", `${env("GF_CONSUMER_SECRET")}&`)
    .update(base)
    .digest("base64");
  return `${url}?${normalised}&oauth_signature=${rfc3986(signature)}`;
}

/** The nginx gate in front of staging. Absent in production, so this is optional. */
function gateHeaders(): Record<string, string> {
  const user = process.env.WP_BASIC_AUTH_USER;
  const pass = process.env.WP_BASIC_AUTH_PASS;
  if (!user || !pass) return {};
  return { Authorization: "Basic " + Buffer.from(`${user}:${pass}`).toString("base64") };
}

function apiBase(): string {
  // GF_API_URL may already include /wp-json/gf/v2 — normalise either form.
  const raw = env("GF_API_URL").replace(/\/+$/, "");
  return /\/wp-json\/gf\/v2$/.test(raw) ? raw : `${raw}/wp-json/gf/v2`;
}

export type GfSubmitResult =
  | { ok: true; entryId: string; confirmation?: string }
  | { ok: false; status: number; validation?: Record<string, string>; message: string };

/**
 * POST a submission to GF. `values` keys are GF input names (`input_5`,
 * `input_1.3`, `input_3.6` …) — they must match the form's field ids exactly or
 * the theme hooks and the Salesforce field mapping break silently.
 */
export async function submitToGravityForms(formId: string | number, values: Record<string, string>): Promise<GfSubmitResult> {
  const url = `${apiBase()}/forms/${formId}/submissions`;
  const res = await fetch(signUrl("POST", url), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...gateHeaders() },
    body: JSON.stringify(values),
    cache: "no-store",
    // A confirmation set to "redirect" answers 302, not JSON; following it would fetch
    // the thank-you page and look like a failure although the entry was saved.
    redirect: "manual",
  });

  // 3xx == accepted: GF ran validation, saved the entry and fired its feeds,
  // then answered with the confirmation redirect. There is no entry id in it.
  if (res.status >= 300 && res.status < 400) {
    return { ok: true, entryId: "", confirmation: res.headers.get("location") ?? undefined };
  }

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    // nginx 401/502s return HTML, not JSON — surface something readable.
    return { ok: false, status: res.status, message: `Non-JSON response from GF (${res.status}): ${text.slice(0, 120)}` };
  }

  const body = json as {
    is_valid?: boolean;
    validation_messages?: Record<string, string>;
    entry_id?: number | string;
    confirmation_message?: string;
    message?: string;
    code?: string;
  };

  // GF answers 200 with is_valid:false when a field fails validation.
  if (body.is_valid === false) {
    return { ok: false, status: 422, validation: body.validation_messages ?? {}, message: "Validation failed" };
  }
  if (!res.ok) {
    return { ok: false, status: res.status, message: body.message ?? `GF error ${res.status}` };
  }
  if (!body.entry_id) {
    return { ok: false, status: res.status, message: body.message ?? "GF accepted the request but returned no entry_id" };
  }

  return { ok: true, entryId: String(body.entry_id), confirmation: body.confirmation_message };
}
