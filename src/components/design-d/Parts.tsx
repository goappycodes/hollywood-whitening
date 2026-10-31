import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { getCommonContent } from "@/lib/content";
import { countryOptions } from "@/lib/gf-countries";
import type { EnquiryFormKey } from "@/lib/gf-forms";
import { pageHref } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export type Faq = { q: string; a: string[]; list?: string[] };

export function Faqs({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line">
      {items.map((item) => (
        <details key={item.q}>
          <summary className="flex items-center justify-between gap-6 py-4 text-[1.02rem] font-semibold">
            {item.q}
            <ChevronDown className="hd-chevron size-5 shrink-0 text-brand" aria-hidden />
          </summary>
          <div className="space-y-3 pb-5 leading-relaxed text-muted">
            {item.a.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {item.list && (
              <ul className="list-disc pl-5">
                {item.list.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export function SectionHead({ eyebrow, title, children, action }: { eyebrow: string; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 px-1">
      <div className="max-w-2xl">
        <p className="hd-eyebrow">{eyebrow}</p>
        <h2 className="hd-h2 mt-2">{title}</h2>
        {children && <p className="hd-lead mt-3">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function EnquirySection({
  title,
  body,
  form = "contact",
  productName,
}: {
  title: ReactNode;
  body: string;
  form?: EnquiryFormKey;
  productName?: string;
}) {
  return (
    <section id="enquire" className="hd-x scroll-mt-24 pt-3">
      <div className="grid gap-3 lg:grid-cols-[5fr_7fr]">
        <div className="hd-tile hd-pearl flex flex-col justify-between gap-10 p-6 sm:p-10">
          <div>
            <p className="hd-eyebrow">Speak to our team</p>
            <h2 className="hd-h2 mt-2">{title}</h2>
            <p className="hd-lead mt-4 max-w-md">{body}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {SITE.phones.map((phone) => (
              <li key={phone.href} className="hd-float relative z-[4] p-4">
                <span className="block text-xs font-semibold text-muted">{phone.label}</span>
                <a href={phone.href} className="mt-1 block font-semibold whitespace-nowrap hover:text-brand">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hd-tile p-5 sm:p-10">
          <div className="relative z-[4]">
            <EnquiryForm
              t={getCommonContent("en").enquiryForm}
              form={form}
              productName={productName}
              countries={countryOptions("en-GB")}
              privacyHref={pageHref("en", "privacy")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
