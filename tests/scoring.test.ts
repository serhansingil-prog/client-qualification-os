import { describe, expect, it } from "vitest";
import {
  calculateConfidenceLevel,
  calculateDecisionLevel,
  calculateEvaluationResult,
  calculateStandardScore,
  calculateWeightedScore,
  detectCriticalFailures,
  simulateEvaluationChanges,
} from "@/lib/scoring";
import { CRITERIA_DEFINITIONS } from "@/lib/criteria";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { CriterionAnswer } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";

function buildAnswer(overrides: Partial<CriterionAnswer> & { criterionId: string }): CriterionAnswer {
  return {
    status: "not_evaluated",
    score: null,
    weight: 1,
    notes: "",
    isCriticalRisk: false,
    ...overrides,
  };
}

function allQualifiedAnswers(): CriterionAnswer[] {
  return CRITERIA_DEFINITIONS.map((criterion) =>
    buildAnswer({ criterionId: criterion.id, status: "qualified", weight: criterion.weight })
  );
}

const settings: AgencySettings = DEFAULT_SETTINGS;

describe("calculateStandardScore", () => {
  it("returns 10 when every evaluated criterion is qualified", () => {
    expect(calculateStandardScore(allQualifiedAnswers())).toBe(10);
  });

  it("returns 0 when there are no evaluated criteria", () => {
    const answers = CRITERIA_DEFINITIONS.map((c) => buildAnswer({ criterionId: c.id }));
    expect(calculateStandardScore(answers)).toBe(0);
  });

  it("excludes not_evaluated criteria from the calculation", () => {
    const answers = [
      buildAnswer({ criterionId: "problem_severity", status: "qualified" }),
      buildAnswer({ criterionId: "budget_fit", status: "not_evaluated" }),
    ];
    // Only one evaluated criterion, fully qualified -> 10/10
    expect(calculateStandardScore(answers)).toBe(10);
  });

  it("weighs uncertain answers as half a point", () => {
    const answers = [
      buildAnswer({ criterionId: "problem_severity", status: "uncertain" }),
      buildAnswer({ criterionId: "budget_fit", status: "disqualified" }),
    ];
    // (0.5 + 0) / 2 * 10 = 2.5
    expect(calculateStandardScore(answers)).toBe(2.5);
  });
});

describe("calculateWeightedScore", () => {
  it("returns 100 when every evaluated criterion is qualified", () => {
    expect(calculateWeightedScore(allQualifiedAnswers())).toBe(100);
  });

  it("weighs heavier criteria more strongly", () => {
    const answers = [
      buildAnswer({ criterionId: "problem_severity", status: "qualified", weight: 2 }),
      buildAnswer({ criterionId: "scope_clarity", status: "disqualified", weight: 1 }),
    ];
    // earned = 2*1 + 1*0 = 2, max = 3 -> 66.7
    expect(calculateWeightedScore(answers)).toBeCloseTo(66.7, 1);
  });
});

describe("calculateConfidenceLevel", () => {
  it("returns high confidence when 90% or more criteria are evaluated", () => {
    const answers = CRITERIA_DEFINITIONS.map((c) => buildAnswer({ criterionId: c.id, status: "qualified" }));
    expect(calculateConfidenceLevel(answers, CRITERIA_DEFINITIONS.length)).toBe("high");
  });

  it("returns low confidence when fewer than 70% of criteria are evaluated", () => {
    const answers = CRITERIA_DEFINITIONS.slice(0, 3).map((c) =>
      buildAnswer({ criterionId: c.id, status: "qualified" })
    );
    expect(calculateConfidenceLevel(answers, CRITERIA_DEFINITIONS.length)).toBe("low");
  });
});

describe("calculateDecisionLevel", () => {
  it("maps scores to the correct decision band", () => {
    expect(calculateDecisionLevel(95, settings.decisionThresholds)).toBe("hell_yes");
    expect(calculateDecisionLevel(80, settings.decisionThresholds)).toBe("qualified_yes");
    expect(calculateDecisionLevel(60, settings.decisionThresholds)).toBe("yellow_flag");
    expect(calculateDecisionLevel(40, settings.decisionThresholds)).toBe("soft_no");
    expect(calculateDecisionLevel(10, settings.decisionThresholds)).toBe("hard_no");
  });
});

