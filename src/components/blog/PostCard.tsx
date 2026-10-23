import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { primaryCategory, type BlogPost } from "@/lib/blog";
import { blogPostPath } from "@/lib/blog-locale";
import { LOCALE_META, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Long, locale-aware date ("20 November 2025"). Server-rendered, so no hydration mismatch. */
export function formatPostDate(iso: string, htmlLang: string): string {
  return new Intl.DateTimeFormat(htmlLang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}

/** Stand-in for the older posts that have no featured image in WordPress. */
export function PostImageFallback({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 grid place-items-center overflow-hidden bg-navy", className)}>
      <div aria-hidden className="absolute -top-16 -left-10 size-56 rounded-full bg-brand/40 blur-[70px]" />
      <div aria-hidden className="absolute -right-10 -bottom-20 size-48 rounded-full bg-cyan/20 blur-[60px]" />
      <Image src="/images/logo-white.png" alt="" width={289} height={55} className="relative w-2/5 max-w-44 opacity-90" />
    </div>
  );
}

type Props = {
  post: BlogPost;
  locale: Locale;
  categoryFallback: string;
  readArticle: string;
  /** Large horizontal card for the newest post on the first listing page. */
  featured?: boolean;
  headingLevel?: "h2" | "h3";
};

export function PostCard({ post, locale, categoryFallback, readArticle, featured = false, headingLevel = "h2" }: Props) {
  const Heading = headingLevel;
  const { htmlLang } = LOCALE_META[locale];
  return (
    <Link
      href={blogPostPath(post, locale)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow hover:shadow-lift",
        featured && "lg:grid lg:grid-cols-[1.15fr_1fr]",
      )}
    >
      <div className={cn("relative aspect-[16/9] overflow-hidden bg-pearl", featured && "lg:aspect-auto lg:min-h-[22rem]")}>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            // WordPress hotlink protection 403s a foreign Referer but allows none (lib/blog-content.ts).
            referrerPolicy="no-referrer"
            sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <PostImageFallback />
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", featured && "lg:justify-center lg:p-10")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold tracking-[0.18em] uppercase">
          <span className="text-brand">{primaryCategory(post, locale)?.name ?? categoryFallback}</span>
          <span aria-hidden className="size-1 rounded-full bg-line" />
          <time dateTime={post.date} className="font-semibold tracking-[0.12em] text-muted">
            {formatPostDate(post.date, htmlLang)}
          </time>
        </div>
        <Heading
          className={cn(
            "mt-2.5 leading-snug font-bold text-ink group-hover:text-brand-deep",
            featured ? "text-xl sm:text-2xl lg:text-[1.9rem] lg:leading-tight" : "text-lg",
          )}
        >
          {post.title}
        </Heading>
        {post.excerpt && (
          <p className={cn("mt-3 text-sm leading-relaxed text-muted", featured ? "line-clamp-4 sm:text-base" : "line-clamp-3")}>
            {post.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
          {readArticle}
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
