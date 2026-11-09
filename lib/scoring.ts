import type {
  ClientEvaluation,
  ConfidenceLevel,
  CriterionAnswer,
  CriticalFailure,
  DecisionLevel,
  QualificationStatus,
} from "@/types/evaluation";
import type {
  CriterionDefinition,
  CriterionResultSummary,
  ImprovementCondition,
  ScoringResult,
  SimulationChange,
  SimulationResult,
} from "@/types/scoring";
import type { AgencySettings, CriticalRuleKey } from "@/types/settings";
import { CRITERIA_DEFINITIONS, getCriterionById } from "@/lib/criteria";
import { addDays, daysBetween } from "@/lib/dates";

type EvaluationInput = Pick<
  ClientEvaluation,
  "answers" | "estimatedBudget" | "monthlyRetainer" | "requestedDeliveryDate" | "inquiryDate"
>;

const round1 = (value: number): number => Math.round(value * 10) / 10;

export function statusToScore(status: QualificationStatus): number | null {
  switch (status) {
    case "qualified":
      return 1;
    case "uncertain":
      return 0.5;
    case "disqualified":
      return 0;
    case "not_evaluated":
      return null;
  }
}

function evaluatedAnswers(answers: CriterionAnswer[]): CriterionAnswer[] {
  return answers.filter((answer) => answer.status !== "not_evaluated");
}

export function calculateStandardScore(answers: CriterionAnswer[]): number {
  const evaluated = evaluatedAnswers(answers);
  if (evaluated.length === 0) return 0;
  const total = evaluated.reduce((sum, answer) => sum + (statusToScore(answer.status) ?? 0), 0);
  return round1((total / evaluated.length) * 10);
}

export function calculateWeightedScore(answers: CriterionAnswer[]): number {
  const evaluated = evaluatedAnswers(answers);
  if (evaluated.length === 0) return 0;
  const earned = evaluated.reduce(
    (sum, answer) => sum + (statusToScore(answer.status) ?? 0) * answer.weight,
    0
  );
  const maxPossible = evaluated.reduce((sum, answer) => sum + answer.weight, 0);
  if (maxPossible === 0) return 0;
  return round1((earned / maxPossible) * 100);
}

export function calculateConfidenceLevel(
  answers: CriterionAnswer[],
  totalCriteriaCount: number
): ConfidenceLevel {
  if (totalCriteriaCount === 0) return "low";
  const ratio = evaluatedAnswers(answers).length / totalCriteriaCount;
  if (ratio >= 0.9) return "high";
  if (ratio >= 0.7) return "medium";
  return "low";
}

function findAnswer(answers: CriterionAnswer[], criterionId: string): CriterionAnswer | undefined {
  return answers.find((answer) => answer.criterionId === criterionId);
}

interface AutoRuleCheck {
  key: CriticalRuleKey;
  criterionId?: string;
  isTriggered: (evaluation: EvaluationInput, settings: AgencySettings) => boolean;
}

const AUTO_RULE_CHECKS: AutoRuleCheck[] = [
  {
    key: "budget_below_minimum",
    isTriggered: (evaluation, settings) => {
      if (evaluation.estimatedBudget !== undefined && evaluation.estimatedBudget !== null) {
        return evaluation.estimatedBudget < settings.minProjectBudget;
      }
      if (evaluation.monthlyRetainer !== undefined && evaluation.monthlyRetainer !== null) {
        return evaluation.monthlyRetainer < settings.minMonthlyRetainer;
      }
      return false;
    },
  },
  {
    key: "no_decision_maker_access",
    criterionId: "decision_maker_access",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "decision_maker_access")?.status === "disqualified",
  },
  {
    key: "problem_severity_disqualified",
    criterionId: "problem_severity",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "problem_severity")?.status === "disqualified",
  },
  {
    key: "timeline_too_short",
    criterionId: "timeline_realism",
    isTriggered: (evaluation, settings) => {
      if (!evaluation.requestedDeliveryDate || !evaluation.inquiryDate) return false;
      const days = daysBetween(evaluation.inquiryDate, evaluation.requestedDeliveryDate);
      return !Number.isNaN(days) && days < settings.minTimelineDays;
    },
  },
  {
    key: "expects_free_lifetime_support",
    criterionId: "maintenance_support_expectation",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "maintenance_support_expectation")?.status === "disqualified",
  },
  {
    key: "no_admin_or_api_access",
    criterionId: "technical_data_readiness",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "technical_data_readiness")?.status === "disqualified",
  },
  {
    key: "no_defined_project_owner",
    criterionId: "internal_project_owner",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "internal_project_owner")?.status === "disqualified",
  },
  {
    key: "unsupported_custom_system",
    criterionId: "tech_stack_fit",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "tech_stack_fit")?.status === "disqualified",
  },
  {
    key: "disrespectful_communication",
    criterionId: "communication_style",
    isTriggered: (evaluation) =>
      findAnswer(evaluation.answers, "communication_style")?.status === "disqualified",
  },
];

