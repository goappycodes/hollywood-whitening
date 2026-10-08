import Image from "next/image";
import { Quote } from "lucide-react";
import type { AboutContent, CommonContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { ABOUT_MEDIA } from "@/lib/site";
import { PageHero } from "@/components/ui/shared/sections/PageHero";

type Props = { content: AboutContent["hero"]; common: CommonContent; locale: Locale };

/** About hero: the live banner (provider + whitening light), crediting Josefine's quote. */
export function AboutHero({ content, common, locale }: Props) {
  return (
    <PageHero
      locale={locale}
      common={common}
      current={common.nav.about}
      image={{ src: ABOUT_MEDIA.hero, alt: content.imageAlt, subject: "left" }}
      eyebrow={content.eyebrow}
      titleBold={content.titleBold}
      titleLight={content.titleLight}
      subtitle={content.subtitle}
      cta={{ label: content.cta, href: "#get-in-touch" }}
      footer={
        // On the live page the headline is Josefine's quote — credit it.
        <div className="flex items-center gap-4">
          <span className="relative shrink-0">
            <span className="relative block size-12 overflow-hidden rounded-full ring-2 ring-cyan/40">
              <Image src={ABOUT_MEDIA.analyst} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-brand ring-2 ring-navy">
              <Quote className="size-2.5 fill-white text-white" aria-hidden />
            </span>
          </span>
          <p className="min-w-0 text-sm leading-snug">
            <span className="block font-semibold text-white">{content.quoteName}</span>
            <span className="text-white/60">{content.quoteRole}</span>
          </p>
        </div>
      }
    />
  );
}
