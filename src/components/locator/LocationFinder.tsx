"use client";

/**
 * Store locator — the Next twin of the live YITH Store Locator, on the same map
 * engine (Google Maps JS API + Places autocomplete + a radius circle), ported from
 * allwhitelaser-next's ProviderMap.
 *
 * Flow, as on the live page: the map opens on the UK with no pins; the visitor
 * picks a point (address search or "Use my position") and only the stores inside
 * the chosen radius are fetched from /api/providers/. "View all stores" loads the
 * whole network.
 *
 * The Maps script is injected once at runtime, keyed by `mapsKey` — the
 * GOOGLE_MAPS_API_KEY env var, read on the server by LocatorSections and passed
 * down (a non-NEXT_PUBLIC_ variable never reaches client code). Without a key (or
 * if Google fails) the list still works for "Use my position" and "View all stores".
 */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Globe, Loader2, LocateFixed, Mail, MapPin, Navigation, Phone, Search, Store } from "lucide-react";
import { fill, type LocatorContent } from "@/lib/content";
import type { Provider } from "@/lib/providers";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any -- the Maps JS API is loaded at runtime and untyped here */
type G = any;

declare global {
  interface Window {
    google?: any;
    __hwGmapsPromise?: Promise<any>;
  }
}

/** Brand blue (--color-brand); the InfoWindow and pins are drawn outside Tailwind. */
const BRAND = "#1e88e5";
const UK = { center: { lat: 54.2, lng: -2.8 }, zoom: 5 };

