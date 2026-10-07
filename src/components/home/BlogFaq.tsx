import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import type { HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { POST_IMAGES } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="eyebrow">
        <span className="h-px w-6 shrink-0 bg-current" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
    </>
  );
}

export function BlogFaq({ content, locale }: { content: HomeContent["blogFaq"]; locale: Locale }) {
  const posts = content.posts.map((p, i) => ({ ...p, image: POST_IMAGES[i] }));
  const [featured, ...rest] = posts;
  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-24 lg:py-32">
      <div className="container-x grid gap-12 sm:gap-16 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
        {/* News & Tips */}
        <div>
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <Heading eyebrow={content.blogEyebrow} title={content.blogTitle} />
            </div>
            <Link href={pageHref(locale, "blog")} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand">
              {content.readMore} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <Link
              href={featured.href}
              className="group block overflow-hidden rounded-[var(--radius-card)] bg-navy text-white shadow-lift"
            >
              <div className="relative aspect-[16/8] overflow-hidden">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <span className="rounded-md bg-brand px-2.5 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">
                  {content.category}
                </span>
                <h3 className="mt-4 text-2xl leading-snug font-bold">{featured.title}</h3>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">
                  {content.readArticle}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>

          <ul className="mt-4 space-y-3">
            {rest.map((post, i) => (
              <li key={post.href}>
                <Reveal delay={0.05 * i}>
                  <Link
                    href={post.href}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-pearl p-3 pr-4 transition-colors hover:border-brand/30 hover:bg-white"
                  >
                    <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={post.image} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold tracking-[0.18em] text-brand uppercase">{content.category}</span>
                      <h3 className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-ink group-hover:text-brand-deep">
                        {post.title}
                      </h3>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-ink/30 group-hover:text-brand" aria-hidden />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <Reveal>
            <Heading eyebrow={content.faqEyebrow} title={content.faqTitle} />
            <p className="mt-3 text-muted">
              {content.faqIntro}
            </p>
          </Reveal>
          <div className="mt-8 space-y-3">
            {content.faqs.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i, 4) * 0.04}>
                <details
                  className="group rounded-2xl border border-line bg-pearl transition-colors open:border-brand/25 open:bg-white open:shadow-soft"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown
                      className="size-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">
                    {f.a.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                    {f.list && (
                      <ul className="list-disc space-y-1 pl-5">
                        {f.list.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
