import Image from "next/image";
import Link from "next/link";
import { getContactContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";
import { OFFICES, SITE } from "@/lib/site";
import { Arc } from "./Arc";

export const ROUTES = {
  home: "/design-c/home/",
  product: "/design-c/product/",
  service: "/design-c/service/",
};

const NAV = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.product, label: "Comet 2™" },
  { href: ROUTES.service, label: "Training" },
];

export function ConceptHeader() {
  return (
    <header className="hc-header">
      <div className="hc-x flex items-center justify-between gap-4 py-4 sm:py-5">
        <Link href={ROUTES.home} aria-label={SITE.legalName}>
          <Image src="/images/logo-white.png" alt="" width={289} height={55} priority className="h-5 w-auto sm:h-8" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3.5 text-[0.8rem] font-medium sm:gap-9 sm:text-base">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="underline-offset-4 hover:underline">
              {item.label}
            </Link>
          ))}
          <a href="#enquire" className="hidden rounded-full border border-white px-4 py-1.5 sm:block">
            Enquire
          </a>
        </nav>
      </div>
    </header>
  );
}

export function ConceptFooter() {
  const offices = getContactContent("en").offices.items;
  return (
    <footer className="hc-off overflow-hidden">
      <div className="hc-x pt-10 pb-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office, i) => (
            <div key={office.map} className="text-sm leading-relaxed">
              <p className="font-medium">{offices[i].name}</p>
              <p className="mt-2 text-muted">{office.map}</p>
              <a href={office.phone.href} className="mt-1 block underline-offset-4 hover:underline">
                {office.phone.display}
              </a>
            </div>
          ))}
          <ul className="space-y-1.5 text-sm">
            <li>
              <a href={SITE.social.instagram} className="underline-offset-4 hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href={SITE.social.youtube} className="underline-offset-4 hover:underline">
                YouTube
              </a>
            </li>
            <li>
              <Link href={pageHref("en", "privacy")} className="underline-offset-4 hover:underline">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href={pageHref("en", "terms")} className="underline-offset-4 hover:underline">
                Terms &amp; conditions
              </Link>
            </li>
          </ul>
        </div>
        <Arc className="mt-16 w-full" stroke={3} />
        <p className="mt-10 text-xs text-muted">© {SITE.legalName}</p>
      </div>
    </footer>
  );
}
