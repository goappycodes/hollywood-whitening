"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "section";
};

/**
 * Fades + lifts its children in once they scroll into view.
 * Hidden state only applies when <html> has the `js` class (set inline in the
 * layout), so content is never invisible without JavaScript. Styles live in
 * globals.css under [data-reveal].
 */
export function Reveal({ children, className, delay = 0, y = 24, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Reveal anything in view or already scrolled past (e.g. after an anchor jump).
        if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top < 0)) {
          el.dataset.shown = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={style}
      data-reveal=""
    >
      {children}
    </Tag>
  );
}
