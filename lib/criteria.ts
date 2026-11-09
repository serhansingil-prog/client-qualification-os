import type { CriterionDefinition } from "@/types/scoring";
import type { AgencySettings, CriticalRule, CriticalRuleKey, Sector } from "@/types/settings";

export const CRITERIA_DEFINITIONS: CriterionDefinition[] = [
  {
    id: "problem_severity",
    order: 1,
    category: "commercial",
    name: "Problem Şiddeti",
    shortDescription:
      "Müşterinin gerçek, ölçülebilir ve ticari öneme sahip bir problemi olup olmadığını değerlendirir.",
    mainQuestion:
      "Müşteri, çözülmesi gereken gerçek, ölçülebilir ve ticari öneme sahip bir problem yaşıyor mu?",
    goodSigns: [
      "Gelir kaybı",
      "Kaçan satış fırsatları",
      "Yüksek operasyon maliyeti",
      "Fazla manuel iş",
      "Personel kapasite problemi",
      "Ölçülebilir zaman kaybı",
      "Müşteri memnuniyeti sorunu",
      "Yüksek hata oranı",
      "Süreç gecikmeleri",
      "Yönetim görünürlüğü eksikliği",
    ],
    redFlags: [
      "Yalnızca AI kullanmış görünmek istiyor",
      "Problem net değil",
      "Çözümün iş etkisini açıklayamıyor",
      "Proje sadece “güzel olur” seviyesinde",
      "Sorun için herhangi bir veri sunamıyor",
      "Problemin sahibi belli değil",
    ],
    weight: 2,
  },
  {
    id: "urgency_change_readiness",
    order: 2,
    category: "operational",
    name: "Aciliyet ve Değişim İsteği",
    shortDescription:
      "Müşterinin problemi gerçekten çözmek isteyip istemediğini ve değişime hazır olup olmadığını değerlendirir.",
    mainQuestion:
      "Müşteri problemi gerçekten çözmek istiyor mu ve gerekli değişiklikleri yapmaya hazır mı?",
    goodSigns: [
      "Problem için net son tarih var",
      "Yönetim desteği mevcut",
      "Kaynak ayırmaya hazır",
      "Süreç değişikliğini kabul ediyor",
      "Ekip iş birliğine açık",
      "Mevcut sorunun maliyetini biliyor",
    ],
    redFlags: [
      "Sadece araştırma yapıyor",
      "Karar sürekli erteleniyor",
      "Değişiklik istemiyor",
      "Mevcut süreçlere dokunulmasını istemiyor",
      "Projenin sahibi yok",
      "İç direnç yüksek",
    ],
    weight: 1,
  },
  {
    id: "roi_potential",
    order: 3,
    category: "commercial",
    name: "Yatırım Getirisi Potansiyeli",
    shortDescription:
      "Projenin sağlayacağı finansal veya operasyonel faydanın ölçülebilir olup olmadığını değerlendirir.",
    mainQuestion:
      "Projenin sağlayacağı finansal veya operasyonel fayda ölçülebiliyor mu?",
    goodSigns: [
      "Tahmini yıllık ek gelir tanımlanmış",
      "Tahmini yıllık maliyet tasarrufu tanımlanmış",
      "Aylık zaman tasarrufu hesaplanabiliyor",
      "Hedeflenen ROI oranı net",
      "Başarı metriği tanımlı",
    ],
    redFlags: [
      "Başarı metriği yok",
      "Finansal etki hesaplanamıyor",
      "Proje maliyeti potansiyel faydadan yüksek",
      "Müşteri yalnızca özellik satın alıyor",
      "Sonuç yerine teknolojiye odaklanıyor",
    ],
    weight: 2,
  },
  {
    id: "budget_fit",
    order: 4,
    category: "commercial",
    name: "Bütçe Uygunluğu",
    shortDescription:
      "Müşterinin bütçesinin minimum çalışma seviyesini karşılayıp karşılamadığını değerlendirir.",
    mainQuestion: "Müşterinin bütçesi minimum çalışma seviyesini karşılıyor mu?",
    goodSigns: [
      "Bütçe minimum eşiğin üzerinde",
      "Bütçe net biçimde tanımlanmış",
      "Ödeme koşulları standart",
    ],
    redFlags: [
      "En iyi fiyatı soruyor",
      "Önce küçük başlayalım diyor",
      "İleride daha fazla iş sözü veriyor",
      "Teklif öncesi ödeme planı istiyor",
      "Fiyatı sürekli pazarlık konusu yapıyor",
      "Beklentisi bütçesinden çok daha yüksek",
    ],
    weight: 2,
  },
  {
    id: "decision_maker_access",
    order: 5,
    category: "commercial",
    name: "Karar Vericiye Erişim",
    shortDescription:
      "Bütçeyi onaylayan ve sözleşmeyi imzalayan kişiyle doğrudan iletişim kurulup kurulamadığını değerlendirir.",
    mainQuestion:
      "Bütçeyi onaylayan ve sözleşmeyi imzalayan kişiyle doğrudan iletişim kurulabiliyor mu?",
    goodSigns: [
      "Doğrudan karar verici ile görüşülüyor",
      "Karar verici toplantılara katılıyor",
      "Tek onay katmanı var",
    ],
    redFlags: [
      "“Patronuma sormam gerekiyor”",
      "“Ekibimiz değerlendirecek”",
      "“Yönetim kuruluna sunacağız”",
      "Bütçe sahibi bilinmiyor",
      "Satın alma süreci tanımsız",
    ],
    weight: 2,
  },
  {
    id: "scope_clarity",
    order: 6,
    category: "operational",
    name: "Kapsam Netliği",
    shortDescription:
      "Müşterinin neye ihtiyaç duyduğunu yeterince açık biçimde tanımlayıp tanımlayamadığını değerlendirir.",
    mainQuestion:
      "Müşteri neye ihtiyaç duyduğunu yeterince açık biçimde tanımlayabiliyor mu?",
    goodSigns: [
      "Yazılı brief",
      "Açık çıktılar",
      "Belirli entegrasyonlar",
      "Başarı kriterleri",
      "Bilinen kullanıcı senaryoları",
      "Tanımlı proje sınırları",
      "Önceliklendirilmiş gereksinimler",
    ],
    redFlags: [
      "“Bir şeyler otomatikleştirelim”",
      "“İşimizi inceleyip ne yapacağımızı siz söyleyin”",
      "“Her şeyi daha iyi yapalım”",
      "Proje sınırlarının olmaması",
      "Sürekli yeni fikir eklenmesi",
      "Nihai karar sahibinin belli olmaması",
    ],
    weight: 1,
  },
  {
    id: "timeline_realism",
    order: 7,
    category: "operational",
    name: "Zaman Çizelgesi Gerçekçiliği",
    shortDescription:
      "Projenin teslim süresinin kapsam ve kalite açısından gerçekçi olup olmadığını değerlendirir.",
    mainQuestion: "Projenin teslim süresi kapsam ve kalite açısından gerçekçi mi?",
    goodSigns: [
      "Teslim tarihi 21 gün veya daha uzun",
      "Kapsam netleştikten sonra tarih belirlenmiş",
      "Test ve kalite süreçlerine zaman ayrılmış",
    ],
    redFlags: [
      "Birkaç gün içinde teslim beklentisi",
      "Lansman tarihinin çok yakın olması",
      "Kapsam netleşmeden tarih verilmesi",
      "Hız için testlerin atlanmasının istenmesi",
      "Hafta sonu çalışmasının normal kabul edilmesi",
    ],
    weight: 1,
    helpText:
      "Talep edilen teslim tarihi ile ilk iletişim tarihi arasındaki gün farkı otomatik hesaplanır: 21 gün ve üzeri 1 puan, 14-20 gün 0,5 puan, 14 günden kısa 0 puan verir.",
  },
  {
    id: "tech_stack_fit",
    order: 8,
    category: "technical",
    name: "Teknoloji Yığını Uyumu",
    shortDescription:
      "Müşterinin standart teknoloji yığınını kullanıp kullanmadığını veya geçişe açık olup olmadığını değerlendirir.",
    mainQuestion:
      "Müşteri standart teknoloji yığınını kullanıyor veya geçiş yapmaya istekli mi?",
    goodSigns: [
      "Standart teknoloji yığınından bir veya daha fazlasını kullanıyor",
      "Geçişe açık ve esnek",
      "Resmî API erişimi mevcut",
    ],
    redFlags: [
      "Eski özel yazılım",
      "Dokümantasyonu olmayan CRM",
      "Kapalı sistem",
      "Geçişe kapalı müşteri",
      "Tek projede kullanılacak özel entegrasyon",
      "Resmî API bulunmaması",
      "Yalnızca manuel erişim sunulması",
    ],
    weight: 1,
  },
  {
    id: "template_reusability_fit",
    order: 9,
    category: "technical",
    name: "Şablon ve Tekrar Kullanılabilirlik Uyumu",
    shortDescription:
      "Talebin mevcut bir çözüm şablonuyla ne oranda örtüştüğünü değerlendirir.",
    mainQuestion:
      "Talep mevcut bir çözüm şablonuyla en az yüzde 80 oranında örtüşüyor mu?",
    goodSigns: [
      "Mevcut şablona doğrudan uyuyor",
      "Küçük özelleştirme gerekiyor",
      "Yeni fakat tekrar kullanılabilir şablon oluşturulabilir",
    ],
    redFlags: [
      "Büyük özelleştirme gerekiyor",
      "Tamamen özel ve tek seferlik",
    ],
    weight: 1,
  },
  {
    id: "technical_data_readiness",
    order: 10,
    category: "technical",
    name: "Teknik ve Veri Hazırlığı",
    shortDescription:
      "Gerekli hesapların, erişimlerin, altyapının ve verilerin hazır olup olmadığını değerlendirir.",
    mainQuestion: "Gerekli hesaplar, erişimler, altyapı ve veriler hazır mı?",
    goodSigns: [
      "Yönetici erişimleri hazır",
      "API erişimi mevcut",
      "Veri düzenli",
      "Süreçler dokümante edilmiş",
      "Veri sahibi belli",
      "Sistem sahibi belli",
      "Test ortamı mevcut",
      "KVKK gereksinimleri belirlenmiş",
      "Güvenlik gereksinimleri belirlenmiş",
      "Yedekleme süreci mevcut",
    ],
    redFlags: [
      "Hesaplar proje başladıktan sonra açılacak",
      "Yönetici erişimi yok",
      "Veri dağınık",
      "Veri sahibi belli değil",
      "Sistem sahibi belli değil",
      "Ajansın temel BT desteği vermesi bekleniyor",
      "Veriler yalnızca kişisel cihazlarda tutuluyor",
    ],
    weight: 1,
  },
  {
    id: "maintenance_support_expectation",
    order: 11,
    category: "relationship",
    name: "Bakım ve Destek Beklentisi",
    shortDescription:
      "Müşterinin kurulum ile devam eden desteğin farklı hizmetler olduğunu kabul edip etmediğini değerlendirir.",
    mainQuestion:
      "Müşteri kurulum ile devam eden desteğin farklı hizmetler olduğunu kabul ediyor mu?",
    goodSigns: [
      "Aylık destek ücretini soruyor",
      "İzleme ve bakım planı istiyor",
      "SLA beklentisini açıkça ifade ediyor",
      "Destek kapsamını sözleşmeyle kabul ediyor",
      "Değişiklik taleplerinin ayrıca ücretlendirileceğini anlıyor",
    ],
    redFlags: [
      "Sistem sonsuza kadar ücretsiz çalışmalı",
      "Tüm hatalar ücretsiz düzeltilmeli",
      "Bakım kurulum fiyatına dahil olmalı",
      "Ömür boyu destek bekliyor",
      "Sınırsız revizyon istiyor",
      "Her yeni ihtiyacı mevcut kapsama dahil görüyor",
    ],
    weight: 1,
  },
  {
    id: "communication_style",
    order: 12,
    category: "relationship",
    name: "İletişim ve Çalışma Tarzı",
    shortDescription:
      "Müşterinin iletişim biçiminin çalışma düzeniyle uyumlu olup olmadığını değerlendirir.",
    mainQuestion: "Müşterinin iletişim biçimi çalışma düzeniyle uyumlu mu?",
    goodSigns: [
      "Yazılı ve açık iletişim",
      "24-48 saat içinde yanıt",
      "Asenkron çalışmaya uygunluk",
      "Çalışma saatlerine saygı",
      "Bilgileri düzenli sağlama",
      "Tek bir iletişim sorumlusu",
      "Kararları yazılı biçimde onaylama",
    ],
    redFlags: [
      "Gece geç saatte acil yanıt beklentisi",
      "Sürekli anlık toplantı talebi",
      "Karmaşık konularda yalnızca sesli mesaj",
      "Sürekli yönlendirme ihtiyacı",
      "Aynı konuyu farklı kanallardan yazma",
      "Toplantı kararlarını sonradan değiştirme",
      "Agresif veya saygısız iletişim",
    ],
    weight: 1,
  },
  {
    id: "internal_project_owner",
    order: 13,
    category: "operational",
    name: "İç Proje Sahibi",
    shortDescription:
      "Müşteri tarafında projeyi takip edecek bir iç sorumlu olup olmadığını değerlendirir.",
    mainQuestion:
      "Müşteri tarafında projeyi takip edecek, bilgi sağlayacak ve süreci ilerletecek bir iç sorumlu var mı?",
    goodSigns: [
      "Proje sahibi belirlenmiş",
      "Düzenli geri bildirim verecek",
      "Departmanlar arası koordinasyon sağlayabilecek",
      "Kararları takip edecek",
      "Gerekli verilere erişebilecek",
    ],
    redFlags: [
      "Projeyi kimin yöneteceği belli değil",
      "Her toplantıya farklı kişi geliyor",
      "Sorumluluk ajansa bırakılıyor",
      "İç ekip projeye zaman ayırmıyor",
      "Bilgi sağlama sorumlusu yok",
    ],
    weight: 1,
  },
  {
    id: "strategic_alignment",
    order: 14,
    category: "strategic",
    name: "Stratejik Uyum",
    shortDescription:
      "Projenin kullanıcının önümüzdeki 12 aylık iş hedeflerine katkı sağlayıp sağlamadığını değerlendirir.",
    mainQuestion:
      "Bu proje, kullanıcının önümüzdeki 12 aylık iş hedeflerine katkı sağlıyor mu?",
    goodSigns: [
      "İdeal müşteri profiline uyuyor",
      "Güçlü bir vaka çalışması olur",
      "Tekrar satılabilir",
      "Ürünleşmiş hizmete dönüşebilir",
      "Geliştirilmek istenen uzmanlığa katkı sağlar",
      "Portföyde gösterilmek istenir",
      "İdeal müşteri yönlendirmeleri getirebilir",
      "Uzun vadeli konumlandırmayı güçlendirir",
    ],
    redFlags: [
      "Ana uzmanlık alanının dışında",
      "Tek seferlik ve yeniden kullanılamaz",
      "Portföyde gösterilmek istenmiyor",
      "Hedef müşteri profiline uymuyor",
      "Ekibi yanlış alana yönlendiriyor",
      "Rastgele gelir dışında stratejik değeri yok",
    ],
    weight: 1,
  },
];

