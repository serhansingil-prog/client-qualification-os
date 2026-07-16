import type { MessageCategory, MessageTemplate, MessageTone, MessageVariables } from "@/types/templates";

export const MESSAGE_CATEGORY_LABELS: Record<MessageCategory, string> = {
  budget_insufficient: "Bütçe yetersiz",
  tech_stack_mismatch: "Teknoloji yığını uyumsuz",
  timeline_unrealistic: "Teslim süresi gerçekçi değil",
  strategic_misalignment: "Stratejik uyum yok",
  more_info_needed: "Daha fazla bilgi gerekli",
  scope_document_request: "Kapsam belgesi talebi",
  decision_maker_meeting_request: "Karar vericiyle görüşme talebi",
  technical_access_request: "Teknik erişim talebi",
  conditional_acceptance: "Şartlı kabul",
  pre_proposal_conditions: "Teklif öncesi koşullar",
  soft_no: "Nazik ret",
  hard_no: "Kesin ret",
  alternative_provider_referral: "Alternatif sağlayıcıya yönlendirme",
  proposal_sending: "Teklif gönderme",
  second_discovery_call: "İkinci keşif görüşmesi",
};

export const MESSAGE_TONE_LABELS: Record<MessageTone, string> = {
  professional: "Profesyonel",
  friendly: "Samimi",
  direct: "Doğrudan",
  consultative: "Danışmanlık odaklı",
};

const TONE_OPENERS: Record<MessageTone, (v: MessageVariables) => string> = {
  professional: (v) => `Sayın {{contactName}},`.replace("{{contactName}}", v.contactName || v.clientName),
  friendly: (v) => `Merhaba {{contactName}}!`.replace("{{contactName}}", v.contactName || v.clientName),
  direct: (v) => `{{contactName}},`.replace("{{contactName}}", v.contactName || v.clientName),
  consultative: (v) =>
    `Merhaba {{contactName}}, vaktinizi aldığım için teşekkürler.`.replace(
      "{{contactName}}",
      v.contactName || v.clientName
    ),
};

const TONE_CLOSERS: Record<MessageTone, string> = {
  professional: "Saygılarımla,\n{{userName}}\n{{agencyName}}",
  friendly: "İyi çalışmalar,\n{{userName}}\n{{agencyName}}",
  direct: "{{userName}}\n{{agencyName}}",
  consultative: "Sorularınız olursa görüşmek isteriz.\n\n{{userName}}\n{{agencyName}}",
};

interface CategoryContent {
  category: MessageCategory;
  title: string;
  coreBody: string;
}

