import type { Metadata } from "next";
import { Bodoni_Moda, DM_Mono, Instrument_Sans } from "next/font/google";
import { DesignFooter, DesignHeader } from "@/components/design/Chrome";
import { ShadeScroll } from "@/components/design/ShadeScroll";
import "./design.css";

const display = Bodoni_Moda({
  variable: "--font-hw-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Instrument_Sans({
  variable: "--font-hw-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = DM_Mono({
  variable: "--font-hw-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Design review pages: not part of the site yet, so they stay out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * New design direction, kept apart from the current pages for client review.
 * The page background whitens as it scrolls (ShadeScroll); see design.css for tokens.
 */
export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`hw ${display.variable} ${body.variable} ${mono.variable} flex min-h-dvh flex-col`}>
      <ShadeScroll />
      <DesignHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <DesignFooter />
    </div>
  );
}
