export type QualificationStatus =
  | "qualified"
  | "uncertain"
  | "disqualified"
  | "not_evaluated";

export type DecisionLevel =
  | "hell_yes"
  | "qualified_yes"
  | "yellow_flag"
  | "soft_no"
  | "hard_no";

export type ConfidenceLevel = "high" | "medium" | "low";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type CriterionCategory =
  | "commercial"
  | "operational"
  | "technical"
  | "relationship"
  | "strategic";

export interface CriterionAnswer {
  criterionId: string;
  status: QualificationStatus;
  score: number | null;
  weight: number;
  notes: string;
  evidence?: string;
  followUpQuestion?: string;
  isCriticalRisk: boolean;
}

export interface CriticalFailure {
  id: string;
  criterionId?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  blocksApproval: boolean;
}

export interface ClientEvaluation {
  id: string;
  clientName: string;
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  projectName: string;
  projectDescription?: string;
  requestedService?: string;
  estimatedBudget?: number;
  monthlyRetainer?: number;
  currency: string;
  requestedDeliveryDate?: string;
  potentialStartDate?: string;
  inquiryDate: string;
  leadSource?: string;
  salesStage?: string;
  generalNotes?: string;
  answers: CriterionAnswer[];
  standardScore: number;
  weightedScore: number;
  confidenceLevel: ConfidenceLevel;
  decision: DecisionLevel;
  criticalFailures: CriticalFailure[];
  recommendedNextAction?: string;
  isDraft: boolean;
  isArchived: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExportFormat {
  appVersion: string;
  exportedAt: string;
  settings: import("./settings").AgencySettings;
  evaluations: ClientEvaluation[];
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
  errors: string[];
}

export const LEAD_SOURCES = [
  "Referans",
  "Organik arama",
  "Sosyal medya",
  "LinkedIn",
  "Instagram",
  "YouTube",
  "Soğuk e-posta",
  "Soğuk mesaj",
  "Reklam",
  "Mevcut müşteri",
  "İş ortağı",
  "Etkinlik",
  "Topluluk",
  "Diğer",
] as const;

export const SALES_STAGES = [
  "İlk temas",
  "Ön görüşme",
  "Keşif görüşmesi",
  "Teklif öncesi",
  "Teklif gönderildi",
  "Müzakere",
  "Kazanıldı",
  "Kaybedildi",
  "Reddedildi",
] as const;
