import type { ConfidenceLevel, DecisionLevel, QualificationStatus, RiskSeverity } from "@/types/evaluation";

export const DECISION_LABELS: Record<DecisionLevel, string> = {
  hell_yes: "Kesinlikle Evet",
  qualified_yes: "Nitelikli Evet",
  yellow_flag: "Ek Bilgi Gerekli",
  soft_no: "Nazik Ret",
  hard_no: "Kesin Ret",
};

export const DECISION_COLOR_CLASSES: Record<DecisionLevel, string> = {
  hell_yes: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  qualified_yes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900",
  yellow_flag: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  soft_no: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  hard_no: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: "Yüksek Güven",
  medium: "Orta Güven",
  low: "Düşük Güven",
};

export const QUALIFICATION_STATUS_LABELS: Record<QualificationStatus, string> = {
  qualified: "Uygun",
  uncertain: "Belirsiz",
  disqualified: "Uygun Değil",
  not_evaluated: "Değerlendirilmedi",
};

export const QUALIFICATION_STATUS_COLOR_CLASSES: Record<QualificationStatus, string> = {
  qualified: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900",
  uncertain: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  disqualified: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  not_evaluated: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-800",
};

export const RISK_SEVERITY_LABELS: Record<RiskSeverity, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  critical: "Kritik",
};

export const RISK_SEVERITY_COLOR_CLASSES: Record<RiskSeverity, string> = {
  low: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-800",
  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
};
