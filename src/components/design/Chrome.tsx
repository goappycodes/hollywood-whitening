import Image from "next/image";
import Link from "next/link";
import { getContactContent } from "@/lib/content";
import { pageHref } from "@/lib/i18n";
import { OFFICES, SITE } from "@/lib/site";

export const DESIGN_ROUTES = {
  home: "/design/home/",
  product: "/design/product/",
  service: "/design/service/",
};

const NAV = [
  { href: DESIGN_ROUTES.home, label: "Home" },
  { href: DESIGN_ROUTES.product, label: "Comet 2™" },
  { href: DESIGN_ROUTES.service, label: "Training" },
];

export function DesignHeader() {
  return (
    <header className="hw-x flex flex-wrap items-center justify-between gap-x-3 gap-y-3 py-4 sm:gap-x-8 sm:py-5">
      <Link href={DESIGN_ROUTES.home} aria-label={SITE.legalName}>
        <Image src="/images/logo.png" alt="" width={289} height={55} priority className="h-7 w-auto sm:h-9" />
      </Link>
      <nav aria-label="Main" className="order-3 flex w-full gap-6 text-[0.95rem] font-medium sm:order-none sm:w-auto sm:gap-9">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="underline-offset-4 hover:underline">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-6">
        <a href={SITE.phones[0].href} className="hidden text-[0.95rem] font-medium lg:block">
          {SITE.phones[0].display}
        </a>
        <a href="#enquire" className="hw-btn !min-h-10 !px-4 !py-2 !text-sm">
          Register interest
        </a>
      </div>
    </header>
  );
}

export function DesignFooter() {
  const offices = getContactContent("en").offices.items;
  return (
    <footer className="hw-dark">
      <div className="hw-x py-14 sm:py-20">
        <p className="hw-display hw-h1">
          White’s <em>in.</em>
        </p>
        <div className="hw-rule mt-12 grid gap-10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((office, i) => (
            <div key={office.map}>
              <p className="hw-label text-white/60">{offices[i].name}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{office.map}</p>
              <a href={office.phone.href} className="mt-2 block text-sm font-semibold underline-offset-4 hover:underline">
                {office.phone.display}
              </a>
            </div>
          ))}
          <div>
            <p className="hw-label text-white/60">More</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>
                <a href={SITE.social.instagram} className="underline-offset-4 hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SITE.social.facebook} className="underline-offset-4 hover:underline">
                  Facebook
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
        </div>
        <p className="mt-12 text-xs text-white/60">© {SITE.legalName}</p>
      </div>
    </footer>
  );
}
