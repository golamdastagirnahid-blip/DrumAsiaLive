import { describe, it, expect } from "vitest";
import { getBranch, type Branch } from "@/config/business";
import {
  isOpenNow,
  nextTransition,
  formatCountdown,
  openWindows,
} from "@/lib/hours";

const hartamas = getBranch("hartamas");

function at(day: number, hour: number, minute = 0): Date {
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

describe("isOpenNow — Sri Hartamas (10:00–22:00 daily)", () => {
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

describe("nextTransition — Sri Hartamas", () => {
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
