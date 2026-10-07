import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "dark" | "light" | "outline" | "outline-light";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_10px_30px_-10px_rgb(30_136_229/0.7)] hover:bg-brand-deep",
  dark: "bg-ink text-white hover:bg-graphite",
  light: "bg-white text-ink hover:bg-brand-sky",
  outline: "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/30 text-white hover:bg-white hover:text-ink",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", arrow = true, className = "" }: Props) {
  const external = href.startsWith("http");
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${styles[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
