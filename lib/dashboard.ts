import { CRITERIA_DEFINITIONS } from "@/lib/criteria";
import { isWithinLastNDays, monthKey } from "@/lib/dates";
import { statusToScore } from "@/lib/scoring";
import type { ClientEvaluation, DecisionLevel } from "@/types/evaluation";
import type { DashboardMetrics } from "@/types/scoring";

const ACCEPTED_DECISIONS: DecisionLevel[] = ["hell_yes", "qualified_yes"];
const REJECTED_DECISIONS: DecisionLevel[] = ["soft_no", "hard_no"];
const CONDITIONAL_DECISIONS: DecisionLevel[] = ["yellow_flag"];

const round1 = (value: number): number => Math.round(value * 10) / 10;

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return round1(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function lastNMonths(n: number, referenceDate: Date): string[] {
  const months: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export function calculateDashboardMetrics(
  allEvaluations: ClientEvaluation[],
  referenceDate: Date = new Date()
): DashboardMetrics {
  const evaluations = allEvaluations.filter((evaluation) => !evaluation.isDraft && !evaluation.isArchived);

  const acceptedCount = evaluations.filter((e) => ACCEPTED_DECISIONS.includes(e.decision)).length;
  const conditionalCount = evaluations.filter((e) => CONDITIONAL_DECISIONS.includes(e.decision)).length;
  const rejectedCount = evaluations.filter((e) => REJECTED_DECISIONS.includes(e.decision)).length;

  const averageStandardScore = average(evaluations.map((e) => e.standardScore));
  const averageWeightedScore = average(evaluations.map((e) => e.weightedScore));

  const evaluationsLast30Days = evaluations.filter((e) =>
    isWithinLastNDays(e.createdAt, 30, referenceDate.toISOString())
  ).length;

  const redFlagCounts = new Map<string, number>();
  evaluations.forEach((evaluation) => {
    evaluation.criticalFailures.forEach((failure) => {
      redFlagCounts.set(failure.title, (redFlagCounts.get(failure.title) ?? 0) + 1);
    });
  });
  const mostCommonRedFlag =
    [...redFlagCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const criterionScoreSums = new Map<string, { sum: number; count: number }>();
  evaluations.forEach((evaluation) => {
    evaluation.answers.forEach((answer) => {
      const score = statusToScore(answer.status);
      if (score === null) return;
      const current = criterionScoreSums.get(answer.criterionId) ?? { sum: 0, count: 0 };
      current.sum += score;
      current.count += 1;
      criterionScoreSums.set(answer.criterionId, current);
    });
  });
  const averageScoreByCriterion = CRITERIA_DEFINITIONS.map((criterion) => {
    const stat = criterionScoreSums.get(criterion.id);
    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      averageScore: stat && stat.count > 0 ? round1((stat.sum / stat.count) * 10) : 0,
    };
  });
  const weakestCriterion =
    averageScoreByCriterion.length > 0
      ? [...averageScoreByCriterion].sort((a, b) => a.averageScore - b.averageScore)[0]?.criterionName ?? null
      : null;

  const industryStats = new Map<string, { accepted: number; total: number }>();
  evaluations.forEach((evaluation) => {
    if (!evaluation.industry) return;
    const stat = industryStats.get(evaluation.industry) ?? { accepted: 0, total: 0 };
    stat.total += 1;
    if (ACCEPTED_DECISIONS.includes(evaluation.decision)) stat.accepted += 1;
    industryStats.set(evaluation.industry, stat);
  });
  const acceptanceRateByIndustry = [...industryStats.entries()]
    .map(([industry, stat]) => ({
      industry,
      acceptedRate: stat.total === 0 ? 0 : round1((stat.accepted / stat.total) * 100),
      count: stat.total,
    }))
    .sort((a, b) => b.acceptedRate - a.acceptedRate);
  const strongestClientSegment = acceptanceRateByIndustry[0]?.industry ?? null;

  const budgets = evaluations
    .map((e) => e.estimatedBudget)
    .filter((budget): budget is number => typeof budget === "number");
  const averageProjectBudget = average(budgets);

  const totalAcceptedPotentialValue = evaluations
    .filter((e) => ACCEPTED_DECISIONS.includes(e.decision))
    .reduce((sum, e) => sum + (e.estimatedBudget ?? 0), 0);

  const decisionCounts = new Map<DecisionLevel, number>();
  evaluations.forEach((e) => decisionCounts.set(e.decision, (decisionCounts.get(e.decision) ?? 0) + 1));
  const decisionDistribution: DashboardMetrics["decisionDistribution"] = (
    ["hell_yes", "qualified_yes", "yellow_flag", "soft_no", "hard_no"] as DecisionLevel[]
  ).map((decision) => ({ decision, count: decisionCounts.get(decision) ?? 0 }));

  const scoreBuckets = [
    { range: "0-20", min: 0, max: 20 },
    { range: "21-40", min: 21, max: 40 },
    { range: "41-60", min: 41, max: 60 },
    { range: "61-80", min: 61, max: 80 },
    { range: "81-100", min: 81, max: 100 },
  ];
  const scoreDistribution = scoreBuckets.map((bucket) => ({
    range: bucket.range,
    count: evaluations.filter((e) => e.weightedScore >= bucket.min && e.weightedScore <= bucket.max).length,
  }));

  const months = lastNMonths(12, referenceDate);
  const evaluationsByMonth = months.map((month) => ({
    month,
    count: evaluations.filter((e) => monthKey(e.createdAt) === month).length,
  }));
  const acceptanceRateByMonth = months.map((month) => {
    const monthEvaluations = evaluations.filter((e) => monthKey(e.createdAt) === month);
    const total = monthEvaluations.length;
    const accepted = monthEvaluations.filter((e) => ACCEPTED_DECISIONS.includes(e.decision)).length;
    const rejected = monthEvaluations.filter((e) => REJECTED_DECISIONS.includes(e.decision)).length;
    return {
      month,
      acceptedRate: total === 0 ? 0 : round1((accepted / total) * 100),
      rejectedRate: total === 0 ? 0 : round1((rejected / total) * 100),
    };
  });

  const topCriticalRisks = [...redFlagCounts.entries()]
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const leadSourceStats = new Map<string, { accepted: number; total: number }>();
  evaluations.forEach((evaluation) => {
    if (!evaluation.leadSource) return;
    const stat = leadSourceStats.get(evaluation.leadSource) ?? { accepted: 0, total: 0 };
    stat.total += 1;
    if (ACCEPTED_DECISIONS.includes(evaluation.decision)) stat.accepted += 1;
    leadSourceStats.set(evaluation.leadSource, stat);
  });
  const performanceByLeadSource = [...leadSourceStats.entries()]
    .map(([leadSource, stat]) => ({
      leadSource,
      acceptedRate: stat.total === 0 ? 0 : round1((stat.accepted / stat.total) * 100),
      count: stat.total,
    }))
    .sort((a, b) => b.acceptedRate - a.acceptedRate);

  return {
    totalEvaluations: evaluations.length,
    acceptedCount,
    conditionalCount,
    rejectedCount,
    averageStandardScore,
    averageWeightedScore,
    evaluationsLast30Days,
    mostCommonRedFlag,
    weakestCriterion,
    strongestClientSegment,
    averageProjectBudget,
    totalAcceptedPotentialValue,
    decisionDistribution,
    scoreDistribution,
    evaluationsByMonth,
    acceptanceRateByMonth,
    averageScoreByCriterion,
    topCriticalRisks,
    performanceByLeadSource,
    acceptanceRateByIndustry,
  };
}
