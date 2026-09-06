/**
 * lib/analytics.ts — cookieless, PDPA-friendly event tracking.
 *
 * Pluggable: swap `backend` for Plausible/Umami once a project is provisioned
 * (see /docs/README.md). No cookies, no fingerprinting — just event names and a
 * small amount of intentional metadata.
 */

export type TrackEvent =
  | "wa_click"
  | "rider_send"
  | "ride_intent"
  | "beat_shared"
  | "gel_change"
  | "room_preview"
  | "enquiry_submit";

type Props = Record<string, string | number | boolean | undefined>;

function push(event: TrackEvent, props: Props): void {
  if (typeof window === "undefined") return;
  try {
    // CustomEvent for any local listeners; no-op if no backend is configured.
    window.dispatchEvent(
      new CustomEvent("da:track", { detail: { event, props } }),
    );
    // Swap in your provider here (Plausible / Umami) when configured.
  } catch {
    /* analytics must never break the page */
  }
}

export function track(event: TrackEvent, props: Props = {}): void {
  push(event, props);
}

/** Fire `wa_click` with source + intent, then open the WhatsApp link. */
export function trackWaClick(source: string, intent: string, url: string): void {
  track("wa_click", { source, intent });
  window.open(url, "_blank", "noopener,noreferrer");
}
