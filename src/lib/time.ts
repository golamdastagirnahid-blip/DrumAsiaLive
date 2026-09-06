/**
 * lib/time.ts — Kuala Lumpur wall-clock helpers.
 *
 * hours.ts operates on Date objects whose *local* fields represent KL wall
 * time (getDay/getHours etc.). `nowInKL()` builds such a Date from the live
 * `Asia/Kuala_Lumpur` zone regardless of where the visitor's device is —
 * the core "live KL time" requirement, correct on any device.
 */
export const KL_TIME_ZONE = "Asia/Kuala_Lumpur";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: KL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** A Date whose LOCAL fields equal the current Kuala Lumpur wall clock. */
export function nowInKL(): Date {
  const parts = formatter.formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "0";
  return new Date(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    Number(get("hour")),
    Number(get("minute")),
    Number(get("second")),
  );
}

/** KL wall-clock components (for timecode / slate rendering). */
export function klTimeParts(d: Date = new Date()) {
  const parts = formatter.formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "0";
  return {
    hours: Number(get("hour")),
    minutes: Number(get("minute")),
    seconds: Number(get("second")),
  };
}

/** "SAT 06 SEP 26" — film-slate date, KL time. */
export function slateStamp(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: KL_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("weekday").toUpperCase()} ${get("day")} ${get("month").toUpperCase()} ${get("year")}`;
}

/** Plain-language KL time for assistive tech, e.g. "3:24 PM". */
export function plainKLTime(d: Date = new Date(), locale = "en"): string {
  return new Intl.DateTimeFormat(locale === "ms" ? "ms-MY" : "en-MY", {
    timeZone: KL_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

