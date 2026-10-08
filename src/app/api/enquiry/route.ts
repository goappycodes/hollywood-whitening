import { NextResponse } from "next/server";
import { submitToGravityForms } from "@/lib/gf";
import { GF_ENQUIRY, GF_ENQUIRY_CHOICES, GF_ENQUIRY_FORM_ID } from "@/lib/gf-forms";

/**
 * Enquiry submission → Gravity Forms form 3 ("Get in touch"), as allwhitelaser-next's
 * /api/enquiry does for its forms. Server-side on purpose: the GF key must never
 * reach the browser.
 */

type Payload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  companyName?: string;
  helpWith?: string;
  describes?: string;
  message?: string;
  privacy?: boolean;
  sourceUrl?: string;
  recaptchaToken?: string;
  /** Honeypot — real users never see it. */
  website?: string;
};

/** Per-instance rate limit; the browser captcha is not enough once we post server-side. */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const REQUIRED: (keyof Payload)[] = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "city",
  "country",
  "helpWith",
  "describes",
  "message",
];

const oneOf = (list: readonly string[], v?: string) => !!v && list.includes(v);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: pretend success so a bot learns nothing, but post nothing.
  if (body.website) return NextResponse.json({ ok: true, skipped: true });

  const missing = REQUIRED.filter((k) => !String(body[k] ?? "").trim());
  if (
    missing.length ||
    !body.privacy ||
    !oneOf(GF_ENQUIRY_CHOICES.helpWith, body.helpWith) ||
    !oneOf(GF_ENQUIRY_CHOICES.describes, body.describes)
  ) {
    return NextResponse.json({ ok: false, error: "invalid", missing }, { status: 400 });
  }

  const values: Record<string, string> = {
    [GF_ENQUIRY.firstName]: body.firstName ?? "",
    [GF_ENQUIRY.lastName]: body.lastName ?? "",
    [GF_ENQUIRY.phone]: body.phone ?? "",
    [GF_ENQUIRY.email]: body.email ?? "",
    [GF_ENQUIRY.confirmEmail]: body.email ?? "",
    [GF_ENQUIRY.city]: body.city ?? "",
    [GF_ENQUIRY.country]: body.country ?? "",
    [GF_ENQUIRY.companyName]: body.companyName ?? "",
    [GF_ENQUIRY.helpWith]: body.helpWith ?? "",
    [GF_ENQUIRY.describes]: body.describes ?? "",
    [GF_ENQUIRY.message]: body.message ?? "",
    [GF_ENQUIRY.privacy]: "Accept Privacy Terms",
    [GF_ENQUIRY.sourceUrl]: body.sourceUrl ?? "",
  };
  // GF's captcha field reads Google's token from this exact key.
  if (body.recaptchaToken) values["g-recaptcha-response"] = body.recaptchaToken;

  let result: Awaited<ReturnType<typeof submitToGravityForms>>;
  try {
    result = await submitToGravityForms(GF_ENQUIRY_FORM_ID, values);
  } catch (err) {
    // Missing GF_* env vars or a network failure.
    console.error("[enquiry] GF unavailable", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  if (!result.ok) {
    console.error("[enquiry] GF submission failed", {
      status: result.status,
      message: result.message,
      validation: result.validation,
    });
    return NextResponse.json(
      { ok: false, error: result.status === 422 ? "rejected" : "unavailable" },
      { status: result.status === 422 ? 422 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