export function detectCriticalFailures(
  evaluation: EvaluationInput,
  settings: AgencySettings,
  criteriaDefs: CriterionDefinition[] = CRITERIA_DEFINITIONS
): CriticalFailure[] {
  const failures: CriticalFailure[] = [];
  const activeRules = new Map(
    settings.criticalRules.filter((rule) => rule.isActive).map((rule) => [rule.key, rule])
  );

  for (const check of AUTO_RULE_CHECKS) {
    const rule = activeRules.get(check.key);
    if (!rule) continue;
    if (check.isTriggered(evaluation, settings)) {
      failures.push({
        id: `cf_${rule.key}`,
        criterionId: check.criterionId,
        title: rule.title,
        description: rule.description,
        severity: rule.severity,
        blocksApproval: rule.autoReject,
      });
    }
  }

  for (const answer of evaluation.answers) {
    if (!answer.isCriticalRisk) continue;
    const criterion = criteriaDefs.find((c) => c.id === answer.criterionId);
    failures.push({
      id: `cf_manual_${answer.criterionId}`,
      criterionId: answer.criterionId,
      title: `${criterion?.name ?? answer.criterionId}: kritik risk olarak işaretlendi`,
      description: answer.notes || "Kullanıcı bu kriteri elle kritik risk olarak işaretledi.",
      severity: "critical",
      blocksApproval: true,
    });
  }

  return failures;
}

export function calculateDecisionLevel(
  weightedScore: number,
  thresholds: AgencySettings["decisionThresholds"]
): DecisionLevel {
  const sorted = [...thresholds].sort((a, b) => b.minScore - a.minScore);
  for (const threshold of sorted) {
    if (weightedScore >= threshold.minScore) return threshold.decision;
  }
  return sorted[sorted.length - 1]?.decision ?? "hard_no";
}

function applyCriticalOverride(
  decision: DecisionLevel,
  criticalFailures: CriticalFailure[]
): DecisionLevel {
  const hasCriticalBlocker = criticalFailures.some(
    (failure) => failure.blocksApproval && failure.severity === "critical"
  );
  if (hasCriticalBlocker) return "hard_no";

  const hasBlocker = criticalFailures.some((failure) => failure.blocksApproval);
  if (hasBlocker && (decision === "hell_yes" || decision === "qualified_yes")) {
    return "yellow_flag";
  }
  return decision;
}

export function deriveDecision(
  weightedScore: number,
  criticalFailures: CriticalFailure[],
  settings: AgencySettings
): DecisionLevel {
  const base = calculateDecisionLevel(weightedScore, settings.decisionThresholds);
  return applyCriticalOverride(base, criticalFailures);
}

export function getStrongestCriteria(
  answers: CriterionAnswer[],
  criteriaDefs: CriterionDefinition[] = CRITERIA_DEFINITIONS,
  limit = 5
): CriterionResultSummary[] {
  return evaluatedAnswers(answers)
    .slice()
    .sort((a, b) => (statusToScore(b.status) ?? 0) - (statusToScore(a.status) ?? 0))
    .slice(0, limit)
    .map((answer) => summarize(answer, criteriaDefs));
}