export function getCriterionById(id: string): CriterionDefinition | undefined {
  return CRITERIA_DEFINITIONS.find((criterion) => criterion.id === id);
}

export const SECTOR_LABELS: Record<Sector, string> = {
  automation: "Dijital Otomasyon Ajansı",
  ads: "Dijital Reklam Ajansı",
  real_estate: "Gayrimenkul Ofisi",
};

export const CRITERION_CATEGORY_LABELS: Record<string, string> = {
  commercial: "Ticari Uygunluk",
  operational: "Operasyonel Uygunluk",
  technical: "Teknik Hazırlık",
  relationship: "Çalışma İlişkisi",
  strategic: "Stratejik Uyum",
};

// Only the three "technical" criteria are worded specifically for a
// software/automation agency (tech stack, solution templates, technical
// data). Everything else (budget, timeline, decision maker, communication,
// strategic fit) already reads as sector-neutral, so "automation" needs no
// override — it stays the base CRITERIA_DEFINITIONS wording.
type CriterionOverride = Pick<
  CriterionDefinition,
  "name" | "shortDescription" | "mainQuestion" | "goodSigns" | "redFlags"
>;

const SECTOR_CRITERIA_OVERRIDES: Partial<Record<Sector, Record<string, CriterionOverride>>> = {
  ads: {
    tech_stack_fit: {
      name: "Reklam Platformu ve Hesap Uyumu",
      shortDescription:
        "Müşterinin standart reklam platformlarını (Meta, Google) kullanıp kullanmadığını veya geçişe açık olup olmadığını değerlendirir.",
      mainQuestion: "Müşteri standart reklam platformlarını kullanıyor veya yönetim erişimi vermeye istekli mi?",
      goodSigns: [
        "Meta/Google Ads hesabı mevcut ve erişime açık",
        "Piksel/etiket kurulumuna açık",
        "Reklam hesabı yönetici erişimi verilebiliyor",
      ],
      redFlags: [
        "Reklam hesabı yok veya kapalı",
        "Hesap paylaşımına kapalı",
        "Piksel/analitik kurulumuna izin vermiyor",
        "Sadece organik içerik istiyor ama reklam bütçesi de bekliyor",
      ],
    },
    template_reusability_fit: {
      name: "Kampanya Şablonu Uyumu",
      shortDescription: "Talebin mevcut bir kampanya şablonuyla ne oranda örtüştüğünü değerlendirir.",
      mainQuestion: "Talep mevcut bir kampanya şablonuyla en az yüzde 80 oranında örtüşüyor mu?",
      goodSigns: [
        "Mevcut kampanya şablonuna doğrudan uyuyor",
        "Küçük özelleştirme gerekiyor",
        "Yeni fakat tekrar kullanılabilir bir kampanya yapısı oluşturulabilir",
      ],
      redFlags: ["Büyük özelleştirme gerekiyor", "Tamamen özel ve tek seferlik bir kampanya isteniyor"],
    },
    technical_data_readiness: {
      name: "Reklam Verisi ve Erişim Hazırlığı",
      shortDescription:
        "Gerekli reklam hesabı erişimlerinin, piksel/verinin ve KVKK gereksinimlerinin hazır olup olmadığını değerlendirir.",
      mainQuestion: "Gerekli hesap erişimleri, piksel/analitik verisi ve KVKK gereksinimleri hazır mı?",
      goodSigns: [
        "Reklam hesabı yönetici erişimi hazır",
        "Piksel/analitik kurulu",
        "Müşteri verisi düzenli",
        "KVKK gereksinimleri belirlenmiş",
        "Marka varlıkları (logo, görsel) hazır",
      ],
      redFlags: [
        "Hesap erişimi proje başladıktan sonra verilecek",
        "Piksel/analitik kurulu değil",
        "Marka varlıkları eksik",
        "KVKK/veri paylaşım onayı belirsiz",
      ],
    },
  },
  real_estate: {
    tech_stack_fit: {
      name: "Mülk Belgeleri ve Sistem Uyumu",
      shortDescription:
        "Mülkün tapu/belge durumunun ve mevcut ilan sistemlerinin standart sürece uyup uymadığını değerlendirir.",
      mainQuestion: "Mülkün tapu ve belgeleri standart sürece uygun mu, ya da tamamlanmaya açık mı?",
      goodSigns: [
        "Tapu ve belgeler eksiksiz",
        "İlan/portföy sistemine entegrasyona açık",
        "Standart yetkilendirme belgesi imzalanabiliyor",
      ],
      redFlags: [
        "Tapu/belge sorunları var",
        "Birden fazla hissedar anlaşmazlığı",
        "Yetkilendirme belgesi imzalamaya kapalı",
        "Sadece kendi ilan kanallarını kullanmak istiyor",
      ],
    },
    template_reusability_fit: {
      name: "Hizmet Paketi Uyumu",
      shortDescription: "Talebin mevcut bir standart hizmet paketiyle ne oranda örtüştüğünü değerlendirir.",
      mainQuestion: "Talep mevcut bir standart hizmet paketiyle en az yüzde 80 oranında örtüşüyor mu?",
      goodSigns: [
        "Mevcut standart pakete doğrudan uyuyor",
        "Küçük özelleştirme gerekiyor",
        "Yeni fakat tekrar kullanılabilir bir paket oluşturulabilir",
      ],
      redFlags: ["Büyük özelleştirme gerekiyor", "Tamamen özel ve tek seferlik bir talep"],
    },
    technical_data_readiness: {
      name: "Mülk Verisi ve Belge Hazırlığı",
      shortDescription:
        "Mülkle ilgili gerekli belgelerin, fotoğrafların ve yasal verilerin hazır olup olmadığını değerlendirir.",
      mainQuestion: "Mülkle ilgili gerekli belgeler, fotoğraflar ve yasal veriler hazır mı?",
      goodSigns: [
        "Tapu ve yasal belgeler hazır",
        "Güncel fotoğraf/plan mevcut",
        "Mülk sahibi/yetkilisi belli",
        "KVKK ve kişisel veri gereksinimleri belirlenmiş",
      ],
      redFlags: [
        "Belgeler eksik veya güncel değil",
        "Fotoğraf/plan yok",
        "Mülk sahipliği belirsiz",
        "Birden fazla yetkisiz kişi süreçte",
      ],
    },
  },
};

