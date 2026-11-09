"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { LightboxImage } from "@/components/shared/lightbox-image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/hooks/use-settings";
import { useUser } from "@/hooks/use-user";
import { useProfile } from "@/hooks/use-profile";
import { usePermissions } from "@/hooks/use-permissions";
import { useSectorPermission } from "@/hooks/use-sector-permission";
import { hasPermission } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import { DEFAULT_DECISION_THRESHOLDS, DEFAULT_SETTINGS } from "@/lib/constants";
import {
  CRITERION_CATEGORY_LABELS,
  SECTOR_LABELS,
  TECH_STACK_SECTION_LABELS,
  getCriteriaDefinitions,
} from "@/lib/criteria";
import type { Sector } from "@/types/settings";

const SECTOR_ORDER: Sector[] = ["automation", "ads", "real_estate"];

interface GuideImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface StepDef {
  id: string;
  title: string;
  images: (sector: Sector) => GuideImage[];
  body: (sector: Sector) => ReactNode;
}

function sectorSrc(base: string, sector: Sector): string {
  return `/guide/${base}-${sector}.png`;
}

interface ReferenceDef {
  id: string;
  title: string;
  body: (sector: Sector) => ReactNode;
}

const STEPS: StepDef[] = [
  {
    id: "step-1",
    title: "Önce örnek verilerle keşfedin",
    images: (sector) => [
      {
        src: sectorSrc("01-sidebar-demo-modu", sector),
        width: 1440,
        height: 900,
        alt: "Sol menüdeki Demo Modu anahtarı açıkken örnek değerlendirmeleri gösteren değerlendirmeler listesi",
      },
    ],
    body: (sector) => (
      <>
        <p>
          Sol menünün altındaki <strong className="text-foreground">Demo Modu</strong> anahtarını
          açın (veya Panel’deki “Örnek değerlendirmeyi yükle” düğmesine tıklayıp menüden{" "}
          <strong className="text-foreground">{SECTOR_LABELS[sector]}</strong> seçeneğini
          seçin).
        </p>
        <p>
          {SECTOR_LABELS[sector]} için, 5 farklı karar seviyesini kapsayan 15 örnek değerlendirme
          otomatik olarak yüklenir. Gerçek verileriniz demo görünümünde asla listelenmez;
          anahtarı kapattığınızda kaldığınız yere dönersiniz.
        </p>
      </>
    ),
  },
  {
    id: "step-2",
    title: "Yeni değerlendirme başlatın, müşteri bilgilerini girin",
    images: (sector) => [
      {
        src: sectorSrc("07-musteri-bilgileri-formu", sector),
        width: 1440,
        height: 900,
        alt: "Sihirbazın 1. adımı: müşteri, iletişim ve proje bilgilerini içeren doldurulmuş form",
      },
    ],
    body: () => (
      <>
        <p>
          Sol menüden <strong className="text-foreground">Yeni Değerlendirme</strong>’ye
          tıklayın. 8 adımlı bir sihirbaz açılır ve üstte hangi adımda olduğunuzu gösteren
          bir ilerleme çubuğu görürsünüz.
        </p>
        <p>
          1. adımda müşteri adı, proje adı, bütçe ve ilk iletişim tarihi gibi zorunlu (*)
          alanları doldurun. İstediğiniz an sağ üstteki “Taslağı Kaydet” ile çıkabilir,
          değerlendirmeler listesinden kaldığınız yerden devam edebilirsiniz.
        </p>
      </>
    ),
  },
  {
    id: "step-3",
    title: "14 kriteri tek tek puanlayın",
    images: (sector) => [
      {
        src: sectorSrc("08-kriter-karti-bos", sector),
        width: 1440,
        height: 900,
        alt: "Değerlendirilmemiş bir kriter kartı: soru, iyi işaretler, kırmızı bayraklar ve puan seçenekleri",
      },
      {
        src: sectorSrc("09-kriter-karti-dolu", sector),
        width: 1440,
        height: 900,
        alt: "Aynı kriter kartı, Uygun seçilip not alanı doldurulduktan sonra",
      },
    ],
    body: () => (
      <>
        <p>
          Sonraki 6 adımda kriterler kategori kategori karşınıza çıkar. Her kartta ana
          soru, <strong className="text-foreground">İyi İşaretler</strong> /{" "}
          <strong className="text-foreground">Kırmızı Bayraklar</strong> listesi ve dört
          puan seçeneği bulunur: <strong className="text-foreground">Uygun</strong>,{" "}
          <strong className="text-foreground">Belirsiz</strong>,{" "}
          <strong className="text-foreground">Uygun Değil</strong>,{" "}
          <strong className="text-foreground">Değerlendirilmedi</strong>.
        </p>
        <p>
          Bir seçenek işaretleyin, isterseniz not ekleyin; kart üstündeki rozet anında
          güncellenir. Ciddi bir risk gördüğünüzde “Bu kriteri kritik risk olarak işaretle”
          kutusunu da açabilirsiniz.
        </p>
      </>
    ),
  },
  {
    id: "step-4",
    title: "Sonucu okuyun: karar, puan ve riskler",
    images: (sector) => [
      {
        src: sectorSrc("03-sonuc-karar-detay", sector),
        width: 1440,
        height: 1914,
        alt: "Sonuç sayfası: genel karar rozeti, standart ve ağırlıklı puan, kritik eleme uyarıları, güçlü alanlar ve riskler",
      },
    ],
    body: () => (
      <>
        <p>
          Son adımda (veya değerlendirmeyi tamamladıktan sonra “Sonuç” sekmesinde) önerilen
          kararı, standart puanı (10 üzerinden) ve ağırlıklı puanı (100 üzerinden)
          görürsünüz.
        </p>
        <p>
          Kritik bir eleme koşulu tetiklenmişse üstte turuncu bir uyarı çıkar. Altında
          değerlendirmenin güçlü alanları, riskleri ve “kararı değiştirecek koşullar”
          listelenir — bu, müşteriyle görüşürken tam olarak neyi netleştirmeniz gerektiğini
          gösterir.
        </p>
      </>
    ),
  },
  {
    id: "step-5",
    title: "“Ya böyle olsaydı?” sorusunu Senaryo Simülatörü ile sorun",
    images: (sector) => [
      {
        src: sectorSrc("04-senaryo-simulatoru", sector),
        width: 1440,
        height: 984,
        alt: "Senaryo Simülatörü sekmesi: bir koşul işaretlenmiş, mevcut durum ile simüle edilen durum karşılaştırması",
      },
    ],
    body: () => (
      <>
        <p>
          Değerlendirme detayında <strong className="text-foreground">Senaryo Simülatörü</strong>{" "}
          sekmesini açın. “Bütçe yükselirse”, “Teslim tarihi uzatılırsa” gibi koşullardan
          istediğinizi işaretleyin; yeni puan ve karar anında hesaplanıp mevcut durumla yan
          yana gösterilir.
        </p>
        <p>
          Sonuçtan memnunsanız “Bu değişiklikleri değerlendirmeye uygula” ile gerçek
          değerlendirmeyi güncelleyebilirsiniz — hiçbir şey siz onaylamadan kaydedilmez.
        </p>
      </>
    ),
  },
  {
    id: "step-6",
    title: "Müşteriye gönderilecek mesajı otomatik oluşturun",
    images: (sector) => [
      {
        src: sectorSrc("05-mesaj-olusturucu", sector),
        width: 1440,
        height: 900,
        alt: "Mesaj Oluşturucu sekmesi: şablon kategorisi ve ton seçilmiş, otomatik doldurulmuş mesaj metni",
      },
    ],
    body: () => (
      <>
        <p>
          Aynı sayfada <strong className="text-foreground">Mesaj Oluşturucu</strong>{" "}
          sekmesine geçin. Karara uygun şablon kategorisi otomatik seçilir; isterseniz 15
          kategori ve 4 tondan (Profesyonel, Samimi, Doğrudan, Danışmanlık odaklı) birini
          seçin.
        </p>
        <p>
          Mesaj, müşteri adı, proje adı ve bütçe gibi bilgilerle otomatik doldurulur.
          Metni serbestçe düzenleyip “Panoya Kopyala” ile e-postanıza yapıştırabilirsiniz.
        </p>
      </>
    ),
  },
  {
    id: "step-7",
    title: "Tüm değerlendirmelerinizi tek listede yönetin",
    images: (sector) => [
      {
        src: sectorSrc("02-degerlendirmeler-listesi", sector),
        width: 1440,
        height: 900,
        alt: "Değerlendirmeler sayfası: arama, sektör/karar/kaynak/satış aşaması filtreleri ve sonuç tablosu",
      },
    ],
    body: () => (
      <>
        <p>
          Sol menüden <strong className="text-foreground">Değerlendirmeler</strong>’e girin.
          Müşteri, şirket veya proje adına göre arayabilir; sektör, karar, müşteri kaynağı
          veya satış aşamasına göre filtreleyebilir, puana ya da bütçeye göre
          sıralayabilirsiniz.
        </p>
        <p>
          Satır sonundaki menüden bir kaydı düzenleyebilir, kopyalayabilir, arşivleyebilir
          veya silebilirsiniz. Tüm veriler tarayıcınızın localStorage’ında saklanır; JSON
          olarak dışa/içe aktarabilir veya CSV olarak dışa aktarabilirsiniz.
        </p>
      </>
    ),
  },
  {
    id: "step-8",
    title: "Puanlama sistemini kendi işletmenize göre ayarlayın",
    images: (sector) => [
      {
        src: sectorSrc("06-ayarlar-puanlama", sector),
        width: 1440,
        height: 1538,
        alt: "Ayarlar sayfası, Puanlama sekmesi: bütçe/süre eşikleri, kriter ağırlıkları ve karar eşikleri",
      },
    ],
    body: (sector) => {
      const possessive = sector === "real_estate" ? "ofisinize" : "ajansınıza";
      const techTab = TECH_STACK_SECTION_LABELS[sector].tab;
      return (
        <>
          <p>
            Sol menüden <strong className="text-foreground">Ayarlar</strong> →{" "}
            <strong className="text-foreground">Puanlama</strong>’ya gidin. Minimum bütçe ve
            teslim süresi eşiklerini, her kriterin ağırlığını ve karar seviyelerinin puan
            aralıklarını kendi {possessive} göre değiştirebilirsiniz.
          </p>
          <p>
            Ayrıca <strong className="text-foreground">{techTab}</strong> ve{" "}
            <strong className="text-foreground">Kritik Kurallar</strong> sekmelerinden hangi
            otomatik eleme kurallarının aktif olacağını belirleyebilirsiniz. Değişikliklerden
            sonra sağ üstteki “Kaydet”e basmayı unutmayın.
          </p>
        </>
      );
    },
  },
  {
    id: "step-9",
    title: "Bağlantı Haritasında müşteriler arası örüntüleri keşfedin",
    images: (sector) => [
      {
        src: sectorSrc("10-baglanti-haritasi", sector),
        width: 1400,
        height: 1000,
        alt: "Panel sayfası, Bağlantı Haritası sekmesi: aynı sektör, kaynak veya kritik risk sebebine göre birbirine bağlanan müşteri değerlendirmeleri",
      },
    ],
    body: () => (
      <>
        <p>
          Panel’de <strong className="text-foreground">Bağlantı Haritası</strong> sekmesini
          açın. Her nokta bir değerlendirmedir (karara göre renklendirilir); gri düğümler ise
          aynı sektörü, aynı müşteri kaynağını veya aynı kritik risk sebebini paylaşan
          değerlendirmeleri birbirine bağlayan ortak noktalardır.
        </p>
        <p>
          Arama kutusuna bir sektör, kaynak veya müşteri adı yazarak ilgili bağlantıları
          vurgulayabilir; bir düğümü sürükleyip taşıyabilir, çift tıklayarak izole
          edebilir, tek tıkla ilgili değerlendirmeyi açabilirsiniz. Sağ üstteki +/− ve tam
          ekran düğmeleriyle yakınlaşıp uzaklaşabilirsiniz.
        </p>
      </>
    ),
  },
];