describe("detectCriticalFailures", () => {
  it("flags a budget below the configured minimum", () => {
    const failures = detectCriticalFailures(
      {
        answers: [],
        estimatedBudget: 1000,
        requestedDeliveryDate: undefined,
        inquiryDate: "2026-01-01",
      },
      settings
    );
    expect(failures.some((f) => f.id === "cf_budget_below_minimum")).toBe(true);
  });

  it("flags a delivery timeline shorter than 14 days", () => {
    const failures = detectCriticalFailures(
      {
        answers: [],
        inquiryDate: "2026-01-01",
        requestedDeliveryDate: "2026-01-05",
      },
      settings
    );
    expect(failures.some((f) => f.id === "cf_timeline_too_short")).toBe(true);
  });

  it("does not flag a delivery timeline of 21 days or more", () => {
    const failures = detectCriticalFailures(
      {
        answers: [],
        inquiryDate: "2026-01-01",
        requestedDeliveryDate: "2026-01-22",
      },
      settings
    );
    expect(failures.some((f) => f.id === "cf_timeline_too_short")).toBe(false);
  });

  it("respects inactive rules from settings", () => {
    const customSettings: AgencySettings = {
      ...settings,
      criticalRules: settings.criticalRules.map((rule) =>
        rule.key === "budget_below_minimum" ? { ...rule, isActive: false } : rule
      ),
    };
    const failures = detectCriticalFailures(
      { answers: [], estimatedBudget: 100, inquiryDate: "2026-01-01" },
      customSettings
    );
    expect(failures.some((f) => f.id === "cf_budget_below_minimum")).toBe(false);
  });

  it("creates a manual critical failure when a criterion is flagged by the user", () => {
    const failures = detectCriticalFailures(
      {
        answers: [
          buildAnswer({
            criterionId: "technical_data_readiness",
            status: "uncertain",
            isCriticalRisk: true,
            notes: "KVKK riski var",
          }),
        ],
        inquiryDate: "2026-01-01",
      },
      settings
    );
    expect(failures.some((f) => f.id === "cf_manual_technical_data_readiness")).toBe(true);
  });
});

describe("critical failures override a high score", () => {
  it("caps the decision at yellow_flag even when the score qualifies for hell_yes", () => {
    const answers = allQualifiedAnswers().map((answer) =>
      answer.criterionId === "decision_maker_access"
        ? { ...answer, status: "disqualified" as const }
        : answer
    );
    const result = calculateEvaluationResult(
      { answers, inquiryDate: "2026-01-01", estimatedBudget: 50000 },
      settings
    );
    expect(result.weightedScore).toBeLessThan(100);
    expect(result.decision).not.toBe("hell_yes");
  });

  it("forces a hard_no when a critical-severity blocking failure is present, regardless of score", () => {
    const answers = allQualifiedAnswers().map((answer) =>
      answer.criterionId === "technical_data_readiness"
        ? { ...answer, isCriticalRisk: true }
        : answer
    );
    const result = calculateEvaluationResult(
      { answers, inquiryDate: "2026-01-01", estimatedBudget: 50000 },
      settings
    );
    expect(result.standardScore).toBe(10);
    expect(result.decision).toBe("hard_no");
  });
});

describe("simulateEvaluationChanges", () => {
  it("recalculates score and decision without mutating the original evaluation", () => {
    const answers = CRITERIA_DEFINITIONS.map((c) =>
      buildAnswer({ criterionId: c.id, status: "disqualified", weight: c.weight })
    );
    const evaluation = { answers, inquiryDate: "2026-01-01", estimatedBudget: 50000 };

    const result = simulateEvaluationChanges(
      evaluation,
      [{ criterionId: "budget_fit", newStatus: "qualified" }],
      settings
    );

    expect(result.currentStandardScore).toBe(0);
    expect(result.simulatedStandardScore).toBeGreaterThan(0);
    expect(evaluation.answers.find((a) => a.criterionId === "budget_fit")?.status).toBe(
      "disqualified"
    );
  });

  it("resolves the budget critical failure when the budget criterion is raised to qualified", () => {
    const answers = CRITERIA_DEFINITIONS.map((c) =>
      buildAnswer({ criterionId: c.id, status: "qualified", weight: c.weight })
    );
    const evaluation = { answers, inquiryDate: "2026-01-01", estimatedBudget: 100 };

    const result = simulateEvaluationChanges(
      evaluation,
      [{ criterionId: "budget_fit", newStatus: "qualified" }],
      settings
    );

    expect(result.remainingCriticalFailures.some((f) => f.id === "cf_budget_below_minimum")).toBe(
      false
    );
  });
});

describe("settings changes affect scoring", () => {
  it("stops flagging a budget as critical once the minimum threshold is lowered", () => {
    const evaluation = { answers: [], estimatedBudget: 5000, inquiryDate: "2026-01-01" };
    const strictFailures = detectCriticalFailures(evaluation, settings);
    expect(strictFailures.some((f) => f.id === "cf_budget_below_minimum")).toBe(true);

    const relaxedSettings: AgencySettings = { ...settings, minProjectBudget: 1000 };
    const relaxedFailures = detectCriticalFailures(evaluation, relaxedSettings);
    expect(relaxedFailures.some((f) => f.id === "cf_budget_below_minimum")).toBe(false);
  });
});
