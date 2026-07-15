import { describe, expect, it } from "vitest";
import { buildDemoEvaluations } from "@/lib/sample-data";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { DecisionLevel } from "@/types/evaluation";

describe("buildDemoEvaluations", () => {
  const demoEvaluations = buildDemoEvaluations(DEFAULT_SETTINGS);

  it("creates exactly five demo records", () => {
    expect(demoEvaluations).toHaveLength(5);
  });

  it("flags every record as demo data", () => {
    expect(demoEvaluations.every((e) => e.isDemo === true)).toBe(true);
  });

  it("covers each of the five decision levels exactly once", () => {
    const decisions = demoEvaluations.map((e) => e.decision).sort();
    const expected: DecisionLevel[] = ["hard_no", "hell_yes", "qualified_yes", "soft_no", "yellow_flag"].sort() as DecisionLevel[];
    expect(decisions).toEqual(expected);
  });

  it("covers five distinct sectors", () => {
    const industries = new Set(demoEvaluations.map((e) => e.industry));
    expect(industries.size).toBe(5);
  });

  it("covers five distinct lead sources", () => {
    const leadSources = new Set(demoEvaluations.map((e) => e.leadSource));
    expect(leadSources.size).toBe(5);
  });

  it("spreads records across different months", () => {
    const months = new Set(demoEvaluations.map((e) => e.createdAt.slice(0, 7)));
    expect(months.size).toBeGreaterThanOrEqual(4);
  });

  it("includes at least one critical failure in the dataset", () => {
    const totalCriticalFailures = demoEvaluations.reduce((sum, e) => sum + e.criticalFailures.length, 0);
    expect(totalCriticalFailures).toBeGreaterThan(0);
  });

  it("forces hard_no on the record with a manual critical risk flag", () => {
    const hardNoRecord = demoEvaluations.find((e) => e.decision === "hard_no");
    expect(hardNoRecord?.criticalFailures.some((f) => f.id.startsWith("cf_manual_"))).toBe(true);
  });
});
