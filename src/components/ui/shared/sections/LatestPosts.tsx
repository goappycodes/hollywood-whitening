import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { PostTeaser } from "@/lib/blog";
import type { HomeContent } from "@/lib/content";
import { pageHref, type Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostImageFallback } from "@/components/blog/PostCard";

type Props = {
  /** Section chrome; `posts` supplies the "Read article" label. */
  eyebrow: string;
  title: string;
  viewAll: string;
  posts: HomeContent["blogFaq"];
  /** Newest posts from WordPress (lib/blog.ts → getPostTeasers). */
  teasers: PostTeaser[];
  locale: Locale;
  limit?: number;
};

/** "News & Trends" strip of the latest blog posts, as at the foot of the live inner pages. */
export function LatestPosts({ eyebrow, title, viewAll, posts, teasers, locale, limit = 3 }: Props) {
  const items = teasers.slice(0, limit);
  const all = pageHref(locale, "blog");

  return (
    <section className="bg-pearl py-16 sm:py-24 lg:py-28">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading align="left" eyebrow={eyebrow} title={title} />
          <Reveal className="hidden shrink-0 sm:block">
            <Link href={all} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
              {viewAll}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Reveal>
        </div>

        {/* Phones: a CSS scroll-snap row (~1.3 cards visible) running edge to edge; sm+: grid. */}
        <ul className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {items.map((post, i) => (
            <Reveal as="li" key={post.href} delay={i * 0.06} className={`w-[77%] shrink-0 snap-start sm:w-auto ${i === 2 ? "sm:hidden lg:block" : ""}`}>
              <Link
                href={post.href}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow hover:shadow-lift"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      referrerPolicy="no-referrer"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <PostImageFallback />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-brand uppercase">{post.category}</span>
                  <h3 className="mt-2 text-lg leading-snug font-bold text-ink group-hover:text-brand-deep">{post.title}</h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
                    {posts.readArticle}
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Link
          href={all}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink sm:hidden"
        >
          {viewAll}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
