import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  trailingSlash: true,
  // As allwhitelaser-next: some prerendered pages fetch WordPress at build time (homepage /
  // About blog strip, Instagram), and a slow upstream must not fail the build on Next's
  // default 60s per page. A "use cache" fill is cut off at 90% of this.
  staticPageGenerationTimeout: 300,
  images: {
    // Static-host friendly (no /_next/image proxy), matching allwhitelaser-next.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.hollywoodwhitening.com" },
      // Product video posters (ProductVideo).
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
