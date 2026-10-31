import Image from "next/image";
import Link from "next/link";
import { getContactContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";
import { OFFICES, SITE } from "@/lib/site";

export const ROUTES = {
  home: "/design-b/home/",
  product: "/design-b/product/",
  service: "/design-b/service/",
};

const NAV = [
  { href: `${ROUTES.home}#packages`, label: "Packages" },
  { href: ROUTES.product, label: "Comet 2™" },
  { href: ROUTES.service, label: "Training & support" },
];

export function ConceptHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="hb-x flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
        <Link href={ROUTES.home} aria-label={SITE.legalName}>
          <Image src="/images/logo.png" alt="" width={289} height={55} priority className="h-7 w-auto sm:h-8" />
        </Link>
        <nav aria-label="Main" className="order-3 flex w-full gap-6 text-[0.95rem] md:order-none md:w-auto md:gap-9">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a href={SITE.phones[0].href} className="hidden text-[0.95rem] hover:text-brand xl:block">
            {SITE.phones[0].display}
          </a>
          <a href="#enquire" className="hb-btn !min-h-10 !px-4 !py-1.5 !text-sm">
            Request pricing
          </a>
        </div>
      </div>
    </header>
  );
}

export function ConceptFooter() {
  const offices = getContactContent("en").offices.items;
  return (
    <footer className="hb-porcelain border-t border-line">
      <div className="hb-x py-14">
        <Image src="/images/logo.png" alt={SITE.legalName} width={289} height={55} className="h-8 w-auto" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office, i) => (
            <div key={office.map} className="text-sm leading-relaxed">
              <p className="font-semibold">{offices[i].name}</p>
              <p className="mt-2 text-muted">{office.map}</p>
              <a href={office.phone.href} className="mt-1 block hover:text-brand">
                {office.phone.display}
              </a>
            </div>
          ))}
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link href={ROUTES.service} className="hover:text-brand">
                Training &amp; support
              </Link>
            </li>
            <li>
              <Link href={pageHref("en", "privacy")} className="hover:text-brand">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href={pageHref("en", "terms")} className="hover:text-brand">
                Terms &amp; conditions
              </Link>
            </li>
            <li>
              <a href={SITE.social.instagram} className="hover:text-brand">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs text-muted">© {SITE.legalName}</p>
      </div>
    </footer>
  );
}
