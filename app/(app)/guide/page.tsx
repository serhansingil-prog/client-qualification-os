import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LightboxImage } from "@/components/shared/lightbox-image";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_DECISION_THRESHOLDS, DEFAULT_SETTINGS } from "@/lib/constants";
import { CRITERIA_DEFINITIONS, CRITERION_CATEGORY_LABELS } from "@/lib/criteria";

interface GuideImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface GuideStepProps {
  step: number;
  title: string;
  children: ReactNode;
  images: GuideImage[];
}

function GuideStep({ step, title, children, images }: GuideStepProps) {
  return (
    <AccordionItem value={`step-${step}`} className="rounded-lg border px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-1 items-center gap-3 pr-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
            {step}
          </span>
          <span className="text-left text-sm font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-4 pl-10">
          <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
          {images.map((image) => (
            <LightboxImage
              key={image.src}
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

interface ReferenceItemProps {
  title: string;
  children: ReactNode;
}

function ReferenceItem({ title, children }: ReferenceItemProps) {
  return (
    <AccordionItem value={title} className="rounded-lg border px-4">
      <AccordionTrigger className="hover:no-underline">
        <span className="text-left text-sm font-medium">{title}</span>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="space-y-3 text-sm text-muted-foreground">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Kullanım Kılavuzu"
        description="Client Qualification OS’u ilk kez kullanan biri için adım adım, ekran görüntülü rehber."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bu Uygulama Ne İşe Yarar?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Client Qualification OS, potansiyel müşterileri 14 sabit kriter üzerinden
            puanlayarak size şu kararlardan birini önerir: <strong className="text-foreground">Kesinlikle Evet</strong>,{" "}
            <strong className="text-foreground">Nitelikli Evet</strong>,{" "}
            <strong className="text-foreground">Ek Bilgi Gerekli</strong>,{" "}
            <strong className="text-foreground">Nazik Ret</strong> veya{" "}
            <strong className="text-foreground">Kesin Ret</strong>.
          </p>
          <p>
            Her proje kabul edilmemelidir — amaç, ticari, operasyonel ve stratejik olarak
            yeterince uygun olmayan projeleri erkenden fark etmenize yardımcı olmaktır.
            Yüksek bir puan bile, kritik bir eleme koşulu (örneğin bütçe yetersizliği veya
            karar vericiye erişim olmaması) varsa kararı otomatik olarak “evet”e çeviremez.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Adım Adım Kullanım</h2>
        <p className="text-sm text-muted-foreground">
          Bir başlığa tıklayarak açıklamasını ve ekran görüntüsünü görün. Aşağıdaki 8 adımı
          sırayla takip ederek ilk değerlendirmenizi birkaç dakikada tamamlayabilirsiniz.
        </p>
      </div>

      <Accordion multiple className="space-y-3">
      <GuideStep
        step={1}
        title="Önce örnek verilerle keşfedin"
        images={[
          {
            src: "/guide/01-sidebar-demo-modu.png",
            width: 1440,
            height: 900,
            alt: "Sol menüdeki Demo Modu anahtarı açıkken 5 örnek değerlendirmeyi gösteren değerlendirmeler listesi",
          },
        ]}
      >
        <p>
          Sol menünün altındaki <strong className="text-foreground">Demo Modu</strong> anahtarını
          açın (veya Panel’deki “Örnek değerlendirmeyi yükle” düğmesine tıklayın).
        </p>
        <p>
          5 farklı sektörden, 5 farklı karar seviyesine sahip örnek değerlendirme otomatik
          olarak yüklenir. Gerçek verileriniz demo görünümünde asla listelenmez; anahtarı
          kapattığınızda kaldığınız yere dönersiniz.
        </p>
      </GuideStep>

      <GuideStep
        step={2}
        title="Yeni değerlendirme başlatın, müşteri bilgilerini girin"
        images={[
          {
            src: "/guide/07-musteri-bilgileri-formu.png",
            width: 1440,
            height: 900,
            alt: "Sihirbazın 1. adımı: müşteri, iletişim ve proje bilgilerini içeren doldurulmuş form",
          },
        ]}
      >
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
      </GuideStep>

      <GuideStep
        step={3}
        title="14 kriteri tek tek puanlayın"
        images={[
          {
            src: "/guide/08-kriter-karti-bos.png",
            width: 1440,
            height: 900,
            alt: "Değerlendirilmemiş bir kriter kartı: soru, iyi işaretler, kırmızı bayraklar ve puan seçenekleri",
          },
          {
            src: "/guide/09-kriter-karti-dolu.png",
            width: 1440,
            height: 900,
            alt: "Aynı kriter kartı, Uygun seçilip not alanı doldurulduktan sonra",
          },
        ]}
      >
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
      </GuideStep>

      <GuideStep
        step={4}
        title="Sonucu okuyun: karar, puan ve riskler"
        images={[
          {
            src: "/guide/03-sonuc-karar-detay.png",
            width: 1440,
            height: 1914,
            alt: "Sonuç sayfası: genel karar rozeti, standart ve ağırlıklı puan, kritik eleme uyarıları, güçlü alanlar ve riskler",
          },
        ]}
      >
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
      </GuideStep>

      <GuideStep
        step={5}
        title="“Ya böyle olsaydı?” sorusunu Senaryo Simülatörü ile sorun"
        images={[
          {
            src: "/guide/04-senaryo-simulatoru.png",
            width: 1440,
            height: 984,
            alt: "Senaryo Simülatörü sekmesi: bir koşul işaretlenmiş, mevcut durum ile simüle edilen durum karşılaştırması",
          },
        ]}
      >
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
      </GuideStep>

      <GuideStep
        step={6}
        title="Müşteriye gönderilecek mesajı otomatik oluşturun"
        images={[
          {
            src: "/guide/05-mesaj-olusturucu.png",
            width: 1440,
            height: 900,
            alt: "Mesaj Oluşturucu sekmesi: şablon kategorisi ve ton seçilmiş, otomatik doldurulmuş mesaj metni",
          },
        ]}
      >
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
      </GuideStep>

      <GuideStep
        step={7}
        title="Tüm değerlendirmelerinizi tek listede yönetin"
        images={[
          {
            src: "/guide/02-degerlendirmeler-listesi.png",
            width: 1440,
            height: 900,
            alt: "Değerlendirmeler sayfası: arama, sektör/karar/kaynak/satış aşaması filtreleri ve sonuç tablosu",
          },
        ]}
      >
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
      </GuideStep>

      <GuideStep
        step={8}
        title="Puanlama sistemini kendi ajansınıza göre ayarlayın"
        images={[
          {
            src: "/guide/06-ayarlar-puanlama.png",
            width: 1440,
            height: 1538,
            alt: "Ayarlar sayfası, Puanlama sekmesi: bütçe/süre eşikleri, kriter ağırlıkları ve karar eşikleri",
          },
        ]}
      >
        <p>
          Sol menüden <strong className="text-foreground">Ayarlar</strong> →{" "}
          <strong className="text-foreground">Puanlama</strong>’ya gidin. Minimum bütçe ve
          teslim süresi eşiklerini, her kriterin ağırlığını ve karar seviyelerinin puan
          aralıklarını kendi ajansınıza göre değiştirebilirsiniz.
        </p>
        <p>
          Ayrıca <strong className="text-foreground">Teknoloji Yığını</strong> ve{" "}
          <strong className="text-foreground">Kritik Kurallar</strong> sekmelerinden hangi
          otomatik eleme kurallarının aktif olacağını belirleyebilirsiniz. Değişikliklerden
          sonra sağ üstteki “Kaydet”e basmayı unutmayın.
        </p>
      </GuideStep>
      </Accordion>

      <div className="space-y-1 pt-2">
        <h2 className="text-lg font-semibold">Referans Bilgiler</h2>
        <p className="text-sm text-muted-foreground">
          Kriterler, puanlama formülü ve karar eşikleri hakkında hızlı başvuru.
        </p>
      </div>

      <Accordion multiple className="space-y-3">
        <ReferenceItem title="14 Değerlendirme Kriteri">
          <p>Kriterler 5 kategoriye ayrılır:</p>
          {(Object.keys(CRITERION_CATEGORY_LABELS) as Array<keyof typeof CRITERION_CATEGORY_LABELS>).map(
            (category) => (
              <div key={category}>
                <p className="font-medium text-foreground">{CRITERION_CATEGORY_LABELS[category]}</p>
                <p>
                  {CRITERIA_DEFINITIONS.filter((c) => c.category === category)
                    .map((c) => c.name)
                    .join(", ")}
                </p>
              </div>
            )
          )}
        </ReferenceItem>

        <ReferenceItem title="Puanlama Sistemi">
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
        </ReferenceItem>

        <ReferenceItem title="Karar Seviyeleri">
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
        </ReferenceItem>

        <ReferenceItem title="Kritik Eleme Kuralları">
          <p>
            Bütçe eşiğin altındaysa, teslim süresi {DEFAULT_SETTINGS.minTimelineDays} günden
            kısaysa, karar vericiye erişim yoksa veya bir kriteri elle “kritik risk” olarak
            işaretlerseniz sistem otomatik bir uyarı üretir. Bazı kurallar (hukuki risk, veri
            güvenliği gibi) kararı doğrudan “Kesin Ret”e çevirir; diğerleri yüksek puanı en
            fazla “Ek Bilgi Gerekli” seviyesine kadar sınırlar. Kurallar Ayarlar → Kritik
            Kurallar sekmesinden tek tek açılıp kapatılabilir.
          </p>
        </ReferenceItem>
      </Accordion>
    </div>
  );
}
