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
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q}>
          <summary className="flex items-center justify-between gap-6 py-5 text-[1.05rem] font-medium">
            {item.q}
            <ChevronDown className="hb-chevron size-5 shrink-0 text-brand" aria-hidden />
          </summary>
          <div className="space-y-3 pb-6 leading-relaxed text-muted">
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

export function SectionIntro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="hb-eyebrow">{eyebrow}</p>
      <h2 className="hb-h2 mt-3">{title}</h2>
      {children && <p className="hb-lead mt-4">{children}</p>}
    </div>
  );
}

export function EnquirySection({
  title,
  body,
  form = "contact",
  productName,
}: {
  title: string;
  body: string;
  form?: EnquiryFormKey;
  productName?: string;
}) {
  return (
    <section id="enquire" className="hb-porcelain hb-section scroll-mt-6">
      <div className="hb-x grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <p className="hb-eyebrow">Speak to our team</p>
          <h2 className="hb-h2 mt-3">{title}</h2>
          <p className="hb-lead mt-4 max-w-md">{body}</p>
          <ul className="mt-8 space-y-3">
            {SITE.phones.map((phone) => (
              <li key={phone.href} className="flex items-baseline gap-3">
                <span className="w-9 text-sm text-muted">{phone.label}</span>
                <a href={phone.href} className="text-lg font-medium hover:text-brand">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hb-card p-5 sm:p-8">
          <EnquiryForm
            t={getCommonContent("en").enquiryForm}
            form={form}
            productName={productName}
            countries={countryOptions("en-GB")}
            privacyHref={pageHref("en", "privacy")}
          />
        </div>
      </div>
    </section>
  );
}
