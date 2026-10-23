import { NextResponse } from "next/server";
import { getProviders, providersNear } from "@/lib/providers";

/**
 * Store feed for the /location-finder/ map (src/lib/providers.ts):
 *
 *   GET /api/providers/                        → every store ("View all stores")
 *   GET /api/providers/?near=51.5,-0.12&km=20  → stores within 20 km, nearest first
 *
 * Proxied rather than called from the browser so the WordPress host stays out of
 * the client and the list is cached server-side.
 */
export async function GET(req: Request) {
  const all = await getProviders();
  if (!all) return NextResponse.json({ error: "Store feed unavailable" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const near = searchParams.get("near")?.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
  // A malformed `near` must not silently return the whole network as a "nearby" result.
  if (searchParams.has("near") && !near) return NextResponse.json({ error: "Bad near" }, { status: 400 });
  if (!near) return NextResponse.json(all);

  const km = Math.min(500, Math.max(1, Number(searchParams.get("km")) || 20));
  return NextResponse.json(providersNear(all, Number(near[1]), Number(near[2]), km));
}
