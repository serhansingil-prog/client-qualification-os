import { addDays } from "@/lib/dates";
import { createEmptyAnswers, draftToEvaluation, type EvaluationDraft } from "@/lib/evaluation";
import { generateId, seedDemoEvaluations, setDemoMode } from "@/lib/storage";
import type { QualificationStatus } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";

interface DemoRecordSpec {
  clientName: string;
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
  companySize: string;
  projectName: string;
  projectDescription: string;
  requestedService: string;
  estimatedBudget: number;
  monthlyRetainer: number;
  currency: string;
  inquiryDaysAgo: number;
  deliveryDaysFromInquiry: number;
  leadSource: string;
  salesStage: string;
  generalNotes: string;
  statuses: Record<string, QualificationStatus>;
  criticalRiskCriterionId?: string;
  criticalRiskNote?: string;
}

function buildDemoDraft(spec: DemoRecordSpec, settings: AgencySettings): EvaluationDraft {
  const now = new Date();
  const inquiryDate = addDays(now.toISOString(), -spec.inquiryDaysAgo).slice(0, 10);
  const requestedDeliveryDate = addDays(
    new Date(inquiryDate).toISOString(),
    spec.deliveryDaysFromInquiry
  ).slice(0, 10);

  const answers = createEmptyAnswers(settings).map((answer) => {
    const status = spec.statuses[answer.criterionId] ?? answer.status;
    const isCriticalRisk = answer.criterionId === spec.criticalRiskCriterionId;
    return {
      ...answer,
      status,
      isCriticalRisk,
      notes: isCriticalRisk ? spec.criticalRiskNote ?? "" : answer.notes,
    };
  });

  const createdAt = new Date(inquiryDate).toISOString();

  return {
    id: generateId(),
    clientName: spec.clientName,
    companyName: spec.companyName,
    contactName: spec.contactName,
    email: spec.email,
    phone: "",
    website: "",
    industry: spec.industry,
    companySize: spec.companySize,
    projectName: spec.projectName,
    projectDescription: spec.projectDescription,
    requestedService: spec.requestedService,
    estimatedBudget: spec.estimatedBudget,
    currency: spec.currency,
    monthlyRetainer: spec.monthlyRetainer,
    requestedDeliveryDate,
    potentialStartDate: requestedDeliveryDate,
    inquiryDate,
    leadSource: spec.leadSource,
    salesStage: spec.salesStage,
    generalNotes: spec.generalNotes,
    answers,
    recommendedNextAction: "",
    isDraft: false,
    isArchived: false,
    isDemo: true,
    createdAt,
    updatedAt: createdAt,
  };
}