/** Same 14 criteria, same ids/weights/order/category (scoring never
 * changes) — only name/description/question/signs are swapped for the
 * sector's vocabulary where an override exists. */
export function getCriteriaDefinitions(sector: Sector = "automation"): CriterionDefinition[] {
  const overrides = SECTOR_CRITERIA_OVERRIDES[sector];
  if (!overrides) return CRITERIA_DEFINITIONS;
  return CRITERIA_DEFINITIONS.map((criterion) => {
    const override = overrides[criterion.id];
    return override ? { ...criterion, ...override } : criterion;
  });
}

export function getCriterionByIdForSector(id: string, sector: Sector = "automation"): CriterionDefinition | undefined {
  return getCriteriaDefinitions(sector).find((criterion) => criterion.id === id);
}

type CriticalRuleOverride = Pick<CriticalRule, "title" | "description">;

// Same 3 sector-flavored spots as the criteria above (support/maintenance
// framing, admin/API access, unsupported custom systems) — only wording
// changes; trigger conditions, severity and autoReject stay identical.
const SECTOR_CRITICAL_RULE_OVERRIDES: Partial<
  Record<Sector, Partial<Record<CriticalRuleKey, CriticalRuleOverride>>>
> = {
  ads: {
    expects_free_lifetime_support: {
      title: "Ücretsiz sınırsız yönetim beklentisi",
      description:
        "Müşteri, kampanya kurulumu ile aylık reklam yönetiminin ayrı hizmetler olduğunu kabul etmiyor.",
    },
    no_admin_or_api_access: {
      title: "Reklam hesabı erişimi sağlanamıyor",
      description: "Reklam hesabı yönetici erişimi veya piksel/analitik erişimi sağlanamıyor.",
    },
    unsupported_custom_system: {
      title: "Desteklenmeyen reklam platformu",
      description: "Standart reklam platformları (Meta, Google) dışında desteklenmeyen bir sistem kullanılıyor.",
    },
  },
  real_estate: {
    expects_free_lifetime_support: {
      title: "Ücretsiz sınırsız hizmet beklentisi",
      description: "Müşteri, pazarlama ile satış/kiralama sürecinin farklı hizmet kalemleri olduğunu kabul etmiyor.",
    },
    no_admin_or_api_access: {
      title: "Mülk belge erişimi sağlanamıyor",
      description: "Tapu, yetkilendirme belgesi veya mülke ait gerekli belgeler sağlanamıyor.",
    },
    unsupported_custom_system: {
      title: "Desteklenmeyen ilan/portföy sistemi",
      description: "Standart ilan veya portföy yönetim süreciyle uyumlu olmayan özel bir sistem kullanılıyor.",
    },
  },
};

