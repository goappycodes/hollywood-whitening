"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCommonContent } from "@/lib/content";
import { LOCALE_META, pageHref, resolvePathname, type PageKey } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { SocialLinks } from "@/components/ui/Social";

function FooterLink({ href, label }: { href: string; label: string }) {
  const cls = "text-sm text-white/60 transition-colors hover:text-white";
  return href.startsWith("http") ? (
    <a href={href} className={cls}>
      {label}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export function Footer() {
  const { locale } = resolvePathname(usePathname());
  const t = getCommonContent(locale);
  const link = (page: PageKey, label: string) => ({ href: pageHref(locale, page), label });

  const columns = [
    {
      title: t.footer.explore,
      links: [
        link("science", t.nav.science),
        link("faq", t.nav.faq),
        link("training", t.nav.training),
        link("providers", t.nav.providers),
        link("blog", t.nav.blog),
      ],
    },
    {
      title: t.footer.products,
      links: [
        link("star-one", "Star One™"),
        link("comet-2", "Comet 2™"),
        link("galaxy", "Galaxy™"),
        link("shop", t.nav.shop),
      ],
    },
    {
      title: t.footer.company,
      links: [
        link("about", t.nav.about),
        link("contact", t.nav.contact),
        { href: SITE.bookingLoginUrl, label: t.footer.bookingLogin },
        link("account", t.footer.myAccount),
      ],
    },
  ];

  const legal = [
    link("privacy", t.footer.privacy),
    link("terms", t.footer.terms),
    link("warranty", t.footer.warranty),
    link("sitemap", t.footer.sitemap),
  ];

  return (
    <footer lang={LOCALE_META[locale].htmlLang} className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
      />
      <div className="container-x relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Image src="/images/logo-white.png" alt={SITE.legalName} width={289} height={55} className="h-9 w-auto" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">{t.footer.about}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {SITE.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="text-white/80 hover:text-white">
                    <span className="mr-2 text-white/40">{p.label}</span>
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <SocialLinks className="mt-6" />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <FooterLink {...l} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            {t.footer.rights} {SITE.legalName}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
