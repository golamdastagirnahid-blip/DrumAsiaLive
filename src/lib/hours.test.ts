import { describe, it, expect } from "vitest";
import { getBranch, type Branch } from "@/config/business";
import {
  isOpenNow,
  nextTransition,
  formatCountdown,
  openWindows,
} from "@/lib/hours";

const hartamas = getBranch("hartamas");
const kota = getBranch("kota-damansara");

function at(day: number, hour: number, minute = 0): Date {
  // `day` is a weekday offset from a known Monday: 2026-09-07 is a Monday.
  // Constructed in LOCAL time so the test is timezone-independent — it must
  // match hours.ts, which reads local getDay()/getHours().
  // Mon = 2026-09-07, Tue = 08 … Sun = 2026-09-13.
  return new Date(2026, 8, 7 + day, hour, minute, 0, 0);
}

// day offsets from Monday: Mon=0 … Sun=6
const MON = 0, TUE = 1, WED = 2, THU = 3, FRI = 4, SAT = 5, SUN = 6;

describe("formatCountdown", () => {
  it("pads minutes/seconds under an hour", () => {
    expect(formatCountdown(133_000)).toBe("02:13");
    expect(formatCountdown(0)).toBe("00:00");
    expect(formatCountdown(59_000)).toBe("00:59");
  });
  it("shows hours beyond 59:59", () => {
    expect(formatCountdown(3_733_000)).toBe("1:02:13");
  });
  it("never goes negative", () => {
    expect(formatCountdown(-5_000)).toBe("00:00");
  });
});

describe("isOpenNow — Kota Damansara (Mon–Fri 18:00 → 05:00 overnight)", () => {
  it("is open on a weekday evening", () => {
    expect(isOpenNow(kota, at(TUE, 19, 0))).toBe(true);
  });
  it("is still open late the same night", () => {
    expect(isOpenNow(kota, at(TUE, 23, 30))).toBe(true);
  });
  it("is open at 03:00 — the overnight window from the previous day", () => {
    // Monday 18:00 → Tuesday 05:00; 03:00 Tuesday is inside it.
    expect(isOpenNow(kota, at(TUE, 3, 0))).toBe(true);
  });
  it("closes at 05:00 sharp", () => {
    expect(isOpenNow(kota, at(TUE, 5, 0))).toBe(false);
  });
  it("is closed at 10:00 on a weekday", () => {
    expect(isOpenNow(kota, at(TUE, 10, 0))).toBe(false);
  });
  it("is closed on Saturday (weekend hours not captured)", () => {
    expect(isOpenNow(kota, at(SAT, 20, 0))).toBe(false);
  });
  it("is closed on Sunday", () => {
    expect(isOpenNow(kota, at(SUN, 20, 0))).toBe(false);
  });
  it("is closed at 04:59 and open at 05:00 on Saturday (no Friday spill — Fri closed)", () => {
    // Friday 18:00 → Saturday 05:00 (Fri is a weekday) so Sat 03:00 IS open.
    expect(isOpenNow(kota, at(SAT, 3, 0))).toBe(true);
    expect(isOpenNow(kota, at(SAT, 5, 0))).toBe(false);
  });
});

describe("isOpenNow — Hartamas (10:00–22:00 daily)", () => {
  it("is open mid-afternoon", () => {
    expect(isOpenNow(hartamas, at(WED, 15, 0))).toBe(true);
  });
  it("is closed at 09:00", () => {
    expect(isOpenNow(hartamas, at(WED, 9, 0))).toBe(false);
  });
  it("is closed at 23:00", () => {
    expect(isOpenNow(hartamas, at(WED, 23, 0))).toBe(false);
  });
});

describe("nextTransition", () => {
  it("closed weekday morning → opens at 18:00", () => {
    const t = nextTransition(kota, at(TUE, 10, 0));
    expect(t?.type).toBe("opens");
    expect(t?.at.getHours()).toBe(18);
    expect(t?.at.getMinutes()).toBe(0);
  });
  it("open overnight (Tue 03:00) → closes at 05:00 same day", () => {
    const t = nextTransition(kota, at(TUE, 3, 0));
    expect(t?.type).toBe("closes");
    expect(t?.at.getHours()).toBe(5);
    expect(t?.at.getDate()).toBe(at(TUE, 3, 0).getDate());
  });
  it("closed Saturday → next opens Monday 18:00 (Sunday closed)", () => {
    const t = nextTransition(kota, at(SAT, 12, 0));
    expect(t?.type).toBe("opens");
    expect(t?.at.getDay()).toBe(1); // Monday
    expect(t?.at.getHours()).toBe(18);
  });
  it("Hartamas Sunday 23:00 → opens Monday 10:00", () => {
    const t = nextTransition(hartamas, at(SUN, 23, 0));
    expect(t?.type).toBe("opens");
    expect(t?.at.getDay()).toBe(1);
    expect(t?.at.getHours()).toBe(10);
  });
  it("open evening → closes at 22:00 (Hartamas)", () => {
    const t = nextTransition(hartamas, at(WED, 20, 0));
    expect(t?.type).toBe("closes");
    expect(t?.at.getHours()).toBe(22);
  });
});

describe("public-holiday overrides", () => {
  const holidayBranch: Branch = {
    ...hartamas,
    holidays: [
      {
        name: "Hari Kebangsaan",
        date: "2026-09-09", // Wednesday
        hours: null, // closed
      },
    ],
  };

  it("closed when a holiday says closed, even on a normal open day", () => {
    expect(isOpenNow(holidayBranch, at(WED, 15, 0))).toBe(false);
  });
  it("uses the weekly schedule when the holiday says 'default'", () => {
    const defaultBranch: Branch = {
      ...hartamas,
      holidays: [{ name: "X", date: "2026-09-09", hours: "default" }],
    };
    expect(isOpenNow(defaultBranch, at(WED, 15, 0))).toBe(true);
  });
  it("openWindows returns nothing on a closed holiday", () => {
    expect(openWindows(holidayBranch, at(WED, 15, 0))).toEqual([]);
  });
});
