/**
 * Locale-independent site data: constants, media, ratings and navigation structure.
 * All copy lives in src/content/<locale>/ (see src/lib/content.ts); links are built
 * from page keys via src/lib/i18n.ts so they resolve to the right locale's URL.
 */

export const SITE = {
  name: "Hollywood Whitening",
  legalName: "Hollywood Whitening™",
  url: "https://www.hollywoodwhitening.com",
  phones: [
    { label: "UK", display: "+44 (0)20 3137 2502", href: "tel:+442031372502" },
    { label: "USA", display: "+1 650 515 3583", href: "tel:+16505153583" },
  ],
  bookingLoginUrl: "https://uk.bookingbug.com/public/simple_login/",
  social: {
    instagram: "https://www.instagram.com/hollywoodwhitening/",
    facebook: "https://www.facebook.com/hollywoodteethwhitening",
    youtube: "https://www.youtube.com/channel/UCZyU4DuYEPGIzA2e3r-HjbQ",
  },
  instagramHandle: "hollywoodwhitening",
} as const;

/* ------------------------------------------------------------------ */
/* Navigation (labels come from common.json → nav / navDescriptions)   */
/* ------------------------------------------------------------------ */

export type NavLabelKey = "home" | "scienceFaq" | "science" | "faq" | "products" | "training" | "about" | "blog" | "providers";

export type NavItem = {
  label: NavLabelKey;
  page: import("./i18n").PageKey;
  children?: { page: import("./i18n").PageKey; label?: NavLabelKey; name?: string }[];
};

export const NAV: NavItem[] = [
  { label: "home", page: "home" },
  {
    label: "scienceFaq",
    page: "science",
    children: [
      { page: "science", label: "science" },
      { page: "faq", label: "faq" },
    ],
  },
  {
    label: "products",
    page: "shop",
    children: [
      { page: "star-one", name: "Star One™" },
      { page: "comet-2", name: "Comet 2™" },
      { page: "galaxy", name: "Galaxy™" },
    ],
  },
  { label: "training", page: "training" },
  { label: "about", page: "about" },
  { label: "blog", page: "blog" },
  { label: "providers", page: "providers" },
];

/* ------------------------------------------------------------------ */
/* Homepage media & data                                               */
/* ------------------------------------------------------------------ */

export const HERO_MEDIA = {
  video: "/video/hero.mp4",
  poster: "/video/hero-poster.jpg",
};

export const STAT_VALUES = [
  { value: "20+", icon: "award" },
  { value: "3", icon: "globe" },
  { value: "$2.5bn", icon: "trend" },
  { value: "4.9", icon: "star" },
] as const;

export const GLOBAL_IMAGE = "/images/teeth-guys.jpg";

export type PackageSlug = "star-one" | "comet-2" | "galaxy";

export type Package = {
  slug: PackageSlug;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  results: number;
  featured?: boolean;
};

export const PACKAGES: Package[] = [
  { slug: "star-one", name: "Star One™", image: "/images/star-one.jpg", rating: 5.0, reviews: 9, results: 8 },
  { slug: "comet-2", name: "Comet 2™", image: "/images/comet-2.jpg", rating: 4.93, reviews: 14, results: 10, featured: true },
  { slug: "galaxy", name: "Galaxy™", image: "/images/galaxy.png", rating: 4.78, reviews: 9, results: 10 },
];

export const TECHNOLOGY_MEDIA = {
  image: "/images/portrait.jpg",
  gallery: ["/images/tech-1.png", "/images/tech-2.png"],
};

export const PILLAR_ICONS = ["training", "machine", "business", "globe"] as const;

export const TREND_IMAGE = "/images/banana-white.jpg";

/** Blog card images, in the order posts appear in home.json → blogFaq.posts (same on every locale). */
export const POST_IMAGES = [
  "/images/blog/How-Long-to-Keep-Whitening-Gel-on-Teeth.jpg",
  "/images/blog/Heal-and-Prevent-Teeth-Whitening-Gum-Burns-.jpg",
  "/images/blog/White-Spots-on-Teeth-After-Whitening.jpg",
  "/images/blog/How-Does-Teeth-Whitening-Work.jpg",
  "/images/blog/How-Long-Does-Teeth-Bleach-Last.jpg",
];

export const PROVIDER_IMAGE = "/images/smile-banner.jpg";
