import type { DecisionLevel, RiskSeverity } from "./evaluation";

export type Sector = "automation" | "ads" | "real_estate";

export type CriticalRuleKey =
  | "budget_below_minimum"
  | "no_decision_maker_access"
  | "problem_severity_disqualified"
  | "timeline_too_short"
  | "expects_free_lifetime_support"
  | "no_admin_or_api_access"
  | "no_data_owner"
  | "legal_risk"
  | "data_privacy_risk"
  | "disrespectful_communication"
  | "no_defined_project_owner"
  | "unsupported_custom_system";

export interface CriticalRule {
  id: string;
  key: CriticalRuleKey;
  title: string;
  description: string;
  severity: RiskSeverity;
  isActive: boolean;
  autoReject: boolean;
  userOverridable: boolean;
}

export interface DecisionThreshold {
  decision: DecisionLevel;
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
}

export interface AgencySettings {
  version: number;
  sector: Sector;
  agencyName: string;
  userName: string;
  defaultCurrency: string;
  minProjectBudget: number;
  minSetupAndSupportBudget: number;
  minMonthlyRetainer: number;
  minTimelineDays: number;
  standardTechStack: string[];
  acceptanceScore: number;
  criterionWeights: Record<string, number>;
  criticalRules: CriticalRule[];
  messageSignature: string;
  idealClientProfile: string;
  strategicFocusAreas: string[];
  preferredContactChannel: string;
  workingHours: string;
  defaultSupportScope: string;
  decisionThresholds: DecisionThreshold[];
}
