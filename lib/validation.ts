import { z } from "zod";
import { isPastDate } from "@/lib/dates";

function isValidUrl(value: string): boolean {
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
}

export const qualificationStatusSchema = z.enum([
  "qualified",
  "uncertain",
  "disqualified",
  "not_evaluated",
]);

export const decisionLevelSchema = z.enum([
  "hell_yes",
  "qualified_yes",
  "yellow_flag",
  "soft_no",
  "hard_no",
]);

export const confidenceLevelSchema = z.enum(["high", "medium", "low"]);

export const riskSeveritySchema = z.enum(["low", "medium", "high", "critical"]);

export const criterionCategorySchema = z.enum([
  "commercial",
  "operational",
  "technical",
  "relationship",
  "strategic",
]);

export const criterionAnswerSchema = z.object({
  criterionId: z.string().min(1),
  status: qualificationStatusSchema,
  score: z.number().nullable(),
  weight: z.number().positive(),
  notes: z.string(),
  evidence: z.string().optional(),
  followUpQuestion: z.string().optional(),
  isCriticalRisk: z.boolean(),
});

export const criticalFailureSchema = z.object({
  id: z.string(),
  criterionId: z.string().optional(),
  title: z.string(),
  description: z.string(),
  severity: riskSeveritySchema,
  blocksApproval: z.boolean(),
});

export const clientEvaluationSchema = z.object({
  id: z.string(),
  clientName: z.string().min(1),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  projectName: z.string().min(1),
  projectDescription: z.string().optional(),
  requestedService: z.string().optional(),
  estimatedBudget: z.number().nonnegative().optional(),
  monthlyRetainer: z.number().nonnegative().optional(),
  currency: z.string().min(1),
  requestedDeliveryDate: z.string().optional(),
  potentialStartDate: z.string().optional(),
  inquiryDate: z.string().min(1),
  leadSource: z.string().optional(),
  salesStage: z.string().optional(),
  generalNotes: z.string().optional(),
  answers: z.array(criterionAnswerSchema),
  standardScore: z.number(),
  weightedScore: z.number(),
  confidenceLevel: confidenceLevelSchema,
  decision: decisionLevelSchema,
  criticalFailures: z.array(criticalFailureSchema),
  recommendedNextAction: z.string().optional(),
  isDraft: z.boolean(),
  isArchived: z.boolean(),
  isDemo: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const criticalRuleSchema = z.object({
  id: z.string(),
  key: z.enum([
    "budget_below_minimum",
    "no_decision_maker_access",
    "problem_severity_disqualified",
    "timeline_too_short",
    "expects_free_lifetime_support",
    "no_admin_or_api_access",
    "no_data_owner",
    "legal_risk",
    "data_privacy_risk",
    "disrespectful_communication",
    "no_defined_project_owner",
    "unsupported_custom_system",
  ]),
  title: z.string(),
  description: z.string(),
  severity: riskSeveritySchema,
  isActive: z.boolean(),
  autoReject: z.boolean(),
  userOverridable: z.boolean(),
});

export const decisionThresholdSchema = z.object({
  decision: decisionLevelSchema,
  minScore: z.number(),
  maxScore: z.number(),
  label: z.string(),
  description: z.string(),
});

export const agencySettingsSchema = z.object({
  version: z.number(),
  agencyName: z.string(),
  userName: z.string(),
  defaultCurrency: z.string().min(1),
  minProjectBudget: z.number().nonnegative(),
  minSetupAndSupportBudget: z.number().nonnegative(),
  minMonthlyRetainer: z.number().nonnegative(),
  minTimelineDays: z.number().nonnegative(),
  standardTechStack: z.array(z.string()),
  acceptanceScore: z.number(),
  criterionWeights: z.record(z.string(), z.number().positive()),
  criticalRules: z.array(criticalRuleSchema),
  messageSignature: z.string(),
  idealClientProfile: z.string(),
  strategicFocusAreas: z.array(z.string()),
  preferredContactChannel: z.string(),
  workingHours: z.string(),
  defaultSupportScope: z.string(),
  decisionThresholds: z.array(decisionThresholdSchema),
});

export const exportFormatSchema = z.object({
  appVersion: z.string(),
  exportedAt: z.string(),
  settings: agencySettingsSchema,
  evaluations: z.array(clientEvaluationSchema),
});

export const clientInformationSchema = z.object({
  clientName: z.string().min(1, "Müşteri adı zorunludur"),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Geçerli bir e-posta adresi girin",
    }),
  phone: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((value) => !value || isValidUrl(value), {
      message: "Geçerli bir web sitesi adresi girin",
    }),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  projectName: z.string().min(1, "Proje adı zorunludur"),
  projectDescription: z.string().optional(),
  requestedService: z.string().optional(),
  estimatedBudget: z
    .number({ error: "Geçerli bir sayı girin" })
    .nonnegative("Bütçe negatif olamaz")
    .optional(),
  currency: z.string().min(1, "Para birimi zorunludur"),
  monthlyRetainer: z
    .number({ error: "Geçerli bir sayı girin" })
    .nonnegative("Aylık destek bedeli negatif olamaz")
    .optional(),
  requestedDeliveryDate: z
    .string()
    .optional()
    .refine((value) => !value || !isPastDate(value), {
      message: "Teslim tarihi geçmişte olamaz",
    }),
  potentialStartDate: z.string().optional(),
  inquiryDate: z.string().min(1, "İlk iletişim tarihi zorunludur"),
  leadSource: z.string().optional(),
  salesStage: z.string().optional(),
  generalNotes: z.string().optional(),
});

export type ClientInformationFormValues = z.infer<typeof clientInformationSchema>;
