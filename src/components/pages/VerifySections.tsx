import type { ReactNode } from "react";
import { BadgeCheck, GraduationCap, MessageCircle, ShieldCheck } from "lucide-react";
import { getCommonContent, getVerifyContent, type VerifyPage } from "@/lib/content";
import { absoluteUrl, LOCALE_META, pageHref, type Locale, type PageKey } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { CompactHero } from "@/components/ui/shared/sections/CompactHero";
import { CodeCheckForm } from "@/components/verify/CodeCheckForm";

/**
 * Machine Authentication and Qualification Check, in any locale. The live pages are
 * the intro paragraph plus Gravity Forms 2 / 1 (one code field and a CAPTCHA) whose
 * verdict is printed by a shortcode; here the form checks in place (CodeCheckForm →
 * lib/verify.ts). Copy: src/content/<locale>/pages/{machine-authentication,
 * qualification-check}.json. Both are noindex, as on the live site (NOINDEX_PAGES).
 */

const PAGE = {
  "machine-auth": {
    endpoint: "/api/machine-authentication/",
    icon: ShieldCheck,
    help: { icon: MessageCircle, page: "contact" },
  },
  "qualification-check": {
    endpoint: "/api/qualification-check/",
    icon: BadgeCheck,
    help: { icon: GraduationCap, page: "training" },
  },
} as const satisfies Record<VerifyPage, { endpoint: string; icon: unknown; help: { icon: unknown; page: PageKey } }>;

export function VerifySections({ page, locale }: { page: VerifyPage; locale: Locale }) {
  const t = getVerifyContent(page, locale);
  const common = getCommonContent(locale);
  const { endpoint, icon: Icon, help } = PAGE[page];
  const HelpIcon = help.icon;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.meta.title,
    description: t.meta.description,
    url: absoluteUrl(locale, page),
    inLanguage: LOCALE_META[locale].htmlLang,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: common.nav.home, item: absoluteUrl(locale, "home") },
        { "@type": "ListItem", position: 2, name: t.title, item: absoluteUrl(locale, page) },
      ],
    },
  };

  return (
    <div lang={LOCALE_META[locale].htmlLang}>
      <CompactHero locale={locale} common={common} eyebrow={t.eyebrow} title={t.title} compact />

      {/* phones: tighter spacing and no decorative icon, so the form reaches the first screen */}
      <section className="bg-white py-7 sm:py-16 lg:py-20">
        <div className="container-x grid items-start gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16 xl:gap-24">
          <div className="max-w-xl">
            <span className="hidden size-12 place-items-center rounded-2xl bg-brand text-white sm:grid">
              <Icon className="size-5" aria-hidden />
            </span>
            <h2 className="font-display text-xl leading-tight font-bold tracking-[-0.02em] text-ink sm:mt-5 sm:text-3xl">
              {t.heading}
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted sm:mt-4 sm:text-[17px]">{t.intro}</p>

            {/* help card — desktop only here; phones get it under the form */}
            <HelpCard className="mt-10 hidden lg:flex" icon={<HelpIcon className="size-5" aria-hidden />} help={t.help} href={pageHref(locale, help.page)} />
          </div>

          <div className="min-w-0">
            <CodeCheckForm endpoint={endpoint} content={t} captchaError={common.enquiryForm.errors.captcha} />
            <HelpCard className="mt-6 flex sm:mt-8 lg:hidden" icon={<HelpIcon className="size-5" aria-hidden />} help={t.help} href={pageHref(locale, help.page)} />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

function HelpCard({
  className,
  icon,
  help,
  href,
}: {
  className: string;
  icon: ReactNode;
  help: { title: string; body: string; cta: string };
  href: string;
}) {
  return (
    <div
      className={`${className} flex-col gap-4 rounded-[var(--radius-card)] border border-brand/15 bg-brand-sky/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-7`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white sm:size-11">{icon}</span>
        <div>
          <p className="text-base leading-snug font-bold text-balance text-ink">{help.title}</p>
          <p className="mt-1 text-sm text-balance text-muted">{help.body}</p>
        </div>
      </div>
      <Button href={href} className="w-full shrink-0 sm:w-auto">
        {help.cta}
      </Button>
    </div>
  );
}