const REFERENCE_ITEMS: ReferenceDef[] = [
  {
    id: "ref-criteria",
    title: "14 Değerlendirme Kriteri",
    body: (sector) => {
      const criteria = getCriteriaDefinitions(sector);
      return (
        <>
          <p>Kriterler 5 kategoriye ayrılır:</p>
          {(Object.keys(CRITERION_CATEGORY_LABELS) as Array<keyof typeof CRITERION_CATEGORY_LABELS>).map(
            (category) => (
              <div key={category}>
                <p className="font-medium text-foreground">{CRITERION_CATEGORY_LABELS[category]}</p>
                <p>
                  {criteria
                    .filter((c) => c.category === category)
                    .map((c) => c.name)
                    .join(", ")}
                </p>
              </div>
            )
          )}
        </>
      );
    },
  },
  {
    id: "ref-scoring",
    title: "Puanlama Sistemi",
    body: () => (
      <>
        <p>
          Her kriter için: <strong className="text-foreground">Uygun = 1</strong>,{" "}
          <strong className="text-foreground">Belirsiz = 0,5</strong>,{" "}
          <strong className="text-foreground">Uygun değil = 0</strong> puan verir.
          “Değerlendirilmedi” kriterler hesaplamaya dahil edilmez.
        </p>
        <p>
          <strong className="text-foreground">Standart puan</strong> (10 üzerinden): tüm
          değerlendirilen kriterlerin basit ortalamasıdır.
        </p>
        <p>
          <strong className="text-foreground">Ağırlıklı puan</strong> (100 üzerinden):
          Problem Şiddeti, ROI Potansiyeli, Bütçe Uygunluğu ve Karar Vericiye Erişim
          varsayılan olarak ×2 ağırlıklıdır, diğer kriterler ×1’dir. Bu ağırlıklar
          Ayarlar → Puanlama sekmesinden değiştirilebilir.
        </p>
        <p>
          <strong className="text-foreground">Güven seviyesi</strong>: kriterlerin
          %90’ı veya fazlası değerlendirildiyse Yüksek, %70-89’u Orta, %70’in altı
          Düşük olarak gösterilir.
        </p>
      </>
    ),
  },
  {
    id: "ref-decisions",
    title: "Karar Seviyeleri",
    body: () => (
      <>
        {DEFAULT_DECISION_THRESHOLDS.map((threshold) => (
          <p key={threshold.decision}>
            <strong className="text-foreground">
              {threshold.minScore}-{threshold.maxScore}: {threshold.label}
            </strong>{" "}
            — {threshold.description}
          </p>
        ))}
        <p>
          Bu eşikler ağırlıklı puana göre belirlenir ve Ayarlar → Puanlama sekmesinden
          özelleştirilebilir.
        </p>
      </>
    ),
  },
  {
    id: "ref-critical-rules",
    title: "Kritik Eleme Kuralları",
    body: () => (
      <p>
        Bütçe eşiğin altındaysa, teslim süresi {DEFAULT_SETTINGS.minTimelineDays} günden
        kısaysa, karar vericiye erişim yoksa veya bir kriteri elle “kritik risk” olarak
        işaretlerseniz sistem otomatik bir uyarı üretir. Bazı kurallar (hukuki risk, veri
        güvenliği gibi) kararı doğrudan “Kesin Ret”e çevirir; diğerleri yüksek puanı en
        fazla “Ek Bilgi Gerekli” seviyesine kadar sınırlar. Kurallar Ayarlar → Kritik
        Kurallar sekmesinden tek tek açılıp kapatılabilir.
      </p>
    ),
  },
];

