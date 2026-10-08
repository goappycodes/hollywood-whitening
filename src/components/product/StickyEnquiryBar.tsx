"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** id of the in-page price / CTA card; the bar appears once it has scrolled above the screen. */
  ctaId: string;
  /** id of the enquiry form section the bar links to (bar hides while it is on screen). */
  formId: string;
  name: string;
  priceLabel: string;
  cta: string;
  phone: { href: string; label: string };
};

/**
 * Phones/tablets only: a bottom bar repeating the "Register Your Interest" CTA.
 *
 * Hidden on first render. It appears only after the visitor has scrolled the price card
 * up past the top of the screen, and hides again whenever the real CTA, the form or
 * the footer (so it never covers the footer links) is on screen.
 */
export function StickyEnquiryBar({ ctaId, formId, name, priceLabel, cta, phone }: Props) {
  const [ctaPassed, setCtaPassed] = useState(false);
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ctaEl = document.getElementById(ctaId);
    const watched = [document.getElementById(formId), document.querySelector("footer")].filter(
      (el): el is HTMLElement => !!el,
    );
    if (!ctaEl) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === ctaEl) {
          // "Passed" = fully off screen AND above it (not merely not reached yet).
          setCtaPassed(!e.isIntersecting && e.boundingClientRect.top < 0);
          setBlocked((b) => ({ ...b, cta: e.isIntersecting }));
        } else {
          const key = e.target === watched[0] ? "form" : "footer";
          setBlocked((b) => ({ ...b, [key]: e.isIntersecting }));
        }
      }
    });
    io.observe(ctaEl);
    watched.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ctaId, formId]);

  const visible = ctaPassed && !Object.values(blocked).some(Boolean);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out lg:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-[120%]",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2.5 rounded-2xl bg-navy p-2.5 text-white sm:gap-3 sm:pl-4 shadow-[0_-8px_40px_-12px_rgb(5_11_26/0.55)] ring-1 ring-white/10">
        {/* name + price label only where there is room (tablets); phones get a full-width CTA */}
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-sm font-bold">{name}</p>
          <p className="truncate text-xs text-cyan">{priceLabel}</p>
        </div>
        <a
          href={phone.href}
          aria-label={phone.label}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <Phone className="size-4 text-cyan" aria-hidden />
        </a>
        <a
          href={`#${formId}`}
          className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold sm:flex-none shadow-[0_8px_24px_-8px_rgb(30_136_229/0.9)] transition-colors hover:bg-brand-deep"
        >
          <span className="truncate">{cta}</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </a>
      </div>
    </div>
  );
}
