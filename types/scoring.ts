import type {
  ConfidenceLevel,
  CriterionCategory,
  CriticalFailure,
  DecisionLevel,
  QualificationStatus,
} from "./evaluation";

export interface CriterionDefinition {
  id: string;
  order: number;
  category: CriterionCategory;
  name: string;
  shortDescription: string;
  mainQuestion: string;
  goodSigns: string[];
  redFlags: string[];
  weight: number;
  helpText?: string;
}

export interface CriterionResultSummary {
  criterionId: string;
  name: string;
  score: number | null;
  status: QualificationStatus;
  notes: string;
}

export interface ImprovementCondition {
  id: string;
  description: string;
  relatedCriterionId?: string;
  estimatedNewStandardScore: number;
  estimatedNewWeightedScore: number;
  resolvesCriticalFailureIds: string[];
}

export interface ScoringResult {
  standardScore: number;
  weightedScore: number;
  confidenceLevel: ConfidenceLevel;
  evaluatedCriteriaCount: number;
  totalCriteriaCount: number;
  decision: DecisionLevel;
  criticalFailures: CriticalFailure[];
  strongestCriteria: CriterionResultSummary[];
  weakestCriteria: CriterionResultSummary[];
  improvementConditions: ImprovementCondition[];
}

export interface SimulationChange {
  criterionId: string;
  newStatus: QualificationStatus;
}

export interface SimulationResult {
  currentStandardScore: number;
  currentWeightedScore: number;
  currentDecision: DecisionLevel;
  simulatedStandardScore: number;
  simulatedWeightedScore: number;
  simulatedDecision: DecisionLevel;
  resolvedCriticalFailures: CriticalFailure[];
  remainingCriticalFailures: CriticalFailure[];
  appliedChanges: SimulationChange[];
}

export interface DashboardMetrics {
  totalEvaluations: number;
  acceptedCount: number;
  conditionalCount: number;
  rejectedCount: number;
  averageStandardScore: number;
  averageWeightedScore: number;
  evaluationsLast30Days: number;
  mostCommonRedFlag: string | null;
  weakestCriterion: string | null;
  strongestClientSegment: string | null;
  averageProjectBudget: number;
  totalAcceptedPotentialValue: number;
  decisionDistribution: { decision: DecisionLevel; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  evaluationsByMonth: { month: string; count: number }[];
  acceptanceRateByMonth: { month: string; acceptedRate: number; rejectedRate: number }[];
  averageScoreByCriterion: { criterionId: string; criterionName: string; averageScore: number }[];
  topCriticalRisks: { title: string; count: number }[];
  performanceByLeadSource: { leadSource: string; acceptedRate: number; count: number }[];
  acceptanceRateByIndustry: { industry: string; acceptedRate: number; count: number }[];
}
