import type { Metadata, Viewport } from "next";
import { Dancing_Script, Marck_Script, Montserrat, Sora } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HtmlLang } from "@/components/site/HtmlLang";
import { getHomeContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import "./globals.css";

// Montserrat + Dancing Script are the live site's typefaces. Cyrillic is needed for /ru/.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

// Display face for hero headlines — variable weight for light/bold contrast.
// Latin only: Cyrillic glyphs fall back to Montserrat via --font-display.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
});

// Dancing Script has no Cyrillic; Marck Script replaces it inside Russian content
// (see the [lang|="ru"] rule in globals.css), so it is only downloaded on /ru/.
const marck = Marck_Script({
  variable: "--font-marck",
  subsets: ["latin", "cyrillic"],
  weight: "400",
  display: "swap",
  preload: false,
});

const home = getHomeContent("en");

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: home.meta.title,
    template: `%s | ${SITE.legalName}`,
  },
  description: home.meta.description,
  icons: { icon: "/images/favicon.png" },
  openGraph: {
    type: "website",
    siteName: SITE.legalName,
    images: [{ url: "/images/bg-white.jpg", width: 2560, height: 1440 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050b1a",
  // The design is light-only. "only light" also opts out of browsers' automatic
  // dark mode, which otherwise darkens sections that have no background of their own.
  colorScheme: "only light",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/images/logo.png`,
  telephone: SITE.phones[0].href.replace("tel:", ""),
  sameAs: Object.values(SITE.social),
};

/**
 * <html lang> is en-GB for SSR (as in allwhitelaser-next); <HtmlLang> corrects it
 * from the URL on the client, and localised wrappers carry `lang` pre-hydration.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${montserrat.variable} ${sora.variable} ${dancing.variable} ${marck.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables scroll-reveal hiding only when JS runs (see globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <HtmlLang />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
