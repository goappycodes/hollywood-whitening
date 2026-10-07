import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  trailingSlash: true,
  images: {
    // Static-host friendly (no /_next/image proxy), matching allwhitelaser-next.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.hollywoodwhitening.com" },
    ],
  },
};

export default nextConfig;
