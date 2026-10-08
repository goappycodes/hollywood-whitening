"use client";

/**
 * "Get in touch" enquiry form — a 2-step wizard over Gravity Forms **form 3**, the
 * form the live /about-us/ page embeds. The step split matches the live form's page
 * break (fields 1–21 | 20 onwards). Pattern follows allwhitelaser-next's EnquiryForm.
 *
 * Posts friendly field names to /api/enquiry, which maps them to GF ids server-side
 * (the API key never reaches the browser). Choice values are always the English GF
 * values; only their labels are localised.
 */

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { fill, type EnquiryFormContent } from "@/lib/content";
import type { CountryOption } from "@/lib/gf-countries";
import { GF_ENQUIRY_CHOICES, RECAPTCHA_SITE_KEY } from "@/lib/gf-forms";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Recaptcha } from "./Recaptcha";

type Field =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "confirmEmail"
  | "city"
  | "country"
  | "companyName"
  | "helpWith"
  | "describes"
  | "message";

type Values = Record<Field, string>;
type Errors = Partial<Record<Field | "privacy" | "captcha", string>>;

const STEPS: { fields: Field[]; required: Field[] }[] = [
  {
    fields: ["firstName", "lastName", "phone", "email", "confirmEmail", "city", "country", "companyName", "helpWith"],
    required: ["firstName", "lastName", "phone", "email", "confirmEmail", "city", "country", "helpWith"],
  },
  { fields: ["describes", "message"], required: ["describes", "message"] },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY: Values = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  confirmEmail: "",
  city: "",
  country: "",
  companyName: "",
  helpWith: GF_ENQUIRY_CHOICES.helpWith[0],
  describes: "",
  message: "",
};

const control =
  "block w-full rounded-xl border border-line bg-pearl px-4 py-3 text-[15px] text-ink placeholder:text-ink/40 transition-colors outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/40";

type Props = {
  t: EnquiryFormContent;
  /** From countryOptions() on the server — English GF values, localised labels. */
  countries: CountryOption[];
  privacyHref: string;
};

