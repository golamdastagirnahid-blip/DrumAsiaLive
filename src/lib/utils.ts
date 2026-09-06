import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware class merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip a phone to E.164 digits for wa.me links. */
export function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
}

/** Format a number as Malaysian Ringgit, mono-friendly, or `RM—` when null. */
export function formatRM(amount: number | null | undefined): string {
  if (amount == null) return "RM—";
  return `RM${amount.toLocaleString("en-MY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** A short reference code, e.g. `DA-9F3K2`. */
export function makeRefCode(prefix = "DA"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I
  const chars = Array.from({ length: 5 }, () =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
  ).join("");
  return `${prefix}-${chars}`;
}

/** "06 SEP 2026" style slate date from a Date. */
export function slateDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  })
    .format(d)
    .split(" ");
  const day = parts[0] ?? "";
  const month = (parts[1] ?? "").toUpperCase();
  const year = parts[2] ?? "";
  return `${day} ${month} ${year}`;
}

export const KL_TIME_ZONE = "Asia/Kuala_Lumpur";
