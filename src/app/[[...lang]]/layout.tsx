import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/**
 * Site chrome for the localised catch-all. It lives here rather than in the root layout
 * so that /design/* can review new page designs without the current header and footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
