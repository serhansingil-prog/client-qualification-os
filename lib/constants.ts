import type { AgencySettings, CriticalRule, DecisionThreshold } from "@/types/settings";
import { AGENCY_SECTION_LABELS, CRITERIA_DEFINITIONS, SECTOR_TECH_STACK_DEFAULTS } from "@/lib/criteria";

export const APP_VERSION = "1.0.0";
export const SETTINGS_STORAGE_KEY = "cqos_settings";
export const EVALUATIONS_STORAGE_KEY = "cqos_evaluations";
export const DEMO_EVALUATIONS_STORAGE_KEY = "cqos_demo_evaluations";
export const DEMO_MODE_STORAGE_KEY = "cqos_demo_mode";
export const SIDEBAR_OPEN_STORAGE_KEY = "cqos_sidebar_open";
export const ANTHROPIC_API_KEY_STORAGE_KEY = "cqos_anthropic_api_key";

export const DEFAULT_TECH_STACK = SECTOR_TECH_STACK_DEFAULTS.automation;

export const CURRENCIES = ["USD", "EUR", "GBP", "TRY"] as const;

export const DEFAULT_DECISION_THRESHOLDS: DecisionThreshold[] = [
  {
    decision: "hell_yes",
    minScore: 90,
    maxScore: 100,
    label: "Kesinlikle Evet",
    description:
      "İdeal müşteri. Teklif aynı gün hazırlanabilir, proje önceliklendirilebilir.",
  },
  {
    decision: "qualified_yes",
    minScore: 75,
    maxScore: 89.99,
    label: "Nitelikli Evet",
    description:
      "Güçlü aday. Zayıf noktalar sözleşme veya kapsamla çözülebilir.",
  },
  {
    decision: "yellow_flag",
    minScore: 55,
    maxScore: 74.99,
    label: "Ek Bilgi Gerekli",
    description:
      "Önemli belirsizlikler var. Ek bilgi veya ikinci görüşme gerekli.",
  },
  {
    decision: "soft_no",
    minScore: 35,
    maxScore: 54.99,
    label: "Nazik Ret",
    description:
      "Çok fazla operasyonel veya ticari risk var. Alternatif sağlayıcı önerilebilir.",
  },
  {
    decision: "hard_no",
    minScore: 0,
    maxScore: 34.99,
    label: "Kesin Ret",
    description:
      "Projeye girilmemeli. Kısa ve profesyonel ret mesajı gönderilmeli.",
  },
];

export const DEFAULT_CRITICAL_RULES: CriticalRule[] = [
  {
    id: "rule_budget_below_minimum",
    key: "budget_below_minimum",
    title: "Bütçe minimum eşiğin altında",
    description: "Tahmini proje bütçesi ayarlarda tanımlanan minimum seviyenin altında.",
    severity: "critical",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_no_decision_maker_access",
    key: "no_decision_maker_access",
    title: "Karar vericiye erişim yok",
    description: "Bütçeyi onaylayan kişiyle doğrudan iletişim kurulamıyor.",
    severity: "high",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_problem_severity_disqualified",
    key: "problem_severity_disqualified",
    title: "Problem gerçek veya ölçülebilir değil",
    description: "Problem şiddeti kriteri “uygun değil” olarak işaretlendi.",
    severity: "high",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_timeline_too_short",
    key: "timeline_too_short",
    title: "Teslim süresi gerçekçi değil",
    description: "Talep edilen teslim tarihi 14 günden kısa.",
    severity: "high",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_expects_free_lifetime_support",
    key: "expects_free_lifetime_support",
    title: "Ücretsiz ömür boyu destek beklentisi",
    description: "Müşteri kurulum ve bakımın ayrı hizmetler olduğunu kabul etmiyor.",
    severity: "medium",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_no_admin_or_api_access",
    key: "no_admin_or_api_access",
    title: "Teknik erişimler sağlanamıyor",
    description: "Yönetici veya API erişimi sağlanamıyor.",
    severity: "high",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_no_data_owner",
    key: "no_data_owner",
    title: "Veri sahibi belli değil",
    description: "Projede kullanılacak verinin sahibi tanımlı değil.",
    severity: "medium",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_legal_risk",
    key: "legal_risk",
    title: "Hukuki risk kabul edilemez seviyede",
    description: "Proje hukuki açıdan riskli olarak değerlendirildi.",
    severity: "critical",
    isActive: true,
    autoReject: true,
    userOverridable: false,
  },
  {
    id: "rule_data_privacy_risk",
    key: "data_privacy_risk",
    title: "KVKK veya veri güvenliği riski",
    description: "Veri güvenliği veya KVKK riski kabul edilemez seviyede.",
    severity: "critical",
    isActive: true,
    autoReject: true,
    userOverridable: false,
  },
  {
    id: "rule_disrespectful_communication",
    key: "disrespectful_communication",
    title: "Saygısız veya tehditkâr iletişim",
    description: "Müşteri saygısız veya tehditkâr biçimde iletişim kuruyor.",
    severity: "high",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_no_defined_project_owner",
    key: "no_defined_project_owner",
    title: "Projenin tanımlı sahibi yok",
    description: "Müşteri tarafında projeyi takip edecek iç sorumlu yok.",
    severity: "medium",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
  {
    id: "rule_unsupported_custom_system",
    key: "unsupported_custom_system",
    title: "Desteklenmeyen özel sistem",
    description: "Teknik olarak desteklenmeyen özel bir sistem kullanılıyor.",
    severity: "medium",
    isActive: true,
    autoReject: false,
    userOverridable: true,
  },
];

const defaultCriterionWeights: Record<string, number> = Object.fromEntries(
  CRITERIA_DEFINITIONS.map((criterion) => [criterion.id, criterion.weight])
);

export const DEFAULT_SETTINGS: AgencySettings = {
  version: 1,
  sector: "automation",
  agencyName: AGENCY_SECTION_LABELS.automation.nameDefault,
  userName: "",
  defaultCurrency: "USD",
  minProjectBudget: 10000,
  minSetupAndSupportBudget: 15000,
  minMonthlyRetainer: 3000,
  minTimelineDays: 14,
  standardTechStack: DEFAULT_TECH_STACK,
  acceptanceScore: 75,
  criterionWeights: defaultCriterionWeights,
  criticalRules: DEFAULT_CRITICAL_RULES,
  messageSignature: "",
  idealClientProfile: "",
  strategicFocusAreas: [],
  preferredContactChannel: "E-posta",
  workingHours: "09:00 - 18:00",
  defaultSupportScope: "",
  decisionThresholds: DEFAULT_DECISION_THRESHOLDS,
};