export function getWeakestCriteria(
  answers: CriterionAnswer[],
  criteriaDefs: CriterionDefinition[] = CRITERIA_DEFINITIONS,
  limit = 5
): CriterionResultSummary[] {
  return evaluatedAnswers(answers)
    .slice()
    .sort((a, b) => (statusToScore(a.status) ?? 0) - (statusToScore(b.status) ?? 0))
    .slice(0, limit)
    .map((answer) => summarize(answer, criteriaDefs));
}

function summarize(
  answer: CriterionAnswer,
  criteriaDefs: CriterionDefinition[]
): CriterionResultSummary {
  const definition = criteriaDefs.find((c) => c.id === answer.criterionId);
  return {
    criterionId: answer.criterionId,
    name: definition?.name ?? answer.criterionId,
    score: statusToScore(answer.status),
    status: answer.status,
    notes: answer.notes,
  };
}

function withAnswerStatus(
  answers: CriterionAnswer[],
  criterionId: string,
  status: QualificationStatus
): CriterionAnswer[] {
  const exists = answers.some((answer) => answer.criterionId === criterionId);
  if (!exists) {
    const definition = getCriterionById(criterionId);
    return [
      ...answers,
      {
        criterionId,
        status,
        score: statusToScore(status),
        weight: definition?.weight ?? 1,
        notes: "",
        isCriticalRisk: false,
      },
    ];
  }
  return answers.map((answer) =>
    answer.criterionId === criterionId
      ? { ...answer, status, score: statusToScore(status) }
      : answer
  );
}

const IMPROVEMENT_SUGGESTIONS: {
  criterionId: string;
  description: string;
  applyExtras?: (evaluation: EvaluationInput) => Partial<EvaluationInput>;
}[] = [
  {
    criterionId: "budget_fit",
    description: "Bütçe minimum seviyeye çıkarılırsa",
  },
  {
    criterionId: "timeline_realism",
    description: "Teslim süresi 4 haftaya uzatılırsa",
    applyExtras: (evaluation) => ({
      requestedDeliveryDate: addDays(evaluation.inquiryDate, 28),
    }),
  },
  {
    criterionId: "decision_maker_access",
    description: "Karar verici görüşmeye katılırsa",
  },
  {
    criterionId: "maintenance_support_expectation",
    description: "Bakım paketi kabul edilirse",
  },
  {
    criterionId: "technical_data_readiness",
    description: "Teknik erişimler proje öncesinde sağlanırsa",
  },
  {
    criterionId: "scope_clarity",
    description: "Kapsam yazılı biçimde onaylanırsa",
  },
  {
    criterionId: "internal_project_owner",
    description: "İç proje sahibi atanırsa",
  },
];

export function generateImprovementConditions(
  evaluation: EvaluationInput,
  settings: AgencySettings,
  criteriaDefs: CriterionDefinition[] = CRITERIA_DEFINITIONS
): ImprovementCondition[] {
  const currentCriticalFailures = detectCriticalFailures(evaluation, settings, criteriaDefs);
  const conditions: ImprovementCondition[] = [];

  for (const suggestion of IMPROVEMENT_SUGGESTIONS) {
    const currentAnswer = findAnswer(evaluation.answers, suggestion.criterionId);
    if (currentAnswer?.status === "qualified") continue;

    const extras = suggestion.applyExtras?.(evaluation) ?? {};
    const simulatedEvaluation: EvaluationInput = {
      ...evaluation,
      ...extras,
      answers: withAnswerStatus(evaluation.answers, suggestion.criterionId, "qualified"),
      estimatedBudget:
        suggestion.criterionId === "budget_fit" &&
        (evaluation.estimatedBudget ?? 0) < settings.minProjectBudget
          ? settings.minProjectBudget
          : evaluation.estimatedBudget,
    };

    const newCriticalFailures = detectCriticalFailures(simulatedEvaluation, settings, criteriaDefs);
    const resolvedIds = currentCriticalFailures
      .filter((failure) => !newCriticalFailures.some((next) => next.id === failure.id))
      .map((failure) => failure.id);

    conditions.push({
      id: `improve_${suggestion.criterionId}`,
      description: suggestion.description,
      relatedCriterionId: suggestion.criterionId,
      estimatedNewStandardScore: calculateStandardScore(simulatedEvaluation.answers),
      estimatedNewWeightedScore: calculateWeightedScore(simulatedEvaluation.answers),
      resolvesCriticalFailureIds: resolvedIds,
    });
  }

  return conditions;
}

