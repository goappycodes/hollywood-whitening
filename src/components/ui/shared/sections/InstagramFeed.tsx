import { ArrowUpRight } from "lucide-react";
import { getInstagramFeed } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { getInstagramPosts } from "@/lib/instagram";
import { SITE } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/Social";
import { InstagramCarousel, type IgTile } from "./InstagramCarousel";

/**
 * "Follow us on Instagram" — the localised twin of the live WordPress Instagram
 * Feed Pro (Smash Balloon) block, structured as in allwhitelaser-next.
 *
 * Tries the REAL cached posts via the `aw3/v1/instagram` endpoint
 * (getInstagramPosts); when that is unavailable/empty it falls back to the
 * snapshot in src/content/instagram.json, whose tiles still link to the real posts.
 */

const HANDLE = `@${SITE.instagramHandle}`;

const LABELS: Record<
  Locale,
  { titleLead: string; titleAccent: string; body: string; cta: string; prev: string; next: string }
> = {
  en: {
    titleLead: "Real smiles, every day on",
    titleAccent: "Instagram.",
    body: "Real treatments, real machines, real results — see what Hollywood Whitening providers around the world are sharing.",
    cta: "Follow on Instagram",
    prev: "Previous posts",
    next: "Next posts",
  },
  de: {
    titleLead: "Echtes Lächeln, täglich auf",
    titleAccent: "Instagram.",
    body: "Echte Behandlungen, echte Geräte, echte Ergebnisse — sehen Sie, was Hollywood Whitening Anbieter weltweit teilen.",
    cta: "Auf Instagram folgen",
    prev: "Vorherige Beiträge",
    next: "Nächste Beiträge",
  },
  es: {
    titleLead: "Sonrisas reales, cada día en",
    titleAccent: "Instagram.",
    body: "Tratamientos reales, máquinas reales, resultados reales: mira lo que comparten los proveedores de Hollywood Whitening de todo el mundo.",
    cta: "Seguir en Instagram",
    prev: "Publicaciones anteriores",
    next: "Siguientes publicaciones",
  },
  ru: {
    titleLead: "Настоящие улыбки каждый день в",
    titleAccent: "Instagram.",
    body: "Настоящие процедуры, аппараты и результаты — смотрите, чем делятся партнёры Hollywood Whitening по всему миру.",
    cta: "Подписаться в Instagram",
    prev: "Предыдущие публикации",
    next: "Следующие публикации",
  },
};

const firstLine = (caption: string) => caption.split("\n")[0].slice(0, 120);

export async function InstagramFeed({ locale }: { locale: Locale }) {
  const t = LABELS[locale] ?? LABELS.en;

  const live = await getInstagramPosts(12);
  const tiles: IgTile[] = live.length
    ? live.map((p) => ({
        key: p.id,
        src: p.image,
        alt: p.caption ? firstLine(p.caption) : `${HANDLE} on Instagram`,
        href: p.permalink,
        isVideo: p.type === "VIDEO",
      }))
    : getInstagramFeed().items.map((p) => ({
        key: p.shortcode,
        src: p.image,
        alt: firstLine(p.caption) || `${HANDLE} on Instagram`,
        href: p.url,
        isVideo: p.type === "reel",
      }));

  return (
    // White (testimonials above are pearl); lighter bottom padding as the white blog section follows.
    <section className="bg-white pt-16 pb-6 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-12">
      <div className="container-x">
        {/* header: heading left, follow CTA right (stacks on mobile) */}
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">
              <InstagramIcon className="size-4" />
              <span className="normal-case">{HANDLE}</span>
            </p>
            <h2 className="mt-4 text-[1.75rem] leading-[1.12] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {t.titleLead} <span className="font-script font-semibold text-brand">{t.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">{t.body}</p>
          </div>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand sm:w-auto sm:self-start md:self-auto"
          >
            <InstagramIcon className="size-4" />
            {t.cta}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </div>

        <InstagramCarousel tiles={tiles} handle={HANDLE} prevLabel={t.prev} nextLabel={t.next} />
      </div>
    </section>
  );
}
