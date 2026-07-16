import { CRITERIA_DEFINITIONS } from "@/lib/criteria";
import { calculateEvaluationResult } from "@/lib/scoring";
import { daysBetween } from "@/lib/dates";
import type { ClientInformationFormValues } from "@/lib/validation";
import type { ClientEvaluation, CriterionAnswer, QualificationStatus } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";

export interface EvaluationDraft extends ClientInformationFormValues {
  id: string;
  answers: CriterionAnswer[];
  recommendedNextAction?: string;
  isDraft: boolean;
  isArchived: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function createEmptyAnswers(settings: AgencySettings): CriterionAnswer[] {
  return CRITERIA_DEFINITIONS.map((criterion) => ({
    criterionId: criterion.id,
    status: "not_evaluated",
    score: null,
    weight: settings.criterionWeights[criterion.id] ?? criterion.weight,
    notes: "",
    evidence: "",
    followUpQuestion: "",
    isCriticalRisk: false,
  }));
}

export function createEmptyDraft(settings: AgencySettings, id: string): EvaluationDraft {
  const now = new Date().toISOString();
  return {
    id,
    clientName: "",
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
    projectName: "",
    projectDescription: "",
    requestedService: "",
    estimatedBudget: undefined,
    currency: settings.defaultCurrency,
    monthlyRetainer: undefined,
    requestedDeliveryDate: "",
    potentialStartDate: "",
    inquiryDate: now.slice(0, 10),
    leadSource: "",
    salesStage: "",
    generalNotes: "",
    answers: createEmptyAnswers(settings),
    recommendedNextAction: "",
    isDraft: true,
    isArchived: false,
    isDemo: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function draftToEvaluation(draft: EvaluationDraft, settings: AgencySettings): ClientEvaluation {
  const result = calculateEvaluationResult(draft, settings);
  return {
    ...draft,
    standardScore: result.standardScore,
    weightedScore: result.weightedScore,
    confidenceLevel: result.confidenceLevel,
    decision: result.decision,
    criticalFailures: result.criticalFailures,
    updatedAt: new Date().toISOString(),
  };
}

export function evaluationToDraft(evaluation: ClientEvaluation): EvaluationDraft {
  const {
    id,
    clientName,
    companyName,
    contactName,
    email,
    phone,
    website,
    industry,
    companySize,
    projectName,
    projectDescription,
    requestedService,
    estimatedBudget,
    monthlyRetainer,
    currency,
    requestedDeliveryDate,
    potentialStartDate,
    inquiryDate,
    leadSource,
    salesStage,
    generalNotes,
    answers,
    recommendedNextAction,
    isDraft,
    isArchived,
    isDemo,
    createdAt,
    updatedAt,
  } = evaluation;
  return {
    id,
    clientName,
    companyName,
    contactName,
    email,
    phone,
    website,
    industry,
    companySize,
    projectName,
    projectDescription,
    requestedService,
    estimatedBudget,
    monthlyRetainer,
    currency,
    requestedDeliveryDate,
    potentialStartDate,
    inquiryDate,
    leadSource,
    salesStage,
    generalNotes,
    answers,
    recommendedNextAction,
    isDraft,
    isArchived,
    isDemo,
    createdAt,
    updatedAt,
  };
}

export function answeredCriteriaCount(answers: CriterionAnswer[]): number {
  return answers.filter((answer) => answer.status !== "not_evaluated").length;
}

export function isClientInformationComplete(draft: EvaluationDraft): boolean {
  return Boolean(draft.clientName && draft.projectName && draft.currency && draft.inquiryDate);
}

export function computeTimelineStatus(
  inquiryDate: string | undefined,
  requestedDeliveryDate: string | undefined
): QualificationStatus {
  if (!inquiryDate || !requestedDeliveryDate) return "not_evaluated";
  const days = daysBetween(inquiryDate, requestedDeliveryDate);
  if (Number.isNaN(days)) return "not_evaluated";
  if (days >= 21) return "qualified";
  if (days >= 14) return "uncertain";
  return "disqualified";
}

export function getRecommendedNextAction(
  decision: ClientEvaluation["decision"],
  hasBlockingCriticalFailure: boolean
): string {
  if (hasBlockingCriticalFailure && decision !== "hard_no") {
    return "Kritik riskleri çözmeden teklif göndermeyin; önce ek bilgi isteyin veya ikinci bir görüşme planlayın.";
  }
  switch (decision) {
    case "hell_yes":
      return "Aynı gün teklif gönderin ve projeyi önceliklendirin.";
    case "qualified_yes":
      return "Teklif öncesi koşulları netleştirip teklifi gönderin.";
    case "yellow_flag":
      return "Ek bilgi isteyin veya ikinci bir keşif görüşmesi planlayın.";
    case "soft_no":
      return "Nazik bir ret mesajı gönderin veya alternatif sağlayıcıya yönlendirin.";
    case "hard_no":
      return "Projeyi kesin olarak reddedin; karşı teklif hazırlamayın.";
  }
}
