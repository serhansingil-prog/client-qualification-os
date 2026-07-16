import type { ConfidenceLevel, DecisionLevel, QualificationStatus, RiskSeverity } from "@/types/evaluation";

export const DECISION_LABELS: Record<DecisionLevel, string> = {
  hell_yes: "Kesinlikle Evet",
  qualified_yes: "Nitelikli Evet",
  yellow_flag: "Ek Bilgi Gerekli",
  soft_no: "Nazik Ret",
  hard_no: "Kesin Ret",
};

export const DECISION_COLOR_CLASSES: Record<DecisionLevel, string> = {
  hell_yes: "bg-status-positive-strong text-status-positive-strong-foreground border-transparent",
  qualified_yes: "bg-status-positive-soft text-status-positive-soft-foreground border-transparent",
  yellow_flag: "bg-status-caution text-status-caution-foreground border-transparent",
  soft_no: "bg-status-negative-soft text-status-negative-soft-foreground border-transparent",
  hard_no: "bg-status-negative-strong text-status-negative-strong-foreground border-transparent",
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
  qualified: "bg-status-positive-soft text-status-positive-soft-foreground border-transparent",
  uncertain: "bg-status-caution text-status-caution-foreground border-transparent",
  disqualified: "bg-status-negative-strong text-status-negative-strong-foreground border-transparent",
  not_evaluated: "bg-muted text-muted-foreground border-transparent",
};

export const RISK_SEVERITY_LABELS: Record<RiskSeverity, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  critical: "Kritik",
};

export const RISK_SEVERITY_COLOR_CLASSES: Record<RiskSeverity, string> = {
  low: "bg-muted text-muted-foreground border-transparent",
  medium: "bg-status-caution text-status-caution-foreground border-transparent",
  high: "bg-status-negative-soft text-status-negative-soft-foreground border-transparent",
  critical: "bg-status-negative-strong text-status-negative-strong-foreground border-transparent",
};
