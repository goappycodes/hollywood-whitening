import { Plus } from "lucide-react";
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
    <div className="border-b border-line">
      {items.map((item) => (
        <details key={item.q} className="hc-rule">
          <summary className="flex items-start justify-between gap-6 py-6 text-xl font-medium tracking-tight sm:text-2xl">
            {item.q}
            <Plus className="hc-plus mt-1 size-6 shrink-0" aria-hidden />
          </summary>
          <div className="max-w-3xl space-y-3 pb-8 text-lg leading-relaxed text-muted">
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
    <section id="enquire" className="hc-off hc-section scroll-mt-0">
      <div className="hc-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="hc-display hc-h2">{title}</h2>
          <p className="hc-lead mt-8 max-w-lg text-muted">{body}</p>
          <ul className="mt-10 space-y-4">
            {SITE.phones.map((phone) => (
              <li key={phone.href}>
                <span className="hc-tag block">{phone.label}</span>
                <a href={phone.href} className="hc-display hc-h3 mt-1 block">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="self-start rounded-2xl bg-white p-5 text-ink [--color-line:rgb(5_5_6/0.14)] [--color-muted:#5f6066] sm:p-9">
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
