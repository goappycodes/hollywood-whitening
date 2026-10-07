"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, Phone, User, X } from "lucide-react";
import { getCommonContent, type CommonContent } from "@/lib/content";
import { LOCALE_META, localePath, pageHref, resolvePathname } from "@/lib/i18n";
import { NAV, SITE, type NavItem } from "@/lib/site";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Child = NonNullable<NavItem["children"]>[number];
const childLabel = (c: Child, t: CommonContent) => c.name ?? t.nav[c.label!];
const childDescription = (c: Child, t: CommonContent) =>
  (t.navDescriptions as Record<string, string>)[c.page];

export function Header() {
  const { locale } = resolvePathname(usePathname());
  const t = getCommonContent(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const packagesHref = `${localePath(locale, "home")}#packages`;

  return (
    <div lang={LOCALE_META[locale].htmlLang} className="contents">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.skipToContent}
      </a>

      {/* Announcement bar */}
      <div className="bg-navy text-white">
        <div className="container-x flex h-10 items-center justify-between gap-4 text-xs font-medium">
          <p className="flex min-w-0 items-center gap-2 tracking-wide">
            <span
              className="size-1.5 shrink-0 animate-pulse rounded-full bg-cyan"
              aria-hidden
            />
            <span className="truncate">{t.announcement}</span>
          </p>
          <div className="flex shrink-0 items-center gap-5 text-white/80">
            {SITE.phones.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="hidden items-center gap-1.5 hover:text-white md:inline-flex"
              >
                <Phone className="size-3.5 text-cyan" aria-hidden />
                <span className="text-white/50">{p.label}</span> {p.display}
              </a>
            ))}
            <a
              href={pageHref(locale, "account")}
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <User className="size-3.5" aria-hidden />
              {t.login}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 shadow-[0_1px_0_rgb(10_10_10/0.06)] backdrop-blur-xl"
            : "bg-white"
        }`}
      >
        <div className="container-x flex h-18 items-center justify-between gap-4 lg:h-20">
          <Link
            href={localePath(locale, "home")}
            className="shrink-0"
            aria-label={t.homeAria}
          >
            <Image
              src="/images/logo.png"
              alt={SITE.legalName}
              width={289}
              height={55}
              className="h-8 w-auto lg:h-9"
              preload
            />
          </Link>

          <nav aria-label={t.menu} className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {/* "Home" is left to the logo on desktop — translated labels need the room */}
              {NAV.filter((item) => item.page !== "home").map((item) => (
                <li key={item.label} className="group relative">
                  <Link
                    href={pageHref(locale, item.page)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-ink/80 transition-colors hover:bg-pearl hover:text-ink"
                  >
                    {t.nav[item.label]}
                    {item.children && (
                      <ChevronDown
                        className="size-3.5 transition-transform group-hover:rotate-180"
                        aria-hidden
                      />
                    )}
                  </Link>
                  {item.children && (
                    <div className="invisible absolute top-full left-1/2 w-80 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="rounded-2xl border border-line bg-white p-2 shadow-lift">
                        {item.children.map((c) => (
                          <li key={c.page}>
                            <Link
                              href={pageHref(locale, c.page)}
                              className="block rounded-xl px-4 py-3 transition-colors hover:bg-brand-sky"
                            >
                              <span className="block text-sm font-semibold text-ink">
                                {childLabel(c, t)}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted">
                                {childDescription(c, t)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={SITE.phones[0].href}
              className="hidden items-center gap-2.5 rounded-full border border-line py-1.5 pr-4 pl-1.5 text-left transition-colors hover:border-brand/40 2xl:inline-flex"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-sky text-brand">
                <Phone className="size-3.5" aria-hidden />
              </span>
              <span className="text-[11px] leading-tight font-semibold whitespace-nowrap text-ink">
                {t.speakWith[0]}
                <br />
                {t.speakWith[1]}
              </span>
            </a>
            {/* As in allwhitelaser: header switcher from sm; phones use the one in the drawer */}
            <LanguageSwitcher label={t.language} className="hidden sm:block" />
            <Link
              href={packagesHref}
              className="hidden items-center gap-2 rounded-full bg-brand px-5 py-3 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0_10px_24px_-10px_rgb(30_136_229/0.8)] transition-colors hover:bg-brand-deep sm:inline-flex xl:hidden min-[1440px]:inline-flex"
            >
              {t.explorePackages}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line xl:hidden"
              aria-label={t.openMenu}
              aria-expanded={open}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink text-white xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={t.menu}
          >
            <div className="container-x flex h-18 items-center justify-between">
              <Image
                src="/images/logo-white.png"
                alt={SITE.legalName}
                width={289}
                height={55}
                className="h-8 w-auto"
              />
              <div className="flex items-center gap-1">
                <LanguageSwitcher tone="light" label={t.language} onNavigate={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/20"
                  aria-label={t.closeMenu}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="container-x mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto pb-10">
              <nav aria-label={t.menu} className="mt-2">
                <ul className="divide-y divide-white/10">
                  {NAV.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="py-4"
                    >
                      <Link
                        href={pageHref(locale, item.page)}
                        onClick={() => setOpen(false)}
                        className="text-2xl font-semibold"
                      >
                        {t.nav[item.label]}
                      </Link>
                      {item.children && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {item.children.map((c) => (
                            <li key={c.page}>
                              <Link
                                href={pageHref(locale, c.page)}
                                onClick={() => setOpen(false)}
                                className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm text-white/80"
                              >
                                {childLabel(c, t)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  ))}
                </ul>
                <Link
                  href={pageHref(locale, "contact")}
                  onClick={() => setOpen(false)}
                  className="mt-8 flex w-full items-center justify-center rounded-full bg-brand py-4 font-semibold"
                >
                  {t.nav.contact}
                </Link>
                <ul className="mt-6 space-y-2 text-sm text-white/70">
                  {SITE.phones.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        className="inline-flex items-center gap-2 hover:text-white"
                      >
                        <Phone className="size-4 text-cyan" aria-hidden />
                        <span className="text-white/40">{p.label}</span>{" "}
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
