import { describe, expect, it } from "vitest";
import { buildDemoEvaluations } from "@/lib/sample-data";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { DecisionLevel } from "@/types/evaluation";

describe("buildDemoEvaluations", () => {
  const demoEvaluations = buildDemoEvaluations(DEFAULT_SETTINGS);

  it("creates exactly fifteen demo records", () => {
    expect(demoEvaluations).toHaveLength(15);
  });

  it("flags every record as demo data", () => {
    expect(demoEvaluations.every((e) => e.isDemo === true)).toBe(true);
  });

  it("covers all five decision levels", () => {
    const decisions = new Set(demoEvaluations.map((e) => e.decision));
    const expected: DecisionLevel[] = ["hard_no", "hell_yes", "qualified_yes", "soft_no", "yellow_flag"];
    expected.forEach((level) => expect(decisions.has(level)).toBe(true));
  });

  it("covers more than five distinct sectors", () => {
    const industries = new Set(demoEvaluations.map((e) => e.industry));
    expect(industries.size).toBeGreaterThan(5);
  });

  it("covers more than five distinct lead sources", () => {
    const leadSources = new Set(demoEvaluations.map((e) => e.leadSource));
    expect(leadSources.size).toBeGreaterThan(5);
  });

  // The extra ten records exist to give the connection graph real clusters
  // instead of fifteen disconnected pairs — assert those clusters actually
  // land where the graph will look for them.
  it("clusters four records under the E-ticaret sector", () => {
    const count = demoEvaluations.filter((e) => e.industry === "E-ticaret").length;
    expect(count).toBe(4);
  });

  it("clusters three records under the Referans lead source", () => {
    const count = demoEvaluations.filter((e) => e.leadSource === "Referans").length;
    expect(count).toBe(3);
  });

  it("clusters at least three records under a shared budget_fit critical risk", () => {
    const count = demoEvaluations.filter((e) =>
      e.criticalFailures.some((f) => f.criterionId === "budget_fit")
    ).length;
    expect(count).toBeGreaterThanOrEqual(3);
  });

  it("spreads records across different months", () => {
    const months = new Set(demoEvaluations.map((e) => e.createdAt.slice(0, 7)));
    expect(months.size).toBeGreaterThanOrEqual(4);
  });

  it("includes at least one critical failure in the dataset", () => {
    const totalCriticalFailures = demoEvaluations.reduce((sum, e) => sum + e.criticalFailures.length, 0);
    expect(totalCriticalFailures).toBeGreaterThan(0);
  });

  it("forces hard_no on every record with a manual critical risk flag", () => {
    const withManualFlag = demoEvaluations.filter((e) =>
      e.criticalFailures.some((f) => f.id.startsWith("cf_manual_"))
    );
    expect(withManualFlag.length).toBeGreaterThan(0);
    expect(withManualFlag.every((e) => e.decision === "hard_no")).toBe(true);
  });
});
