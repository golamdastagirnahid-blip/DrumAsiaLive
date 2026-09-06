/**
 * lib/whatsapp.ts — the single WhatsApp transaction utility (R2).
 *
 * Every enquiry, booking, rental and quote is completed by generating a
 * structured, human-readable WhatsApp message and opening wa.me/60125161620
 * with it URL-encoded. No payment integration exists anywhere on the site.
 * Never duplicate message-building logic — every button calls buildWhatsAppLink.
 */
import { business } from "@/config/business";
import { makeRefCode } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * Typed payload union — one variant per intent.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface BasePayload {
  /** Intent slug (analytics + routing). */
  intent: string;
  /** Human page/source label — "Backline — Studio Ori". */
  source: string;
  /** Optional pre-generated reference code. */
  refCode?: string;
  /** Optional contact name to pre-fill. */
  name?: string;
}

export interface RoomBookingPayload extends BasePayload {
  intent: "room_booking";
  branch?: string;
  room?: string;
  date?: string;
  time?: string;
  duration?: string;
  notes?: string;
}

export interface RentalRiderPayload extends BasePayload {
  intent: "rental_rider";
  dates?: string;
  branch?: string;
  delivery?: string;
  lines?: { item: string; qty: number; rate: string }[];
  total?: string;
}

export interface VenueHirePayload extends BasePayload {
  intent: "venue_hire";
  eventType?: string;
  date?: string;
  headcount?: string;
  notes?: string;
}

export interface ProductionQuotePayload extends BasePayload {
  intent: "production_quote";
  eventType?: string;
  date?: string;
  venue?: string;
  headcount?: string;
  budget?: string;
}

export interface RecordingPayload extends BasePayload {
  intent: "recording";
  service?: string;
  date?: string;
  notes?: string;
}

export interface StoreItemPayload extends BasePayload {
  intent: "store_item";
  item?: string;
  model?: string;
}

export interface SellGearPayload extends BasePayload {
  intent: "sell_gear";
  brand?: string;
  model?: string;
  condition?: string;
  asking?: string;
}

export interface MepEnquiryPayload extends BasePayload {
  intent: "mep_enquiry";
  student?: string;
  notes?: string;
}

export interface MembershipPayload extends BasePayload {
  intent: "membership";
  notes?: string;
}

export interface GeneralPayload extends BasePayload {
  intent: "general";
  subject?: string;
  message?: string;
}

export type WhatsAppPayload =
  | RoomBookingPayload
  | RentalRiderPayload
  | VenueHirePayload
  | ProductionQuotePayload
  | RecordingPayload
  | StoreItemPayload
  | SellGearPayload
  | MepEnquiryPayload
  | MembershipPayload
  | GeneralPayload;

/* ──────────────────────────────────────────────────────────────────────────── */

function lines(...rows: Array<string | null | undefined>): string {
  return rows.filter((r) => r != null && r !== "").join("\n");
}

function renderBase(p: BasePayload): string {
  return lines(
    `*${p.intent.replace(/_/g, " ").toUpperCase()}*`,
    p.refCode ? `Ref: ${p.refCode}` : null,
    `Page: ${p.source}`,
  );
}