// Five demo records — one per decision band, spread across the last six
// months, five different sectors and five different lead sources — so every
// dashboard chart (decision mix, score distribution, monthly trend, lead
// source performance, sector acceptance, critical risks) has real data to
// show as soon as demo mode is turned on.
const DEMO_SPECS: DemoRecordSpec[] = [
  {
    // Kesinlikle Evet (90-100)
    clientName: "BrightRetail A.Ş.",
    companyName: "BrightRetail Perakendecilik",
    contactName: "Aylin Demir",
    email: "aylin@brightretail.com",
    industry: "Perakende",
    companySize: "51-200",
    projectName: "Mağaza Stok Senkronizasyon Sistemi",
    projectDescription: "Fiziksel mağazalar ile e-ticaret stoklarını gerçek zamanlı senkronize eden entegrasyon.",
    requestedService: "Sistem entegrasyonu",
    estimatedBudget: 25000,
    monthlyRetainer: 1200,
    currency: "USD",
    inquiryDaysAgo: 35,
    deliveryDaysFromInquiry: 35,
    leadSource: "LinkedIn",
    salesStage: "Teklif gönderildi",
    generalNotes: "Karar verici ilk görüşmeden itibaren süreçte. Bütçe onaylı.",
    statuses: {
      problem_severity: "qualified",
      urgency_change_readiness: "qualified",
      roi_potential: "qualified",
      budget_fit: "qualified",
      decision_maker_access: "qualified",
      scope_clarity: "qualified",
      timeline_realism: "qualified",
      tech_stack_fit: "qualified",
      template_reusability_fit: "uncertain",
      technical_data_readiness: "qualified",
      maintenance_support_expectation: "qualified",
      communication_style: "qualified",
      internal_project_owner: "qualified",
      strategic_alignment: "qualified",
    },
  },
  {
    // Nitelikli Evet (75-89.99) — mevcut Nova Commerce örneği
    clientName: "Nova Commerce",
    companyName: "Nova Commerce Ltd.",
    contactName: "Elif Kaya",
    email: "elif@novacommerce.com",
    industry: "E-ticaret",
    companySize: "11-50",
    projectName: "Shopify Raporlama Otomasyonu",
    projectDescription:
      "Shopify mağazası için haftalık satış ve envanter raporlarını otomatik oluşturan bir raporlama sistemi.",
    requestedService: "Otomasyon ve raporlama",
    estimatedBudget: 12000,
    monthlyRetainer: 800,
    currency: "USD",
    inquiryDaysAgo: 0,
    deliveryDaysFromInquiry: 28,
    leadSource: "Referans",
    salesStage: "Keşif görüşmesi",
    generalNotes: "Örnek değerlendirme — Client Qualification OS demo verisi.",
    statuses: {
      problem_severity: "qualified",
      urgency_change_readiness: "uncertain",
      roi_potential: "qualified",
      budget_fit: "qualified",
      decision_maker_access: "qualified",
      scope_clarity: "uncertain",
      timeline_realism: "qualified",
      tech_stack_fit: "qualified",
      template_reusability_fit: "qualified",
      technical_data_readiness: "uncertain",
      maintenance_support_expectation: "qualified",
      communication_style: "qualified",
      internal_project_owner: "uncertain",
      strategic_alignment: "qualified",
    },
  },
  {
    // Ek Bilgi Gerekli / Sarı Bayrak (55-74.99)
    clientName: "Vertex Yazılım",
    companyName: "Vertex Yazılım A.Ş.",
    contactName: "Caner Öztürk",
    email: "caner@vertexyazilim.com",
    industry: "Yazılım/SaaS",
    companySize: "1-10",
    projectName: "Destek Talebi Otomasyonu",
    projectDescription: "Gelen destek taleplerini önceliklendirip ilgili ekibe otomatik yönlendiren sistem.",
    requestedService: "Süreç otomasyonu",
    estimatedBudget: 14000,
    monthlyRetainer: 900,
    currency: "USD",
    inquiryDaysAgo: 70,
    deliveryDaysFromInquiry: 25,
    leadSource: "Organik arama",
    salesStage: "Ön görüşme",
    generalNotes: "Kapsam henüz netleşmedi, ikinci görüşme planlanmalı.",
    statuses: {
      problem_severity: "qualified",
      urgency_change_readiness: "uncertain",
      roi_potential: "uncertain",
      budget_fit: "qualified",
      decision_maker_access: "uncertain",
      scope_clarity: "disqualified",
      timeline_realism: "qualified",
      tech_stack_fit: "qualified",
      template_reusability_fit: "uncertain",
      technical_data_readiness: "disqualified",
      maintenance_support_expectation: "qualified",
      communication_style: "qualified",
      internal_project_owner: "uncertain",
      strategic_alignment: "qualified",
    },
  },
  {
    // Nazik Ret (35-54.99)
    clientName: "Kutup Lojistik",
    companyName: "Kutup Lojistik Ltd. Şti.",
    contactName: "Serkan Yıldız",
    email: "serkan@kutuplojistik.com",
    industry: "Lojistik",
    companySize: "201-500",
    projectName: "Filo Takip Panosu",
    projectDescription: "Araç filosu için canlı konum ve yakıt tüketimi takip panosu.",
    requestedService: "Özel panel geliştirme",
    estimatedBudget: 6000,
    monthlyRetainer: 400,
    currency: "USD",
    inquiryDaysAgo: 115,
    deliveryDaysFromInquiry: 10,
    leadSource: "Soğuk e-posta",
    salesStage: "Müzakere",
    generalNotes: "Bütçe eşiğin altında, karar verici toplantılara katılmıyor.",
    statuses: {
      problem_severity: "uncertain",
      urgency_change_readiness: "uncertain",
      roi_potential: "uncertain",
      budget_fit: "disqualified",
      decision_maker_access: "disqualified",
      scope_clarity: "uncertain",
      timeline_realism: "disqualified",
      tech_stack_fit: "uncertain",
      template_reusability_fit: "disqualified",
      technical_data_readiness: "uncertain",
      maintenance_support_expectation: "qualified",
      communication_style: "qualified",
      internal_project_owner: "uncertain",
      strategic_alignment: "qualified",
    },
  },
  {
    // Kesin Ret (0-34.99)
    clientName: "ZetaMed Sağlık",
    companyName: "ZetaMed Sağlık Hizmetleri",
    contactName: "Burak Aksoy",
    email: "burak@zetamed.com",
    industry: "Sağlık",
    companySize: "500+",
    projectName: "Hasta Verisi Analiz Sistemi",
    projectDescription: "Hasta kayıtlarını analiz edip risk skorları üreten bir sistem talebi.",
    requestedService: "Veri analizi",
    estimatedBudget: 2500,
    monthlyRetainer: 0,
    currency: "USD",
    inquiryDaysAgo: 155,
    deliveryDaysFromInquiry: 5,
    leadSource: "Soğuk mesaj",
    salesStage: "Reddedildi",
    generalNotes: "Hassas sağlık verisi için güvenlik ve KVKK gereksinimleri karşılanamıyor.",
    statuses: {
      problem_severity: "disqualified",
      urgency_change_readiness: "disqualified",
      roi_potential: "disqualified",
      budget_fit: "disqualified",
      decision_maker_access: "disqualified",
      scope_clarity: "disqualified",
      timeline_realism: "disqualified",
      tech_stack_fit: "disqualified",
      template_reusability_fit: "uncertain",
      technical_data_readiness: "disqualified",
      maintenance_support_expectation: "disqualified",
      communication_style: "uncertain",
      internal_project_owner: "disqualified",
      strategic_alignment: "disqualified",
    },
    criticalRiskCriterionId: "technical_data_readiness",
    criticalRiskNote: "Hasta verileri için KVKK ve veri güvenliği gereksinimleri karşılanamıyor.",
  },
];

export function buildDemoEvaluations(settings: AgencySettings) {
  return DEMO_SPECS.map((spec) => draftToEvaluation(buildDemoDraft(spec, settings), settings));
}

/**
 * Seeds the five demo evaluations (replacing any previous demo set) and
 * switches the app into demo mode, so demo data stays fully separate from
 * the user's real evaluations.
 */
export function activateDemoDataset(settings: AgencySettings): void {
  seedDemoEvaluations(buildDemoEvaluations(settings));
  setDemoMode(true);
}
