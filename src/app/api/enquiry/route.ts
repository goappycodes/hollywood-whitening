import { NextResponse } from "next/server";
import { submitToGravityForms } from "@/lib/gf";
import {
  GF_ENQUIRY,
  GF_ENQUIRY_CHOICES,
  GF_ENQUIRY_FORM_ID,
  GF_INTEREST,
  GF_INTEREST_CHOICES,
  GF_INTEREST_FORM_ID,
  type EnquiryFormKey,
} from "@/lib/gf-forms";

/**
 * Enquiry submission → Gravity Forms, as allwhitelaser-next's /api/enquiry does.
 * Two forms, picked by `form` (see src/lib/gf-forms.ts):
 *   - `contact`  → form 3 "Get in touch" (About, Contact)
 *   - `interest` → form 7 "Register Your Interest" (product pages)
 * They are separate forms with separate field ids, so the key is explicit.
 * Server-side on purpose: the GF key must never reach the browser.
 */

type Payload = {
  form?: EnquiryFormKey;
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
  howSoon?: string;
  privacy?: boolean;
  sourceUrl?: string;
  gclid?: string;
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

const oneOf = (list: readonly string[], v?: string) => !!v && list.includes(v);

const REQUIRED: Record<EnquiryFormKey, (keyof Payload)[]> = {
  contact: ["firstName", "lastName", "phone", "email", "city", "country", "helpWith", "describes", "message"],
  interest: ["firstName", "lastName", "phone", "email", "city", "country", "describes"],
};

/** Choice fields must carry a value GF stores, or GF rejects the whole entry. */
function choicesValid(form: EnquiryFormKey, b: Payload): boolean {
  if (form === "contact")
    return !!b.privacy && oneOf(GF_ENQUIRY_CHOICES.helpWith, b.helpWith) && oneOf(GF_ENQUIRY_CHOICES.describes, b.describes);
  return (
    oneOf(GF_INTEREST_CHOICES.describes, b.describes) && (!b.howSoon || oneOf(GF_INTEREST_CHOICES.howSoon, b.howSoon))
  );
}

function mapContact(b: Payload): Record<string, string> {
  return {
    [GF_ENQUIRY.firstName]: b.firstName ?? "",
    [GF_ENQUIRY.lastName]: b.lastName ?? "",
    [GF_ENQUIRY.phone]: b.phone ?? "",
    [GF_ENQUIRY.email]: b.email ?? "",
    [GF_ENQUIRY.confirmEmail]: b.email ?? "",
    [GF_ENQUIRY.city]: b.city ?? "",
    [GF_ENQUIRY.country]: b.country ?? "",
    [GF_ENQUIRY.companyName]: b.companyName ?? "",
    [GF_ENQUIRY.helpWith]: b.helpWith ?? "",
    [GF_ENQUIRY.describes]: b.describes ?? "",
    [GF_ENQUIRY.message]: b.message ?? "",
    [GF_ENQUIRY.privacy]: "Accept Privacy Terms",
    [GF_ENQUIRY.sourceUrl]: b.sourceUrl ?? "",
  };
}

function mapInterest(b: Payload): Record<string, string> {
  return {
    [GF_INTEREST.firstName]: b.firstName ?? "",
    [GF_INTEREST.lastName]: b.lastName ?? "",
    [GF_INTEREST.phone]: b.phone ?? "",
    [GF_INTEREST.email]: b.email ?? "",
    [GF_INTEREST.confirmEmail]: b.email ?? "",
    [GF_INTEREST.city]: b.city ?? "",
    [GF_INTEREST.country]: b.country ?? "",
    [GF_INTEREST.describes]: b.describes ?? "",
    [GF_INTEREST.companyName]: b.companyName ?? "",
    [GF_INTEREST.howSoon]: b.howSoon ?? "",
    [GF_INTEREST.gclid]: b.gclid ?? "",
  };
}

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

  const form: EnquiryFormKey = body.form === "interest" ? "interest" : "contact";
  const missing = REQUIRED[form].filter((k) => !String(body[k] ?? "").trim());
  if (missing.length || !choicesValid(form, body)) {
    return NextResponse.json({ ok: false, error: "invalid", missing }, { status: 400 });
  }

  const values = form === "interest" ? mapInterest(body) : mapContact(body);
  // GF's captcha field reads Google's token from this exact key.
  if (body.recaptchaToken) values["g-recaptcha-response"] = body.recaptchaToken;

  const formId = form === "interest" ? GF_INTEREST_FORM_ID : GF_ENQUIRY_FORM_ID;
  let result: Awaited<ReturnType<typeof submitToGravityForms>>;
  try {
    result = await submitToGravityForms(formId, values);
  } catch (err) {
    // Missing GF_* env vars or a network failure.
    console.error("[enquiry] GF unavailable", { form, formId, err });
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  if (!result.ok) {
    console.error("[enquiry] GF submission failed", {
      form,
      formId,
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