/** Load the Maps JS API (with Places) once. `loading=async` needs importLibrary() before use. */
function loadGoogleMaps(key: string): Promise<G> {
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (window.__hwGmapsPromise) return window.__hwGmapsPromise;
  window.__hwGmapsPromise = new Promise((resolve, reject) => {
    const cb = "__hwGmapsReady";
    (window as G)[cb] = async () => {
      try {
        await window.google.maps.importLibrary("maps");
        await window.google.maps.importLibrary("places");
        resolve(window.google.maps);
      } catch (e) {
        reject(e);
      }
    };
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&v=weekly&loading=async&callback=${cb}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__hwGmapsPromise;
}

/** Brand-blue teardrop pin (SVG path, no image asset). Tip at (12, 22). */
function pinIcon(maps: G, active = false): G {
  return {
    path: "M12 0C6.5 0 2 4.4 2 9.9 2 17.3 12 22 12 22s10-4.7 10-12.1C22 4.4 17.5 0 12 0Zm0 13.6a3.7 3.7 0 1 1 0-7.4 3.7 3.7 0 0 1 0 7.4Z",
    fillColor: active ? "#0b3d7a" : BRAND,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.5,
    scale: active ? 1.7 : 1.4,
    anchor: new maps.Point(12, 22),
  };
}

const directionsUrl = (p: Provider) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
/** Stored websites are often bare ("www.foo.com"). */
const websiteHref = (w: string) => (/^https?:\/\//i.test(w) ? w : `https://${w}`);
const websiteLabel = (w: string) => w.replace(/^https?:\/\//i, "").replace(/\/$/, "");
/** YITH's full address usually already ends with the city — add it only when it's missing. */
const place = (p: Provider) =>
  p.city && !p.address.toLowerCase().includes(p.city.trim().toLowerCase())
    ? [p.address, p.city].filter(Boolean).join(", ")
    : p.address || p.city;

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** InfoWindow card (Google renders it as innerHTML, so every value is escaped). */
function infoCardHtml(p: Provider, t: LocatorContent["locator"]): string {
  const btn = (bg: string, fg: string, border: string) =>
    `display:inline-flex;align-items:center;padding:7px 12px;border-radius:999px;background:${bg};color:${fg};border:1px solid ${border};font-size:12px;font-weight:600;text-decoration:none;line-height:1`;
  const actions = [
    `<a href="${directionsUrl(p)}" target="_blank" rel="noopener" style="${btn(BRAND, "#fff", BRAND)}">${esc(t.directions)}</a>`,
    p.phone ? `<a href="tel:${esc(p.phone.replace(/\s/g, ""))}" style="${btn("#fff", "#0a0a0a", "#e5e9f0")}">${esc(t.call)}</a>` : "",
    p.email ? `<a href="mailto:${esc(p.email)}" style="${btn("#fff", "#0a0a0a", "#e5e9f0")}">${esc(t.email)}</a>` : "",
    p.website
      ? `<a href="${esc(websiteHref(p.website))}" target="_blank" rel="noopener" style="${btn("#fff", "#0a0a0a", "#e5e9f0")}">${esc(t.website)}</a>`
      : "",
  ].join("");
  return (
    `<div style="font-family:inherit;max-width:250px;padding:2px 4px 4px 2px">` +
    `<div style="font-weight:700;font-size:15px;color:#0a0a0a;line-height:1.25;margin-bottom:4px;padding-right:14px;overflow-wrap:anywhere">${esc(p.name)}</div>` +
    `<div style="font-size:12.5px;color:#5f6774;line-height:1.5;margin-bottom:12px;overflow-wrap:anywhere">${esc(place(p))}</div>` +
    `<div style="display:flex;flex-wrap:wrap;gap:6px">${actions}</div></div>`
  );
}

type Point = { lat: number; lng: number };
/** What the list currently shows: nothing yet, stores near a point, or every store. */
type Query = { kind: "near"; at: Point } | { kind: "all" } | null;

export function LocationFinder({ t, mapsKey }: { t: LocatorContent["locator"]; mapsKey?: string }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapsRef = useRef<G>(null);
  const mapRef = useRef<G>(null);
  const infoRef = useRef<G>(null);
  const markersRef = useRef<Map<number, G>>(new Map());
  const overlayRef = useRef<G[]>([]); // radius circle + "you are here" dot

  const [query, setQuery] = useState<Query>(null);
  const [radius, setRadius] = useState(t.radiusOptions[2] ?? 20);
  const radiusRef = useRef(radius);
  const abortRef = useRef<AbortController | null>(null);
  const [stores, setStores] = useState<Provider[]>([]);
  const [busy, setBusy] = useState<"locating" | "searching" | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false); // the feed request failed
  const [invalid, setInvalid] = useState(false); // typed address didn't geocode
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(!mapsKey);
  const [activeId, setActiveId] = useState<number | null>(null);

  /** Fetch the stores for a query; a newer search cancels the one in flight. */
  function search(next: NonNullable<Query>, km = radiusRef.current) {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setQuery(next);
    setLoading(true);
    setFailed(false);
    const url = next.kind === "all" ? "/api/providers/" : `/api/providers/?near=${next.at.lat},${next.at.lng}&km=${km}`;
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Provider[]) => {
        setStores(Array.isArray(data) ? data : []);
        setActiveId(null);
      })
      .catch((err) => {
        if (ctrl.signal.aborted) return;
        console.error("Location finder feed failed:", err);
        setStores([]);
        setFailed(true);
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false));
  }

  /* ---- map + autocomplete, once ---- */
  useEffect(() => {
    if (!mapsKey) return;
    let cancelled = false;
    loadGoogleMaps(mapsKey)
      .then((maps: G) => {
        if (cancelled || !mapEl.current || mapRef.current) return;
        mapsRef.current = maps;
        mapRef.current = new maps.Map(mapEl.current, {
          ...UK,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
          clickableIcons: false,
        });
        infoRef.current = new maps.InfoWindow();
        if (inputRef.current && maps.places?.Autocomplete) {
          const auto = new maps.places.Autocomplete(inputRef.current, { fields: ["geometry"], types: ["geocode"] });
          auto.addListener("place_changed", () => {
            const loc = auto.getPlace()?.geometry?.location;
            if (loc) {
              setInvalid(false);
              search({ kind: "near", at: { lat: loc.lat(), lng: loc.lng() } });
            }
          });
        }
        setMapReady(true);
      })
      .catch((err) => {
        console.error("Location finder map failed to load:", err);
        if (!cancelled) setMapError(true);
      });
    return () => {
      cancelled = true;
    };
    // search() only touches refs and state setters, so the first render's copy stays correct.
  }, [mapsKey]);

  function changeRadius(km: number) {
    setRadius(km);
    radiusRef.current = km;
    if (query?.kind === "near") search(query, km);
  }

  /* ---- draw pins, radius circle and the visitor's position ---- */
  useEffect(() => {
    const maps = mapsRef.current;
    const map = mapRef.current;
    if (!maps || !map || !mapReady) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current.clear();
    overlayRef.current.forEach((o) => o.setMap(null));
    overlayRef.current = [];
    infoRef.current?.close();

    const bounds = new maps.LatLngBounds();
    for (const p of stores) {
      const marker = new maps.Marker({ map, position: { lat: p.lat, lng: p.lng }, icon: pinIcon(maps), title: p.name });
      marker.addListener("click", () => setActiveId(p.id));
      markersRef.current.set(p.id, marker);
      bounds.extend(marker.getPosition());
    }

    if (query?.kind === "near") {
      const circle = new maps.Circle({
        map,
        center: query.at,
        radius: radius * 1000,
        strokeColor: BRAND,
        strokeOpacity: 0.6,
        strokeWeight: 1.5,
        fillColor: BRAND,
        fillOpacity: 0.06,
        clickable: false,
      });
      const me = new maps.Marker({
        map,
        position: query.at,
        zIndex: 1000,
        icon: { path: maps.SymbolPath.CIRCLE, scale: 7, fillColor: "#0b3d7a", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 3 },
      });
      overlayRef.current = [circle, me];
      map.fitBounds(circle.getBounds(), 24);
    } else if (stores.length) {
      map.fitBounds(bounds, 40);
    }
  }, [stores, query, radius, mapReady]);

  /* ---- the active store: highlighted pin + its card ---- */
  useEffect(() => {
    const maps = mapsRef.current;
    const map = mapRef.current;
    if (!maps || !map) return;
    markersRef.current.forEach((m, id) => {
      m.setIcon(pinIcon(maps, id === activeId));
      m.setZIndex(id === activeId ? 999 : undefined);
    });
    const p = stores.find((s) => s.id === activeId);
    const marker = activeId != null ? markersRef.current.get(activeId) : null;
    if (!p || !marker) {
      infoRef.current?.close();
      return;
    }
    infoRef.current.setContent(infoCardHtml(p, t));
    infoRef.current.open({ map, anchor: marker, shouldFocus: false });
    // Bring the card into view inside the list when a pin is clicked. Scrolls only the list
    // box — scrollIntoView would also scroll the page, dragging the map away on phones.
    const box = listRef.current;
    const card = document.getElementById(`store-${p.id}`);
    if (box && card && (card.offsetTop < box.scrollTop || card.offsetTop + card.offsetHeight > box.scrollTop + box.clientHeight))
      box.scrollTo({ top: card.offsetTop - 8, behavior: "smooth" });
  }, [activeId, stores, t]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return setInvalid(true);
    const maps = mapsRef.current;
    if (!maps) return setMapError(true);
    setBusy("searching");
    setInvalid(false);
    try {
      // Hitting Search without picking an autocomplete suggestion: geocode the raw text.
      const { results } = await new maps.Geocoder().geocode({ address: q });
      const loc = results?.[0]?.geometry?.location;
      if (loc) search({ kind: "near", at: { lat: loc.lat(), lng: loc.lng() } });
      else setInvalid(true);
    } catch {
      setInvalid(true);
    } finally {
      setBusy(null);
    }
  }

  function useMyPosition() {
    if (!navigator.geolocation) return;
    setBusy("locating");
    setInvalid(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(null);
        search({ kind: "near", at: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
      },
      () => setBusy(null),
      { timeout: 10000, maximumAge: 300000 },
    );
  }

  const status = busy === "locating" ? t.locating : busy === "searching" || loading ? t.searching : null;
  const summary =
    query && !loading && !failed
      ? query.kind === "all"
        ? fill(t.resultsAll, { n: stores.length })
        : fill(t.resultsNear, { n: stores.length, km: radius })
      : null;

  return (
    // Phones: edge to edge (cancelling container-x's px-5), so the map and controls get the full width.
    // grid-cols-1 (minmax(0,1fr)), not the implicit auto column: some store names are 40+
    // character URLs, and an auto column grows to fit them and pushes the card off-screen.
    <div className="-mx-5 grid grid-cols-1 overflow-hidden border-y border-line bg-white shadow-lift sm:mx-0 sm:rounded-[var(--radius-card)] sm:border lg:grid-cols-[minmax(0,380px)_1fr]">
      {/* ---- controls + results ---- */}
      <div className="flex flex-col border-b border-line lg:h-[640px] lg:border-r lg:border-b-0">
        <div className="space-y-4 border-b border-line p-5 sm:p-6">
          <form onSubmit={onSearch} className="flex gap-2" role="search">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                aria-label={t.searchPlaceholder}
                placeholder={t.searchPlaceholder}
                aria-invalid={invalid}
                aria-describedby={invalid ? "locator-invalid" : undefined}
                onChange={() => invalid && setInvalid(false)}
                className="h-12 w-full rounded-xl border border-line bg-pearl pr-3 pl-10 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-red-400"
              />
            </div>
            <button
              type="submit"
              disabled={busy === "searching"}
              aria-label={t.searchButton}
              className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
            >
              {busy === "searching" ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            </button>
          </form>
          {invalid && (
            <p id="locator-invalid" className="-mt-2 text-xs font-medium text-red-600">
              {t.invalidAddress}
            </p>
          )}

          {/* Equal halves, so long labels (ru, de) wrap inside their button instead of squeezing a row. */}
          <div className="grid grid-cols-2 gap-2 text-[13px] leading-tight font-semibold">
            <button
              type="button"
              onClick={useMyPosition}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand-sky/50 px-3 py-2 text-center text-brand transition-colors hover:border-brand hover:bg-brand-sky"
            >
              <LocateFixed className="size-4 shrink-0" aria-hidden /> {t.useMyPosition}
            </button>
            <button
              type="button"
              onClick={() => search({ kind: "all" })}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-center text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
            >
              <Store className="size-4 shrink-0" aria-hidden /> {t.viewAll}
            </button>
          </div>

          <fieldset>
            <legend className="mb-2 text-[11px] font-bold tracking-[0.16em] text-muted uppercase">{t.radiusLabel}</legend>
            <div className="grid grid-cols-4 gap-2">
              {t.radiusOptions.map((km) => (
                <label
                  key={km}
                  className="cursor-pointer rounded-full border border-line bg-pearl py-2 text-center text-sm font-semibold whitespace-nowrap text-ink transition-colors has-checked:border-brand has-checked:bg-brand has-checked:text-white has-focus-visible:ring-4 has-focus-visible:ring-brand/20"
                >
                  <input
                    type="radio"
                    name="radius"
                    value={km}
                    checked={radius === km}
                    onChange={() => changeRadius(km)}
                    className="sr-only"
                  />
                  {km} {t.km}
                </label>
              ))}
            </div>
          </fieldset>

          {summary && <p className="text-xs font-semibold text-muted" aria-live="polite">{summary}</p>}
        </div>

        {/* results — a fixed-height scroll box (2,000+ stores on "View all"); beside the map it
            fills the panel. `relative` makes it the offsetParent the active-card scroll measures from. */}
        <div ref={listRef} className="relative max-h-[440px] min-h-[180px] flex-1 overflow-y-auto overscroll-contain lg:max-h-none">
          {status ? (
            <p className="flex items-center justify-center gap-2 p-8 text-sm text-muted">
              <Loader2 className="size-4 animate-spin" aria-hidden /> {status}
            </p>
          ) : !query ? (
            <p className="p-8 text-center text-sm leading-relaxed text-muted">{t.prompt}</p>
          ) : failed ? (
            <p className="p-8 text-center text-sm leading-relaxed text-muted">{t.feedUnavailable}</p>
          ) : stores.length === 0 ? (
            <p className="p-8 text-center text-sm leading-relaxed text-muted">{t.noResults}</p>
          ) : (
            <ul className="divide-y divide-line">
              {stores.map((p) => {
                const active = p.id === activeId;
                return (
                  <li
                    key={p.id}
                    id={`store-${p.id}`}
                    onMouseEnter={() => setActiveId(p.id)}
                    className={cn("p-4 transition-colors sm:px-6", active ? "bg-brand-sky/60" : "hover:bg-pearl")}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(p.id)}
                      aria-expanded={active}
                      className="flex w-full items-start gap-3 text-left"
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg transition-colors",
                          active ? "bg-brand text-white" : "bg-brand-sky text-brand",
                        )}
                      >
                        <MapPin className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block leading-snug font-bold [overflow-wrap:anywhere] text-ink">{p.name}</span>
                        <span className="mt-0.5 block text-[13px] leading-snug [overflow-wrap:anywhere] text-muted">
                          {place(p)}
                        </span>
                      </span>
                      {p.km != null && (
                        <span className="shrink-0 rounded-full bg-pearl px-2 py-0.5 text-[11px] font-bold whitespace-nowrap text-muted">
                          {fill(t.away, { km: p.km })}
                        </span>
                      )}
                    </button>

                    {active && (
                      <div className="mt-3 ml-11 flex flex-col gap-1.5 text-[13px] font-semibold">
                        {p.phone && (
                          <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-ink hover:text-brand">
                            <Phone className="size-3.5 shrink-0 text-brand" aria-hidden /> {p.phone}
                          </a>
                        )}
                        {p.email && (
                          <a href={`mailto:${p.email}`} className="inline-flex items-center gap-2 break-all text-ink hover:text-brand">
                            <Mail className="size-3.5 shrink-0 text-brand" aria-hidden /> {p.email}
                          </a>
                        )}
                        {p.website && (
                          <a
                            href={websiteHref(p.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 break-all text-ink hover:text-brand"
                          >
                            <Globe className="size-3.5 shrink-0 text-brand" aria-hidden /> {websiteLabel(p.website)}
                          </a>
                        )}
                        <a
                          href={directionsUrl(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-brand hover:text-brand-deep"
                        >
                          <Navigation className="size-3.5 shrink-0" aria-hidden /> {t.directions}
                          <ArrowUpRight className="size-3" aria-hidden />
                        </a>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ---- map ---- */}
      <div className="relative order-first h-[380px] sm:h-[440px] lg:order-none lg:h-[640px]">
        {mapError ? (
          <div className="absolute inset-0 grid place-items-center bg-pearl p-8">
            <p className="max-w-xs text-center text-sm text-muted">{t.mapUnavailable}</p>
          </div>
        ) : (
          !mapReady && (
            <div className="absolute inset-0 z-[1] grid place-items-center bg-pearl">
              <Loader2 className="size-6 animate-spin text-muted" aria-hidden />
            </div>
          )
        )}
        <div ref={mapEl} className="size-full" />
      </div>
    </div>
  );
}
