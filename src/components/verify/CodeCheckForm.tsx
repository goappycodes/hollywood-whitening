"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, RotateCcw, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { VerifyContent } from "@/lib/content";
import { RECAPTCHA_SITE_KEY } from "@/lib/gf-forms";
import { cn } from "@/lib/utils";
import { Recaptcha } from "@/components/site/Recaptcha";

/**
 * One-field code check (machine serial / qualification number) with reCAPTCHA, as on
 * the live Gravity Forms 2 and 1. Posts to /api/machine-authentication/ or
 * /api/qualification-check/ (lib/verify.ts) and swaps the form for the verdict.
 */

type Verdict = "positive" | "negative" | "unknown";

const control =
  "block w-full rounded-xl border border-line bg-pearl px-4 py-3 text-[15px] text-ink placeholder:text-ink/40 transition-colors outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/40";

const VIEW = {
  positive: { Icon: ShieldCheck, badge: "bg-emerald-600", card: "border-emerald-200 bg-emerald-50/60" },
  negative: { Icon: ShieldX, badge: "bg-red-600", card: "border-red-200 bg-red-50/60" },
  unknown: { Icon: ShieldAlert, badge: "bg-amber-500", card: "border-amber-200 bg-amber-50/60" },
} as const;

export function CodeCheckForm({
  endpoint,
  content: t,
  captchaError,
}: {
  endpoint: "/api/machine-authentication/" | "/api/qualification-check/";
  content: VerifyContent;
  captchaError: string;
}) {
  const [code, setCode] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  // Bumped to remount the captcha: a v2 token is single-use.
  const [captchaKey, setCaptchaKey] = useState(0);
  const [error, setError] = useState<{ field?: string; captcha?: string; form?: string }>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ verdict: Verdict; detail: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      field: code.trim() ? undefined : t.errors.empty,
      captcha: RECAPTCHA_SITE_KEY && !token ? captchaError : undefined,
    };
    setError(next);
    if (next.field || next.captcha) return;

    setSending(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), recaptchaToken: token, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; verdict?: Verdict; detail?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error === "captcha" ? { captcha: captchaError } : { form: t.errors.failed });
        resetCaptcha();
        return;
      }
      setResult({ verdict: data.verdict ?? "unknown", detail: data.detail ?? "" });
    } catch {
      setError({ form: t.errors.failed });
      resetCaptcha();
    } finally {
      setSending(false);
    }
  }

  function resetCaptcha() {
    setToken("");
    setCaptchaKey((k) => k + 1);
  }

  function again() {
    setResult(null);
    setCode("");
    setError({});
    resetCaptcha();
  }

  if (result) {
    const { Icon, badge, card } = VIEW[result.verdict];
    const r = t.result;
    const title = { positive: r.positiveTitle, negative: r.negativeTitle, unknown: r.unknownTitle }[result.verdict];
    // A qualification hit carries the certificate's own line (the live page's green text).
    const body =
      result.verdict === "positive" ? result.detail || r.positiveBody : result.verdict === "negative" ? r.negativeBody : r.unknownBody;
    return (
      <div role="status" className={cn("rounded-[var(--radius-card)] border p-6 text-center sm:p-9", card)}>
        <span className={cn("mx-auto grid size-14 place-items-center rounded-full text-white", badge)}>
          <Icon className="size-6" aria-hidden />
        </span>
        <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-muted uppercase">{t.label}</p>
        <p className="mt-1 font-mono text-sm break-all text-ink">{code.trim()}</p>
        <h3 className="mt-4 text-xl font-bold text-balance text-ink">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-balance text-muted">{body}</p>
        <button
          type="button"
          onClick={again}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          <RotateCcw className="size-4" aria-hidden />
          {r.again}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-8"
    >
      {/* honeypot — hidden from people and assistive tech */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <label htmlFor="verify-code" className="mb-1.5 block text-sm font-semibold text-ink">
        {t.label} <span className="text-brand">*</span>
      </label>
      <input
        id="verify-code"
        name="code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (error.field) setError((er) => ({ ...er, field: undefined }));
        }}
        placeholder={t.placeholder}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={100}
        aria-invalid={!!error.field}
        aria-describedby={error.field ? "verify-code-error" : "verify-code-hint"}
        className={control}
      />
      {error.field ? (
        <p id="verify-code-error" className="mt-1.5 text-xs font-medium text-red-600">
          {error.field}
        </p>
      ) : (
        <p id="verify-code-hint" className="mt-1.5 text-xs text-muted">
          {t.hint}
        </p>
      )}

      {RECAPTCHA_SITE_KEY && (
        <div className="mt-4 max-w-full overflow-x-auto sm:mt-5">
          <Recaptcha
            key={captchaKey}
            siteKey={RECAPTCHA_SITE_KEY}
            onToken={(v) => {
              setToken(v);
              if (v) setError((er) => ({ ...er, captcha: undefined }));
            }}
          />
          {error.captcha && <p className="mt-1.5 text-xs font-medium text-red-600">{error.captcha}</p>}
        </div>
      )}

      {error.form && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.form}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 sm:mt-6 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(30_136_229/0.7)] transition-colors hover:bg-brand-deep disabled:opacity-70"
      >
        {sending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {t.checking}
          </>
        ) : (
          <>
            {t.submit}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
