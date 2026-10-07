import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { PROVIDER_IMAGE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export function ProviderCta({ content, locale }: { content: HomeContent["provider"]; locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-r from-brand-ink via-brand-deep to-[#0a7cc4] text-white">
      <Image
        src={PROVIDER_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[38%_30%] opacity-10 mix-blend-luminosity"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_50%_0%,rgb(63_208_255/0.25),transparent_70%)]"
      />
      <div className="container-x py-16 text-center sm:py-24 lg:py-28">
        <Reveal className="mx-auto max-w-3xl">
          <p className="pill border border-white/25 bg-white/10 text-white">{content.pill}</p>
          <h2 className="mt-6 text-[2rem] leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
            {content.body[0]}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-white/65">{content.body[1]}</p>
          <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap sm:justify-center">
            <Link
              href={pageHref(locale, "contact")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-navy shadow-xl transition-colors hover:bg-brand-sky"
            >
              {content.primary}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-4 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              {content.secondary}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
