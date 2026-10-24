/**
 * Store-locator data for /location-finder/ — the published YITH Store Locator
 * stores on Hollywood's WordPress, read from the `aw3/v1/providers` endpoint
 * (hollywood-wp: theme-customisations-master/custom/providers-api.php, same contract as allwhitelaser-next).
 *
 * Server-only. The whole list (~2,000 stores, nearly all in the UK) is fetched once
 * and cached for an hour; radius searches are filtered here rather than by a WP
 * call per search, so a visitor's search never waits on WordPress.
 *
 * WP_PROVIDERS_URL is the full endpoint URL. Use the `?rest_route=` form on
 * shop.hollywoodwhitening.com, where `/wp-json/<route>` answers a Cloudflare 502.
 */
import { cacheLife } from "next/cache";
import { wpServerHeaders } from "@/lib/wp-headers";

export type Provider = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  /** Distance from the search point, in km — set on radius searches only. */
  km?: number;
};

/**
 * Dev-only stand-in for when WP_PROVIDERS_URL isn't set or WordPress is down.
 * NOT real stores — invented names on real streets, so the map is developable
 * without the backend. Never served in production: a visitor could drive to one.
 */
const SAMPLE: Provider[] = [
  { id: 1, name: "Sample Smile Studio", lat: 51.5145, lng: -0.1447, address: "12 Wigmore Street", city: "London", country: "GB", phone: "+44 20 7000 0001" },
  { id: 2, name: "Sample Whitening Bar", lat: 51.5033, lng: -0.1195, address: "1 Belvedere Road", city: "London", country: "GB", email: "hello@example.com" },
  { id: 3, name: "Sample Aesthetics", lat: 53.4808, lng: -2.2426, address: "45 Deansgate", city: "Manchester", country: "GB", website: "example.com" },
];

/** Every published store with coordinates. Throws when WordPress can't be read, so a failure isn't cached. */
async function fetchAllProviders(url: string): Promise<Provider[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch(url, { headers: wpServerHeaders() });
  if (!res.ok) throw new Error(`Providers feed answered ${res.status}`);
  const data = (await res.json()) as Provider[];
  if (!Array.isArray(data)) throw new Error("Providers feed is not an array");
  // A store with no name renders as a blank card, and no coordinates means no pin.
  return data.filter((p) => p?.name?.trim() && Number.isFinite(p.lat) && Number.isFinite(p.lng) && (p.lat || p.lng));
}

export async function getProviders(): Promise<Provider[] | null> {
  const url = process.env.WP_PROVIDERS_URL;
  if (url) {
    try {
      return await fetchAllProviders(url);
    } catch (err) {
      console.error("[providers] WordPress feed unavailable", err);
    }
  }
  return process.env.NODE_ENV === "production" ? null : SAMPLE;
}

/** Great-circle distance between two points, in km. */
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Stores within `km` of a point, nearest first, each tagged with its distance. */
export function providersNear(all: Provider[], lat: number, lng: number, km: number): Provider[] {
  return all
    .map((p) => ({ ...p, km: Math.round(distanceKm(lat, lng, p.lat, p.lng) * 10) / 10 }))
    .filter((p) => p.km <= km)
    .sort((a, b) => a.km - b.km);
}
