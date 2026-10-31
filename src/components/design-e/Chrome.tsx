import Image from "next/image";
import Link from "next/link";
import { getContactContent, getHomeContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";
import { OFFICES, SITE } from "@/lib/site";

export const ROUTES = {
  home: "/design-e/home/",
  product: "/design-e/product/",
  service: "/design-e/service/",
};

const NAV = [
  { href: `${ROUTES.home}#finder`, label: "Packages" },
  { href: ROUTES.product, label: "Comet 2™" },
  { href: ROUTES.service, label: "Training" },
];

export function ConceptHeader() {
  return (
    <header className="hd-x sticky top-2 z-40 pt-2 sm:top-3 sm:pt-3">
      <div className="hd-float flex flex-wrap items-center justify-between gap-x-4 gap-y-1 !rounded-[1.5rem] px-4 py-2.5 sm:px-5 lg:!rounded-full">
        <Link href={ROUTES.home} aria-label={SITE.legalName}>
          <Image src="/images/logo.png" alt="" width={289} height={55} priority className="h-6 w-auto sm:h-7" />
        </Link>
        <nav aria-label="Main" className="order-3 flex w-full gap-5 py-1 text-sm font-medium md:order-none md:w-auto md:gap-8 md:py-0 md:text-[0.95rem]">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <a href={SITE.phones[0].href} className="hidden text-[0.95rem] font-medium hover:text-brand xl:block">
            {SITE.phones[0].display}
          </a>
          <a href="#enquire" className="hd-btn !min-h-10 !px-4 !py-1.5 !text-sm">
            Request pricing
          </a>
        </div>
      </div>
    </header>
  );
}

/** Running values from the site's own marquee, leaving out the "Yellow's out" line. */
export function Ticker() {
  const items = getHomeContent("en").marquee.filter((line) => !line.startsWith("Yellow"));
  const row = [...items, ...items];
  return (
    <div className="hd-x pt-3" aria-hidden>
      <div className="hd-tile hd-ink overflow-hidden !rounded-full py-3.5">
        <div className="he-ticker flex w-max gap-10 pl-10 text-[0.95rem] font-medium whitespace-nowrap">
          {[...row, ...row].map((line, i) => (
            <span key={i} className="flex items-center gap-10">
              {line}
              <span className="size-1.5 rounded-full bg-[#b9a9ff]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConceptFooter() {
  const offices = getContactContent("en").offices.items;
  return (
    <footer className="hd-x pt-3 pb-3">
      <div className="hd-tile hd-ink he-iris p-6 sm:p-10">
        <div className="relative z-[1] grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office, i) => (
            <div key={office.map} className="text-sm leading-relaxed">
              <p className="font-semibold">{offices[i].name}</p>
              <p className="mt-2 text-muted">{office.map}</p>
              <a href={office.phone.href} className="mt-1 block underline-offset-4 hover:underline">
                {office.phone.display}
              </a>
            </div>
          ))}
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link href={ROUTES.service} className="underline-offset-4 hover:underline">
                Training
              </Link>
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
            <li>
              <a href={SITE.social.instagram} className="underline-offset-4 hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <p className="relative z-[1] mt-10 border-t border-line pt-5 text-xs text-muted">© {SITE.legalName}</p>
      </div>
    </footer>
  );
}
