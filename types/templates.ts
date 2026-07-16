export type MessageCategory =
  | "budget_insufficient"
  | "tech_stack_mismatch"
  | "timeline_unrealistic"
  | "strategic_misalignment"
  | "more_info_needed"
  | "scope_document_request"
  | "decision_maker_meeting_request"
  | "technical_access_request"
  | "conditional_acceptance"
  | "pre_proposal_conditions"
  | "soft_no"
  | "hard_no"
  | "alternative_provider_referral"
  | "proposal_sending"
  | "second_discovery_call";

export type MessageTone = "professional" | "friendly" | "direct" | "consultative";

export interface MessageTemplate {
  id: string;
  category: MessageCategory;
  title: string;
  tone: MessageTone;
  body: string;
}

export interface MessageVariables {
  clientName: string;
  companyName: string;
  contactName: string;
  projectName: string;
  minBudget: string;
  currentBudget: string;
  requestedDeliveryDate: string;
  proposedDeliveryDate: string;
  agencyName: string;
  userName: string;
  serviceArea: string;
  recommendedNextStep: string;
}