function renderPayload(p: WhatsAppPayload): string {
  switch (p.intent) {
    case "room_booking":
      return lines(
        renderBase(p),
        "———",
        p.branch ? `Branch: ${p.branch}` : null,
        p.room ? `Room: ${p.room}` : null,
        p.date ? `Date: ${p.date}` : null,
        p.time ? `Time: ${p.time}` : null,
        p.duration ? `Duration: ${p.duration}` : null,
        p.name ? `Name: ${p.name}` : null,
        p.notes ? `Notes: ${p.notes}` : null,
      );
    case "rental_rider":
      return lines(
        renderBase(p),
        "———",
        p.dates ? `Dates: ${p.dates}` : null,
        p.branch ? `Branch: ${p.branch}` : null,
        p.delivery ? `Collection: ${p.delivery}` : null,
        p.lines && p.lines.length
          ? `Lines:\n${p.lines
              .map((l) => `• ${l.qty} × ${l.item} — ${l.rate}`)
              .join("\n")}`
          : null,
        p.total ? `Estimate total: ${p.total}` : null,
        p.name ? `Contact: ${p.name}` : null,
      );
    case "venue_hire":
      return lines(
        renderBase(p),
        "———",
        p.eventType ? `Event type: ${p.eventType}` : null,
        p.date ? `Date: ${p.date}` : null,
        p.headcount ? `Headcount: ${p.headcount}` : null,
        p.name ? `Name: ${p.name}` : null,
        p.notes ? `Notes: ${p.notes}` : null,
      );
    case "production_quote":
      return lines(
        renderBase(p),
        "———",
        p.eventType ? `Event type: ${p.eventType}` : null,
        p.date ? `Date: ${p.date}` : null,
        p.venue ? `Venue: ${p.venue}` : null,
        p.headcount ? `Headcount: ${p.headcount}` : null,
        p.budget ? `Budget band: ${p.budget}` : null,
        p.name ? `Name: ${p.name}` : null,
      );
    case "recording":
      return lines(
        renderBase(p),
        "———",
        p.service ? `Service: ${p.service}` : null,
        p.date ? `Date: ${p.date}` : null,
        p.name ? `Name: ${p.name}` : null,
        p.notes ? `Notes: ${p.notes}` : null,
      );
    case "store_item":
      return lines(
        renderBase(p),
        "———",
        p.item ? `Item: ${p.item}` : null,
        p.model ? `Model: ${p.model}` : null,
        p.name ? `Name: ${p.name}` : null,
      );
    case "sell_gear":
      return lines(
        renderBase(p),
        "———",
        p.brand ? `Brand: ${p.brand}` : null,
        p.model ? `Model: ${p.model}` : null,
        p.condition ? `Condition: ${p.condition}` : null,
        p.asking ? `Asking price: ${p.asking}` : null,
        p.name ? `Name: ${p.name}` : null,
      );
    case "mep_enquiry":
      return lines(
        renderBase(p),
        "———",
        p.student ? `Student: ${p.student}` : null,
        p.name ? `Name: ${p.name}` : null,
        p.notes ? `Notes: ${p.notes}` : null,
      );
    case "membership":
      return lines(
        renderBase(p),
        "———",
        p.name ? `Name: ${p.name}` : null,
        p.notes ? `Notes: ${p.notes}` : null,
      );
    case "general":
      return lines(
        renderBase(p),
        "———",
        p.subject ? `Subject: ${p.subject}` : null,
        p.name ? `Name: ${p.name}` : null,
        p.message ? p.message : null,
      );
  }
}

const FOOTER = "— sent from drumasia website";

/**
 * Build the full `https://wa.me/...` URL for a payload.
 * The message body is URL-encoded (newlines, emoji and diacritics included).
 *
 * IMPORTANT — this function is DETERMINISTIC. A reference code is included only
 * when one is supplied (payload.refCode or options.refCode). It must never call
 * `Math.random()` itself, because it is used inside Server-Rendered Client
 * Components (header, footer, transport bar) and random output there causes a
 * React hydration mismatch. Generate reference codes at CLICK time instead —
 * see `openWhatsApp()` below.
 */
export function buildWhatsAppLink(
  payload: WhatsAppPayload,
  options?: { number?: string; refCode?: string },
): string {
  const refCode = payload.refCode ?? options?.refCode ?? null;
  const body = `${renderPayload({ ...payload, refCode: refCode ?? undefined })}\n\n${FOOTER}`;
  const number = (options?.number ?? business.whatsappNumber).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(body)}`;
}

/** The raw message body (useful for previews and email fallbacks). Deterministic. */
export function buildWhatsAppMessage(
  payload: WhatsAppPayload,
  refCode?: string,
): string {
  const finalRef = payload.refCode ?? refCode ?? null;
  return `${renderPayload({ ...payload, refCode: finalRef ?? undefined })}\n\n${FOOTER}`;
}

/**
 * Open WhatsApp for a payload in a new tab. Runs on the client (click time), so
 * it safely generates a fresh reference code before opening. Falls back to
 * same-tab navigation if the popup is blocked. Returns the URL that was used.
 */
export function openWhatsApp(
  payload: WhatsAppPayload,
  options?: { number?: string; refCode?: string },
): string {
  const refCode = payload.refCode ?? options?.refCode ?? makeRefCode();
  const url = buildWhatsAppLink(payload, { number: options?.number, refCode });
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url;
  return url;
}
