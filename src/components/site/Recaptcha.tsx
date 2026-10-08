"use client";

/**
 * reCAPTCHA v2 ("I'm not a robot") widget.
 *
 * Gravity Forms form 3 ("Get in touch") carries a captcha field (id 19). GF verifies the token
 * server-side against Google using the secret in its own settings, so this
 * component only needs the PUBLIC site key — never the secret.
 *
 * The site key is the one the live WordPress form renders, so the token is
 * valid for the same Google project. Note Google binds tokens to the domains
 * registered against that key: `localhost` must be added in the reCAPTCHA admin
 * console for this to verify in development.
 *
 * Renders explicitly (not auto) so the widget can live inside the wizard's last
 * step and be reset after a failed submit — a v2 token is single-use.
 */

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void }) => number;
      reset: (id?: number) => void;
      ready: (cb: () => void) => void;
    };
    __recaptchaLoading?: Promise<void>;
  }
}

const SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.render) return Promise.resolve();
  if (window.__recaptchaLoading) return window.__recaptchaLoading;
  window.__recaptchaLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(s);
  });
  return window.__recaptchaLoading;
}

export function Recaptcha({
  siteKey,
  onToken,
}: {
  siteKey: string;
  /** Fires with the token when solved, and with "" when it expires. */
  onToken: (token: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !box.current || widgetId.current !== null) return;
        window.grecaptcha?.ready(() => {
          if (cancelled || !box.current || widgetId.current !== null) return;
          widgetId.current = window.grecaptcha!.render(box.current, {
            sitekey: siteKey,
            callback: (t) => onToken(t),
            "expired-callback": () => onToken(""),
          });
        });
      })
      .catch(() => onToken(""));
    return () => {
      cancelled = true;
    };
    // Mount once — re-rendering would duplicate the widget.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={box} className="min-h-[78px]" />;
}
