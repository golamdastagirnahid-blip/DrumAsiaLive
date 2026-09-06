/**
 * /config/rides.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * E-hailing / navigation deep-link templates for the Load-In module.
 *
 * The Grab URL below is the documented, public deep-link scheme:
 *     https://grab.com/l?lat=<lat>&lng=<lng>&text=<name>
 * It was verified against Grab's public developer documentation at build time.
 * Destination name and coordinates are injected from /config/business.ts.
 *
 * [CONFIRM] whether the client wants to apply to Grab's partner programme for
 * attribution — see /docs/OPEN-QUESTIONS.md.
 */

export interface RideTarget {
  name: string;
  lat: number;
  lng: number;
}

export function grabDeepLink(target: RideTarget): string {
  const params = new URLSearchParams({
    lat: target.lat.toFixed(6),
    lng: target.lng.toFixed(6),
    text: target.name,
  });
  return `https://grab.com/l?${params.toString()}`;
}

export function wazeLink(query: string, target: RideTarget): string {
  // Waze query link (client publishes the search term "Drum Asia Hartamas").
  return `https://waze.com/ul?q=${encodeURIComponent(query)}&ll=${target.lat.toFixed(
    6,
  )}%2C${target.lng.toFixed(6)}&navigate=yes`;
}

export function googleMapsLink(target: RideTarget): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    target.name,
  )}`;
}

export function appleMapsLink(target: RideTarget): string {
  return `https://maps.apple.com/?daddr=${target.lat.toFixed(6)},${target.lng.toFixed(6)}&q=${encodeURIComponent(target.name)}`;
}
