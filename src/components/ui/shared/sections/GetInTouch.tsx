import { Phone, Quote } from "lucide-react";
import type { CommonContent } from "@/lib/content";
import { countryOptions } from "@/lib/gf-countries";
import { LOCALE_META, pageHref, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/Social";
import { EnquiryForm } from "@/components/site/EnquiryForm";

type Props = {
  content: {
    eyebrow: string;
    title: string;
    body?: string;
    /** Shows the phone numbers under this label. */
    callUs?: string;
    quote?: { text: string; author: string };
  };
  common: CommonContent;
  locale: Locale;
};

/**
 * Navy band with the live site's form 3 enquiry wizard ("Get in touch" on About,
 * "Contact Us" on Contact). The left column carries the intro plus phones or a quote.
 */
export function GetInTouch({ content, common, locale }: Props) {
  return (
    <section
      id="get-in-touch"
      className="relative isolate scroll-mt-24 overflow-hidden bg-navy py-16 text-white sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[34rem] rounded-full bg-brand/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-cyan/10 blur-[120px]"
      />

      <div className="container-x relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="lg:pt-6">
          <p className="eyebrow text-brand-glow">
            <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[1.9rem] leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl">
            {content.title}
          </h2>
          {content.body && (
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">{content.body}</p>
          )}

          {content.quote && (
            <figure className="glass-dark mt-8 max-w-md rounded-2xl p-6">
              <Quote className="size-6 -scale-x-100 fill-cyan text-cyan" aria-hidden />
              <blockquote className="mt-3 text-lg leading-snug font-light text-white sm:text-xl">
                {content.quote.text}
              </blockquote>
              <figcaption className="mt-4 font-script text-2xl text-cyan">{content.quote.author}</figcaption>
            </figure>
          )}

          {content.callUs && (
            <>
              <p className="mt-9 text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">{content.callUs}</p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {SITE.phones.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      className="glass-dark group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors hover:bg-white/10"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white">
                        <Phone className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold tracking-[0.16em] text-cyan uppercase">
                          {p.label}
                        </span>
                        <span className="block text-sm font-semibold whitespace-nowrap">{p.display}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          <SocialLinks className="mt-7" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[1.75rem] bg-white p-5 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:p-8">
            <EnquiryForm
              t={common.enquiryForm}
              countries={countryOptions(LOCALE_META[locale].htmlLang)}
              privacyHref={pageHref(locale, "privacy")}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
