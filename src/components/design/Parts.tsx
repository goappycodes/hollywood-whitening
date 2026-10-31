import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { getCommonContent } from "@/lib/content";
import { countryOptions } from "@/lib/gf-countries";
import type { EnquiryFormKey } from "@/lib/gf-forms";
import { pageHref } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="hw-label flex gap-3 text-muted">
      {index && <span>{index}</span>}
      <span>{children}</span>
    </p>
  );
}

export type Faq = { q: string; a: string[]; list?: string[] };

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-b border-line">
      {items.map((item) => (
        <details key={item.q} className="hw-rule group">
          <summary className="flex items-start justify-between gap-6 py-5 text-lg font-medium sm:text-xl">
            {item.q}
            <Plus className="hw-plus mt-1 size-5 shrink-0" aria-hidden />
          </summary>
          <div className="max-w-3xl space-y-3 pb-7 leading-relaxed text-muted">
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

export function Enquire({
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
    <section id="enquire" className="hw-x scroll-mt-6 py-16 sm:py-24">
      <div className="hw-rule grid gap-10 pt-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <h2 className="hw-display hw-h2">{title}</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{body}</p>
          <ul className="mt-8 space-y-4">
            {SITE.phones.map((phone) => (
              <li key={phone.href}>
                <span className="hw-label block text-muted">{phone.label}</span>
                <a href={phone.href} className="hw-display mt-1 block text-2xl sm:text-3xl">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-white p-5 sm:p-8">
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