const CATEGORY_CONTENT: CategoryContent[] = [
  {
    category: "budget_insufficient",
    title: "Bütçe yetersiz",
    coreBody:
      "{{projectName}} projeniz için paylaştığınız bilgileri değerlendirdik. Bu kapsamda sağlıklı bir sonuç almak için minimum bütçe {{minBudget}} seviyesinde olmalı, mevcut bütçeniz {{currentBudget}} olarak paylaşıldı. Kapsamı daraltarak veya bütçeyi yeniden değerlendirerek ilerlemek isterseniz memnuniyetle tekrar konuşabiliriz.",
  },
  {
    category: "tech_stack_mismatch",
    title: "Teknoloji yığını uyumsuz",
    coreBody:
      "{{companyName}} için {{projectName}} kapsamını incelerken mevcut sistemlerinizin standart çalıştığımız teknoloji altyapısıyla örtüşmediğini gördük. Bu durum proje riskini ve maliyetini önemli ölçüde artırıyor. Sistem geçişi planlıyorsanız veya alternatif bir entegrasyon seçeneğiniz varsa süreci yeniden değerlendirebiliriz.",
  },
  {
    category: "timeline_unrealistic",
    title: "Teslim süresi gerçekçi değil",
    coreBody:
      "Talep ettiğiniz {{requestedDeliveryDate}} teslim tarihinin, {{projectName}} kapsamı için kaliteden ödün vermeden karşılanması mümkün görünmüyor. Sağlıklı bir teslimat için {{proposedDeliveryDate}} tarihini öneriyoruz. Bu takvim üzerinde birlikte ilerlemek isterseniz süreci hemen başlatabiliriz.",
  },
  {
    category: "strategic_misalignment",
    title: "Stratejik uyum yok",
    coreBody:
      "{{projectName}} projenizi değerlendirdik; ancak bu proje şu anda odaklandığımız hizmet alanının ve uzmanlık yol haritamızın dışında kalıyor. Size en iyi sonucu verebilecek bir ekiple çalışmanızın daha doğru olacağını düşünüyoruz.",
  },
  {
    category: "more_info_needed",
    title: "Daha fazla bilgi gerekli",
    coreBody:
      "{{projectName}} projenizi değerlendirmeye devam edebilmemiz için birkaç noktada daha fazla bilgiye ihtiyacımız var: {{recommendedNextStep}}. Bu bilgileri paylaştığınızda değerlendirmeyi hızla tamamlayıp size dönüş yapabiliriz.",
  },
  {
    category: "scope_document_request",
    title: "Kapsam belgesi talebi",
    coreBody:
      "{{projectName}} için sağlıklı bir teklif hazırlayabilmemiz adına yazılı bir kapsam belgesine ihtiyacımız var. Beklenen çıktılar, entegrasyonlar ve başarı kriterlerini içeren kısa bir doküman paylaşırsanız süreci hızlandırabiliriz.",
  },
  {
    category: "decision_maker_meeting_request",
    title: "Karar vericiyle görüşme talebi",
    coreBody:
      "{{projectName}} kapsamında ilerleyebilmemiz için bütçe ve sözleşme onayını verecek kişiyle kısa bir görüşme planlamak istiyoruz. Uygun olduğunuz bir tarih paylaşırsanız görüşmeyi organize edelim.",
  },
  {
    category: "technical_access_request",
    title: "Teknik erişim talebi",
    coreBody:
      "{{projectName}} projesine başlayabilmemiz için gerekli yönetici ve API erişimlerinin proje öncesinde sağlanması gerekiyor. Erişim listesini paylaşırsanız kurulum sürecini birlikte planlayabiliriz.",
  },
  {
    category: "conditional_acceptance",
    title: "Şartlı kabul",
    coreBody:
      "{{projectName}} projenizi değerlendirdik ve genel olarak olumlu buluyoruz. Projeye başlayabilmemiz için: {{recommendedNextStep}}. Bu koşullar netleştiğinde teklifimizi paylaşabiliriz.",
  },
  {
    category: "pre_proposal_conditions",
    title: "Teklif öncesi koşullar",
    coreBody:
      "Teklif hazırlamadan önce netleştirmemiz gereken birkaç konu var: {{recommendedNextStep}}. Bu maddeler üzerinde mutabık kaldığımızda teklifi en kısa sürede iletebiliriz.",
  },
  {
    category: "soft_no",
    title: "Nazik ret",
    coreBody:
      "{{projectName}} projenizi dikkatle değerlendirdik. Şu anda ilerlemek için gereken koşulların bir kısmı bizim çalışma modelimizle örtüşmüyor. İlerleyen dönemde koşullar değişirse tekrar konuşmaktan memnuniyet duyarız.",
  },
  {
    category: "hard_no",
    title: "Kesin ret",
    coreBody:
      "{{projectName}} projenizi değerlendirdik ve bu kapsamda birlikte çalışamayacağımızı bildirmek isteriz. İlginiz için teşekkür eder, projenizde başarılar dileriz.",
  },
  {
    category: "alternative_provider_referral",
    title: "Alternatif sağlayıcıya yönlendirme",
    coreBody:
      "{{projectName}} projeniz bizim uzmanlık alanımızın dışında kalıyor. Bu tarz ihtiyaçlara daha uygun çözüm ortakları bulunuyor; dilerseniz size birkaç alternatif önerebiliriz.",
  },
  {
    category: "proposal_sending",
    title: "Teklif gönderme",
    coreBody:
      "{{projectName}} projeniz için değerlendirmemizi tamamladık ve olumlu sonuçlandı. Teklifimizi hazırlıyoruz ve en kısa sürede sizinle paylaşacağız.",
  },
  {
    category: "second_discovery_call",
    title: "İkinci keşif görüşmesi",
    coreBody:
      "{{projectName}} projenizle ilgili ilk görüşmemizden sonra netleştirmek istediğimiz birkaç konu var. Kısa bir ikinci keşif görüşmesi planlayarak {{recommendedNextStep}} konusunu birlikte netleştirebiliriz.",
  },
];

function buildTemplate(content: CategoryContent, tone: MessageTone): MessageTemplate {
  const body = ["{{opener}}", "", content.coreBody, "", TONE_CLOSERS[tone]].join("\n");
  return {
    id: `${content.category}_${tone}`,
    category: content.category,
    title: content.title,
    tone,
    body,
  };
}

const ALL_TONES: MessageTone[] = ["professional", "friendly", "direct", "consultative"];

export const MESSAGE_TEMPLATES: MessageTemplate[] = CATEGORY_CONTENT.flatMap((content) =>
  ALL_TONES.map((tone) => buildTemplate(content, tone))
);

export function getMessageTemplate(
  category: MessageCategory,
  tone: MessageTone
): MessageTemplate {
  const template = MESSAGE_TEMPLATES.find((t) => t.category === category && t.tone === tone);
  if (!template) {
    throw new Error(`Şablon bulunamadı: ${category} / ${tone}`);
  }
  return template;
}

export function renderMessageTemplate(
  template: MessageTemplate,
  variables: MessageVariables
): string {
  const opener = TONE_OPENERS[template.tone](variables);
  const withOpener = template.body.replace("{{opener}}", opener);

  return Object.entries(variables).reduce((text, [key, value]) => {
    return text.replaceAll(`{{${key}}}`, value || "-");
  }, withOpener);
}

export function buildDefaultMessageVariables(overrides: Partial<MessageVariables> = {}): MessageVariables {
  return {
    clientName: "",
    companyName: "",
    contactName: "",
    projectName: "",
    minBudget: "",
    currentBudget: "",
    requestedDeliveryDate: "",
    proposedDeliveryDate: "",
    agencyName: "",
    userName: "",
    serviceArea: "",
    recommendedNextStep: "",
    ...overrides,
  };
}
