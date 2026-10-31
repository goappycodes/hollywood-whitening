import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { ConceptFooter, ConceptHeader } from "@/components/design-c/Chrome";
import "./concept.css";

const display = Funnel_Display({
  variable: "--font-hc-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Funnel_Sans({
  variable: "--font-hc-body",
  subsets: ["latin"],
  display: "swap",
});

// Design review pages: not part of the site yet, so they stay out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Concept C, kept apart from the current pages for client review; see concept.css for tokens. */
export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`hc ${display.variable} ${body.variable} flex min-h-dvh flex-col`}>
      <ConceptHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <ConceptFooter />
    </div>
  );
}