export function getCriticalRulesForSector(rules: CriticalRule[], sector: Sector = "automation"): CriticalRule[] {
  const overrides = SECTOR_CRITICAL_RULE_OVERRIDES[sector];
  if (!overrides) return rules;
  return rules.map((rule) => {
    const override = overrides[rule.key];
    return override ? { ...rule, ...override } : rule;
  });
}

/** Same AgencySettings, only criticalRules text swapped for the sector's
 * vocabulary — safe to pass anywhere a plain AgencySettings is expected. */
export function getSectorAdjustedSettings(settings: AgencySettings, sector: Sector): AgencySettings {
  return { ...settings, criticalRules: getCriticalRulesForSector(settings.criticalRules, sector) };
}

export const AGENCY_SECTION_LABELS: Record<
  Sector,
  { cardTitle: string; nameLabel: string; nameDefault: string }
> = {
  automation: { cardTitle: "Ajans Bilgileri", nameLabel: "Ajans adı", nameDefault: "Ajansınız" },
  ads: { cardTitle: "Ajans Bilgileri", nameLabel: "Ajans adı", nameDefault: "Ajansınız" },
  real_estate: { cardTitle: "Ofis Bilgileri", nameLabel: "Ofis adı", nameDefault: "Ofisiniz" },
};

export const SECTOR_TECH_STACK_DEFAULTS: Record<Sector, string[]> = {
  automation: [
    "n8n",
    "Shopify",
    "Meta Ads",
    "Google Ads",
    "Lovable",
    "Claude API",
    "OpenAI API",
    "HubSpot",
    "Airtable",
    "Google Sheets",
    "Supabase",
    "WordPress",
  ],
  ads: [
    "Meta Ads",
    "Google Ads",
    "TikTok Ads",
    "LinkedIn Ads",
    "Google Analytics",
    "Meta Pixel",
    "Google Tag Manager",
    "Google Merchant Center",
    "Canva",
    "HubSpot",
  ],
  real_estate: [
    "Sahibinden.com",
    "Hepsiemlak",
    "Zingat",
    "Emlakjet",
    "WhatsApp Business",
    "Instagram",
    "Google Haritalar",
    "Canva",
    "Google Sheets",
  ],
};

