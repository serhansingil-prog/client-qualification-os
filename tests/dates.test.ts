import { describe, expect, it } from "vitest";
import { addDays, daysBetween, isPastDate, isWithinLastNDays } from "@/lib/dates";

describe("daysBetween", () => {
  it("calculates the day difference between two ISO dates", () => {
    expect(daysBetween("2026-01-01", "2026-01-15")).toBe(14);
  });

  it("returns a negative number when the target date is earlier", () => {
    expect(daysBetween("2026-01-15", "2026-01-01")).toBe(-14);
  });

  it("returns NaN for invalid dates", () => {
    expect(daysBetween("not-a-date", "2026-01-01")).toBeNaN();
  });
});

describe("isPastDate", () => {
  it("returns true when the date is before the reference date", () => {
    expect(isPastDate("2020-01-01", "2026-01-01")).toBe(true);
  });

  it("returns false when the date is on or after the reference date", () => {
    expect(isPastDate("2026-06-01", "2026-01-01")).toBe(false);
  });
});

describe("addDays", () => {
  it("adds the given number of days to an ISO date", () => {
    const result = addDays("2026-01-01T00:00:00.000Z", 28);
    expect(daysBetween("2026-01-01T00:00:00.000Z", result)).toBe(28);
  });
});

describe("isWithinLastNDays", () => {
  it("returns true for a date within the window", () => {
    const now = new Date().toISOString();
    expect(isWithinLastNDays(now, 30, now)).toBe(true);
  });

  it("returns false for a date outside the window", () => {
    expect(isWithinLastNDays("2020-01-01", 30, "2026-01-01")).toBe(false);
  });
});