function TreeLeaf({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block w-full truncate rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function TreeGroup({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:text-foreground"
      >
        <ChevronRight
          className={cn("h-3 w-3 shrink-0 transition-transform", isOpen && "rotate-90")}
          aria-hidden="true"
        />
        {label}
      </button>
      {isOpen ? <div className="ml-4 space-y-0.5 border-l pl-3">{children}</div> : null}
    </div>
  );
}

export default function GuidePage() {
  const { settings, isLoaded } = useSettings();
  const { user } = useUser();
  const { role } = useProfile();
  const { matrix } = usePermissions();
  const { allowedSectors } = useSectorPermission();
  const visibleSectors = hasPermission(matrix, "multi_sector_guide", role, user?.email)
    ? SECTOR_ORDER
    : (allowedSectors && allowedSectors.length > 1 ? allowedSectors : [settings.sector]);
  const hasInitialized = useRef(false);

  const [expandedSectors, setExpandedSectors] = useState<Set<Sector>>(new Set(["automation"]));
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["automation:steps"]));
  const [activeKey, setActiveKey] = useState("automation:overview");

  // Once the account's real sector is known, open the guide on that
  // sector's branch instead of always defaulting to automation. Runs once.
  useEffect(() => {
    if (!isLoaded || hasInitialized.current) return;
    hasInitialized.current = true;
    setExpandedSectors(new Set([settings.sector]));
    setExpandedGroups(new Set([`${settings.sector}:steps`]));
    setActiveKey(`${settings.sector}:overview`);
  }, [isLoaded, settings.sector]);

  function toggleSector(sector: Sector) {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) {
        next.delete(sector);
      } else {
        next.add(sector);
      }
      return next;
    });
  }

  function toggleGroup(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const [activeSector, activeSectionId] = activeKey.split(":") as [Sector, string];
  const activeStep = STEPS.find((step) => step.id === activeSectionId);
  const activeReference = REFERENCE_ITEMS.find((item) => item.id === activeSectionId);
  const activeStepIndex = activeStep ? STEPS.indexOf(activeStep) : -1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kullanım Kılavuzları"
        description="Her sektör için ayrı, adım adım ve ekran görüntülü rehber. Soldaki ağaçtan bir sektör ve bölüm seçin."
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <nav className="space-y-1 text-sm md:w-72 md:shrink-0" aria-label="Kılavuz ağacı">
          {visibleSectors.map((sector) => {
            const isSectorOpen = expandedSectors.has(sector);
            return (
              <div key={sector}>
                <button
                  type="button"
                  onClick={() => toggleSector(sector)}
                  aria-expanded={isSectorOpen}
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-left text-sm font-semibold hover:bg-muted"
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform",
                      isSectorOpen && "rotate-90"
                    )}
                    aria-hidden="true"
                  />
                  {SECTOR_LABELS[sector]}
                </button>
                {isSectorOpen ? (
                  <div className="ml-4 space-y-1 border-l pl-3">
                    <TreeLeaf
                      active={activeKey === `${sector}:overview`}
                      onClick={() => setActiveKey(`${sector}:overview`)}
                    >
                      Genel Bakış
                    </TreeLeaf>

                    <TreeGroup
                      label="Adım Adım Kullanım"
                      isOpen={expandedGroups.has(`${sector}:steps`)}
                      onToggle={() => toggleGroup(`${sector}:steps`)}
                    >
                      {STEPS.map((step, index) => (
                        <TreeLeaf
                          key={step.id}
                          active={activeKey === `${sector}:${step.id}`}
                          onClick={() => setActiveKey(`${sector}:${step.id}`)}
                        >
                          {index + 1}. {step.title}
                        </TreeLeaf>
                      ))}
                    </TreeGroup>

                    <TreeGroup
                      label="Referans Bilgiler"
                      isOpen={expandedGroups.has(`${sector}:reference`)}
                      onToggle={() => toggleGroup(`${sector}:reference`)}
                    >
                      {REFERENCE_ITEMS.map((item) => (
                        <TreeLeaf
                          key={item.id}
                          active={activeKey === `${sector}:${item.id}`}
                          onClick={() => setActiveKey(`${sector}:${item.id}`)}
                        >
                          {item.title}
                        </TreeLeaf>
                      ))}
                    </TreeGroup>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {SECTOR_LABELS[activeSector]} kılavuzu
          </p>

          {activeSectionId === "overview" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bu Uygulama Ne İşe Yarar?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Client Qualification OS, potansiyel müşterileri 14 sabit kriter üzerinden
                  puanlayarak size şu kararlardan birini önerir:{" "}
                  <strong className="text-foreground">Kesinlikle Evet</strong>,{" "}
                  <strong className="text-foreground">Nitelikli Evet</strong>,{" "}
                  <strong className="text-foreground">Ek Bilgi Gerekli</strong>,{" "}
                  <strong className="text-foreground">Nazik Ret</strong> veya{" "}
                  <strong className="text-foreground">Kesin Ret</strong>.
                </p>
                <p>
                  Her proje kabul edilmemelidir — amaç, ticari, operasyonel ve stratejik
                  olarak yeterince uygun olmayan projeleri erkenden fark etmenize yardımcı
                  olmaktır. Yüksek bir puan bile, kritik bir eleme koşulu (örneğin bütçe
                  yetersizliği veya karar vericiye erişim olmaması) varsa kararı otomatik
                  olarak “evet”e çeviremez.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {activeStep ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {activeStepIndex + 1}. {activeStep.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  {activeStep.body(activeSector)}
                </div>
                {activeStep.images(activeSector).map((image) => (
                  <LightboxImage key={image.src} {...image} />
                ))}
              </CardContent>
            </Card>
          ) : null}

          {activeReference ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{activeReference.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {activeReference.body(activeSector)}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