export const TECH_STACK_SECTION_LABELS: Record<
  Sector,
  {
    tab: string;
    cardTitle: string;
    helperText: string;
    placeholder: string;
    emptyText: string;
    removeLabel: (item: string) => string;
  }
> = {
  automation: {
    tab: "Teknoloji Yığını",
    cardTitle: "Standart Teknoloji Yığını",
    helperText:
      "Değerlendirme sırasında \"Teknoloji Yığını Uyumu\" kriterini cevaplarken referans olması için tuttuğunuz liste; puanlamayı otomatik değiştirmez.",
    placeholder: "Yeni teknoloji ekle",
    emptyText: "Henüz teknoloji eklenmedi.",
    removeLabel: (item) => `${item} teknolojisini kaldır`,
  },
  ads: {
    tab: "Reklam Platformları",
    cardTitle: "Standart Reklam Platformları ve Araçlar",
    helperText:
      "Değerlendirme sırasında \"Reklam Platformu ve Hesap Uyumu\" kriterini cevaplarken referans olması için tuttuğunuz liste; puanlamayı otomatik değiştirmez.",
    placeholder: "Yeni platform veya araç ekle",
    emptyText: "Henüz platform eklenmedi.",
    removeLabel: (item) => `${item} platformunu kaldır`,
  },
  real_estate: {
    tab: "Sistemler ve Araçlar",
    cardTitle: "Standart Sistemler ve Araçlar",
    helperText:
      "Değerlendirme sırasında \"Mülk Belgeleri ve Sistem Uyumu\" kriterini cevaplarken referans olması için tuttuğunuz liste; puanlamayı otomatik değiştirmez.",
    placeholder: "Yeni sistem veya araç ekle",
    emptyText: "Henüz sistem eklenmedi.",
    removeLabel: (item) => `${item} sistemini kaldır`,
  },
};
