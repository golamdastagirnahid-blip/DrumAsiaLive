/**
 * lib/hours.ts — pure, fully unit-tested opening-hours logic.
 *
 * Requirements (MILESTONE 1):
 *  - Handle the Kota Damansara OVERNIGHT window (Mon–Fri 18:00 → 05:00 next day).
 *  - Per-weekday variation.
 *  - Public-holiday overrides (override wins over the weekly schedule).
 *
 * Pure: every function takes `now` as a Date; nothing reads the wall clock itself.
 */
import {
  getBranch,
  type Branch,
  type DayHours,
  type Weekday,
} from "@/config/business";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export interface OpenWindow {
  opens: Date;
  closes: Date;
}

export interface HourTransition {
  type: "opens" | "closes";
  at: Date;
}

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseClock(clock: string, base: Date): Date {
  const [h, m] = clock.split(":").map((n) => Number(n));
  const out = new Date(base);
  out.setHours(h ?? 0, m ?? 0, 0, 0);
  return out;
}

/** Expand one day's `DayHours` into absolute open/close windows. */
function dayWindows(dayHours: DayHours | null, dayStart: Date): OpenWindow[] {
  if (!dayHours) return [];
  return dayHours.map((iv) => {
    const opens = parseClock(iv.opens, dayStart);
    let closes = parseClock(iv.closes, dayStart);
    if (iv.closeOnNextDay) closes = new Date(closes.getTime() + DAY);
    return { opens, closes };
  });
}

/** Resolve the effective `DayHours` for a calendar date (holiday-aware). */
function scheduleForDate(branch: Branch, date: Date): DayHours | null {
  const holiday = branch.holidays.find((h) => h.date === isoDate(date));
  if (holiday) {
    if (holiday.hours === "default") return weeklyHours(branch, date);
    return holiday.hours;
  }
  return weeklyHours(branch, date);
}

function weeklyHours(branch: Branch, date: Date): DayHours | null {
  const weekday = date.getDay() as Weekday;
  return branch.hours?.[weekday] ?? null;
}

/**
 * Every open window that can possibly cover `now`: today's schedule plus the
 * previous day's overnight windows (e.g. Kota Mon 18:00 → Tue 05:00).
 */
export function openWindows(branch: Branch, now: Date): OpenWindow[] {
  const today = startOfDay(now);
  const windows: OpenWindow[] = [];

  windows.push(...dayWindows(scheduleForDate(branch, today), today));

  const yesterday = new Date(today.getTime() - DAY);
  const yestStart = startOfDay(yesterday);
  const yest = dayWindows(scheduleForDate(branch, yesterday), yestStart).filter(
    (w) => w.closes.getTime() > today.getTime(), // only windows spilling into today
  );
  windows.push(...yest);

  return windows.filter((w) => w.opens.getTime() < w.closes.getTime());
}

/** Is the branch open right now? */
export function isOpenNow(branch: Branch, now: Date = new Date()): boolean {
  const t = now.getTime();
  return openWindows(branch, now).some((w) => t >= w.opens.getTime() && t < w.closes.getTime());
}

/** Convenience wrapper taking a branch id. */
export function isOpenNowById(
  branchId: Branch["id"],
  now: Date = new Date(),
): boolean {
  return isOpenNow(getBranch(branchId), now);
}

/**
 * The next open/close event strictly after `now`. Scans from yesterday (to catch
 * a currently-running overnight window's close) through the next 8 days.
 */
export function nextTransition(
  branch: Branch,
  now: Date = new Date(),
): HourTransition | null {
  const t = now.getTime();
  let best: HourTransition | null = null;

  for (let i = -1; i <= 8; i++) {
    const day = new Date(startOfDay(now).getTime() + i * DAY);
    for (const w of dayWindows(scheduleForDate(branch, day), day)) {
      const candidates: HourTransition[] = [
        { type: "opens", at: w.opens },
        { type: "closes", at: w.closes },
      ];
      for (const c of candidates) {
        if (c.at.getTime() > t && (!best || c.at.getTime() < best.at.getTime())) {
          best = c;
        }
      }
    }
  }
  return best;
}

/**
 * "02:13" under an hour, "1:02:13" beyond — mono, zero-padded.
 */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const ss = String(s).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export interface OpeningStatus {
  open: boolean;
  /** `CLOSES IN 02:13` / `OPENS 18:00` / `CLOSED TODAY` style countdown. */
  countdown: string | null;
}

/** Plain-language status for the Transport Bar. */
export function openingStatus(
  branch: Branch,
  now: Date = new Date(),
): OpeningStatus {
  const open = isOpenNow(branch, now);
  const next = nextTransition(branch, now);
  if (!next) return { open, countdown: null };

  const delta = next.at.getTime() - now.getTime();
  if (open) {
    return { open, countdown: formatCountdown(delta) };
  }
  if (delta > DAY) return { open, countdown: "CLOSED TODAY" };
  return { open, countdown: formatCountdown(delta) };
}
