import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { ConceptFooter, ConceptHeader } from "@/components/design-d/Chrome";
import { Sheen } from "@/components/design-d/Sheen";
import "./concept.css";

const body = Manrope({
  variable: "--font-hd-body",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-hd-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

// Design review pages: not part of the site yet, so they stay out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Concept D, kept apart from the current pages for client review; see concept.css for tokens. */
export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`hd ${body.variable} ${serif.variable} flex min-h-screen flex-col`}>
      <Sheen />
      <ConceptHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <ConceptFooter />
    </div>
  );
}