export function EnquiryForm({ t, countries, privacyHref }: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [privacy, setPrivacy] = useState(false);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function validate(i: number): Errors {
    const next: Errors = {};
    for (const f of STEPS[i].required) if (!values[f].trim()) next[f] = t.errors.required;
    if (i === 0) {
      if (values.email && !EMAIL_RE.test(values.email.trim())) next.email = t.errors.email;
      if (values.confirmEmail && values.confirmEmail.trim().toLowerCase() !== values.email.trim().toLowerCase())
        next.confirmEmail = t.errors.emailMatch;
    }
    if (i === 1) {
      if (!privacy) next.privacy = t.errors.privacy;
      if (RECAPTCHA_SITE_KEY && !token) next.captcha = t.errors.captcha;
    }
    return next;
  }

  /** Shows errors and moves focus to the first invalid control. */
  function report(next: Errors) {
    setErrors(next);
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    });
  }

  function goNext() {
    const next = validate(0);
    if (Object.keys(next).length) return report(next);
    setErrors({});
    setStep(1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 0) return goNext();
    const next = validate(1);
    if (Object.keys(next).length) return report(next);

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          privacy,
          recaptchaToken: token,
          website: honeypot,
          sourceUrl: window.location.href,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-ink">{t.successTitle}</h3>
        <p className="mt-2 max-w-sm text-muted">{t.successBody}</p>
      </div>
    );
  }

  const err = (f: keyof Errors) => errors[f];
  const field = (f: Field) => ({
    id: `enq-${f}`,
    name: f,
    value: values[f],
    onChange: set(f),
    "aria-invalid": !!errors[f],
    "aria-describedby": errors[f] ? `enq-${f}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="scroll-mt-28">
      {/* progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">
          {fill(t.step, { n: step + 1, total: STEPS.length })}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <span key={i} className={cn("h-1.5 w-8 rounded-full transition-colors", i <= step ? "bg-brand" : "bg-line")} />
          ))}
        </div>
      </div>

      {/* honeypot — hidden from people and assistive tech */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      {step === 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Row label={t.firstName} htmlFor="enq-firstName" error={err("firstName")} errorId="enq-firstName-error">
            <input {...field("firstName")} autoComplete="given-name" className={control} />
          </Row>
          <Row label={t.lastName} htmlFor="enq-lastName" error={err("lastName")} errorId="enq-lastName-error">
            <input {...field("lastName")} autoComplete="family-name" className={control} />
          </Row>
          <Row label={t.email} htmlFor="enq-email" error={err("email")} errorId="enq-email-error">
            <input {...field("email")} type="email" autoComplete="email" className={control} />
          </Row>
          <Row label={t.confirmEmail} htmlFor="enq-confirmEmail" error={err("confirmEmail")} errorId="enq-confirmEmail-error">
            <input {...field("confirmEmail")} type="email" autoComplete="email" className={control} />
          </Row>
          <Row label={t.phone} htmlFor="enq-phone" error={err("phone")} errorId="enq-phone-error">
            <input {...field("phone")} type="tel" autoComplete="tel" className={control} />
          </Row>
          <Row
            label={
              <>
                {t.companyName} <span className="font-normal text-muted">({t.optional})</span>
              </>
            }
            htmlFor="enq-companyName"
            required={false}
          >
            <input {...field("companyName")} autoComplete="organization" className={control} />
          </Row>
          <Row label={t.city} htmlFor="enq-city" error={err("city")} errorId="enq-city-error">
            <input {...field("city")} autoComplete="address-level2" className={control} />
          </Row>
          <Row label={t.country} htmlFor="enq-country" error={err("country")} errorId="enq-country-error">
            <select {...field("country")} autoComplete="country-name" className={cn(control, "appearance-none pr-10 select-chevron")}>
              <option value="" disabled>
                {t.countryPlaceholder}
              </option>
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Row>

          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-semibold text-ink">
              {t.helpWith} <span className="text-brand">*</span>
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {GF_ENQUIRY_CHOICES.helpWith.map((value, i) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-pearl px-4 py-3 text-sm font-medium text-ink transition-colors has-checked:border-brand has-checked:bg-brand-sky/60 has-focus-visible:ring-4 has-focus-visible:ring-brand/15"
                >
                  <input
                    type="radio"
                    name="helpWith"
                    value={value}
                    checked={values.helpWith === value}
                    onChange={set("helpWith")}
                    className="size-4 shrink-0 accent-brand"
                  />
                  {t.helpWithChoices[i]}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          <Row label={t.describes} htmlFor="enq-describes" error={err("describes")} errorId="enq-describes-error">
            <select {...field("describes")} className={cn(control, "appearance-none pr-10 select-chevron")}>
              <option value="" disabled>
                {t.select}
              </option>
              {GF_ENQUIRY_CHOICES.describes.map((value, i) => (
                <option key={value} value={value}>
                  {t.describesChoices[i]}
                </option>
              ))}
            </select>
          </Row>
          <Row label={t.message} htmlFor="enq-message" error={err("message")} errorId="enq-message-error">
            <textarea {...field("message")} rows={4} placeholder={t.messagePlaceholder} className={cn(control, "resize-y")} />
          </Row>

          <div>
            <p className="text-xs leading-relaxed text-muted">
              {t.privacyLead}{" "}
              <Link href={privacyHref} className="font-semibold text-brand underline-offset-2 hover:underline">
                {t.privacyLink}
              </Link>
              .
            </p>
            <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={privacy}
                onChange={(e) => {
                  setPrivacy(e.target.checked);
                  setErrors((er) => ({ ...er, privacy: undefined }));
                }}
                aria-invalid={!!errors.privacy}
                aria-describedby={errors.privacy ? "enq-privacy-error" : undefined}
                className="size-4.5 shrink-0 rounded accent-brand"
              />
              <span>
                {t.privacyAccept} <span className="text-brand">*</span>
              </span>
            </label>
            <FieldError id="enq-privacy-error" message={errors.privacy} />
          </div>

          {RECAPTCHA_SITE_KEY && (
            <div className="max-w-full overflow-x-auto">
              <Recaptcha
                siteKey={RECAPTCHA_SITE_KEY}
                onToken={(v) => {
                  setToken(v);
                  if (v) setErrors((er) => ({ ...er, captcha: undefined }));
                }}
              />
              <FieldError id="enq-captcha-error" message={errors.captcha} />
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {fill(t.errors.failed, { phone: SITE.phones[0].display })}
        </p>
      )}

      <div className="mt-7 grid gap-2.5 sm:flex sm:items-center sm:justify-between">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setStep(0);
            }}
            className="order-2 inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink sm:order-1"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t.previous}
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="group order-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(30_136_229/0.7)] transition-colors hover:bg-brand-deep disabled:opacity-70 sm:order-2"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t.sending}
            </>
          ) : (
            <>
              {step === 0 ? t.next : t.send}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Row({
  label,
  htmlFor,
  error,
  errorId,
  required = true,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  errorId?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {errorId && <FieldError id={errorId} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}