export function calculateEvaluationResult(
  evaluation: EvaluationInput,
  settings: AgencySettings,
  criteriaDefs: CriterionDefinition[] = CRITERIA_DEFINITIONS
): ScoringResult {
  const standardScore = calculateStandardScore(evaluation.answers);
  const weightedScore = calculateWeightedScore(evaluation.answers);
  const confidenceLevel = calculateConfidenceLevel(evaluation.answers, criteriaDefs.length);
  const criticalFailures = detectCriticalFailures(evaluation, settings, criteriaDefs);
  const decision = deriveDecision(weightedScore, criticalFailures, settings);

  return {
    standardScore,
    weightedScore,
    confidenceLevel,
    evaluatedCriteriaCount: evaluatedAnswers(evaluation.answers).length,
    totalCriteriaCount: criteriaDefs.length,
    decision,
    criticalFailures,
    strongestCriteria: getStrongestCriteria(evaluation.answers, criteriaDefs),
    weakestCriteria: getWeakestCriteria(evaluation.answers, criteriaDefs),
    improvementConditions: generateImprovementConditions(evaluation, settings, criteriaDefs),
  };
}

export function simulateEvaluationChanges(
  evaluation: EvaluationInput,
  changes: SimulationChange[],
  settings: AgencySettings,
  criteriaDefs: CriterionDefinition[] = CRITERIA_DEFINITIONS
): SimulationResult {
  const currentStandardScore = calculateStandardScore(evaluation.answers);
  const currentWeightedScore = calculateWeightedScore(evaluation.answers);
  const currentCriticalFailures = detectCriticalFailures(evaluation, settings, criteriaDefs);
  const currentDecision = deriveDecision(currentWeightedScore, currentCriticalFailures, settings);

  let simulatedAnswers = evaluation.answers;
  for (const change of changes) {
    simulatedAnswers = withAnswerStatus(simulatedAnswers, change.criterionId, change.newStatus);
  }

  let simulatedEvaluation: EvaluationInput = { ...evaluation, answers: simulatedAnswers };

  const timelineExtended = changes.some(
    (change) => change.criterionId === "timeline_realism" && change.newStatus === "qualified"
  );
  if (timelineExtended) {
    simulatedEvaluation = {
      ...simulatedEvaluation,
      requestedDeliveryDate: addDays(evaluation.inquiryDate, 28),
    };
  }

  const budgetRaised = changes.some(
    (change) => change.criterionId === "budget_fit" && change.newStatus === "qualified"
  );
  if (budgetRaised && (evaluation.estimatedBudget ?? 0) < settings.minProjectBudget) {
    simulatedEvaluation = {
      ...simulatedEvaluation,
      estimatedBudget: settings.minProjectBudget,
    };
  }

  const simulatedStandardScore = calculateStandardScore(simulatedEvaluation.answers);
  const simulatedWeightedScore = calculateWeightedScore(simulatedEvaluation.answers);
  const simulatedCriticalFailures = detectCriticalFailures(simulatedEvaluation, settings, criteriaDefs);
  const simulatedDecision = deriveDecision(simulatedWeightedScore, simulatedCriticalFailures, settings);

  const resolvedCriticalFailures = currentCriticalFailures.filter(
    (failure) => !simulatedCriticalFailures.some((next) => next.id === failure.id)
  );

  return {
    currentStandardScore,
    currentWeightedScore,
    currentDecision,
    simulatedStandardScore,
    simulatedWeightedScore,
    simulatedDecision,
    resolvedCriticalFailures,
    remainingCriticalFailures: simulatedCriticalFailures,
    appliedChanges: changes,
  };
}
