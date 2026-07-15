# Client Qualification OS

## Rolün

Sen kıdemli bir ürün tasarımcısı, kullanıcı deneyimi uzmanı ve full-stack geliştiricisin.

Hizmet sağlayıcıların, danışmanların ve AI otomasyon ajanslarının potansiyel müşterileri sistematik biçimde değerlendirebileceği, riskli projeleri erkenden filtreleyebileceği ve doğru müşteri için doğru sonraki adımı önerebileceği bir web uygulaması geliştireceksin.

Uygulamanın adı:

**Client Qualification OS**

---

# 1. Projenin Amacı

Uygulama, potansiyel müşterileri belirlenmiş kriterler üzerinden puanlayarak şu kararlardan birini üretmelidir:

* Kesinlikle evet
* Nitelikli evet
* Ek bilgi gerekli
* Şartlı kabul
* Nazik ret
* Kesin ret

Bu ürün yalnızca puan hesaplayan basit bir form olmamalıdır.

Kullanıcıya şu soruların yanıtını vermelidir:

* Bu müşteri neden uygun?
* Bu müşteri neden riskli?
* Projenin en güçlü tarafları neler?
* En kritik kırmızı bayraklar hangileri?
* Hangi koşullar değişirse müşteri kabul edilebilir hale gelir?
* Teklif gönderilmeli mi?
* Ek görüşme yapılmalı mı?
* Proje reddedilmeli mi?
* Müşteriye hangi mesaj gönderilmeli?

Ana hedef, kullanıcının kötü müşteri ve kötü proje seçimlerini azaltarak daha standart, ölçeklenebilir ve ürünleşmiş bir hizmet modeli kurmasını sağlamaktır.

---

# 2. Temel İş Kuralı

Sistemin ana prensibi:

> Her proje kabul edilmemelidir. Bir proje yalnızca ticari, operasyonel ve stratejik olarak yeterince uygunsa kabul edilmelidir.

Uygulama hem standart puan hem de ağırlıklı puan hesaplamalıdır.

Yüksek toplam puan, kritik bir eleme koşulunu otomatik olarak geçersiz kılmamalıdır.

Örneğin müşteri yüksek puan almış olsa bile aşağıdaki durumlardan biri varsa sistem uyarı vermelidir:

* Bütçe minimum seviyenin altında
* Karar vericiye erişim yok
* Problem gerçek veya ölçülebilir değil
* Teslim süresi gerçekçi değil
* Teknik erişimler sağlanamıyor
* Müşteri ücretsiz ömür boyu destek bekliyor
* Veri güvenliği veya hukuki risk kabul edilemez seviyede

---

# 3. Teknik Yığın

Aşağıdaki teknolojileri kullan:

* Next.js
* App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts
* Zod
* React Hook Form
* Vitest

İlk sürümde:

* Veritabanı kullanma
* Kullanıcı girişi oluşturma
* Harici API kullanma
* Backend servisi oluşturma
* Supabase kullanma

Tüm kalıcı verileri `localStorage` içinde sakla.

Kod yapısı:

* Modüler
* Tip güvenli
* Yeniden kullanılabilir
* Mobil uyumlu
* Erişilebilir
* Kolay genişletilebilir
* Üretim kalitesine yakın

olmalıdır.

`any` kullanma.

---

# 4. Tasarım Yaklaşımı

Modern, profesyonel ve temiz bir SaaS arayüzü geliştir.

## Görsel Dil

* Açık ve ferah arka plan
* Beyaz veya nötr kartlar
* Hafif gri sınırlar
* Güçlü tipografi
* Geniş boşluk kullanımı
* Sade ikonografi
* Gereksiz gradient kullanmama
* Veri yoğun ekranlarda yüksek okunabilirlik
* Mobil ve masaüstü uyumluluk
* Karanlık mod desteği

## Durum Renkleri

* Yeşil: uygun
* Açık yeşil: güçlü aday
* Sarı: belirsiz
* Turuncu: önemli risk
* Kırmızı: reddet
* Gri: değerlendirilmedi

Renkler tek başına anlam taşımamalıdır. Her durum ayrıca metin ve ikonla gösterilmelidir.

---

# 5. Uygulama Sayfaları

## 5.1 Dashboard

Ana sayfada aşağıdaki metrikleri göster:

* Toplam değerlendirilen müşteri
* Kabul edilen müşteri sayısı
* Şartlı kabul edilen müşteri sayısı
* Reddedilen müşteri sayısı
* Ortalama standart puan
* Ortalama ağırlıklı puan
* Son 30 gündeki değerlendirme sayısı
* En sık görülen kırmızı bayrak
* En zayıf kriter
* En güçlü müşteri segmenti
* Ortalama proje bütçesi
* Kabul edilen projelerin toplam potansiyel değeri

## Dashboard Grafikleri

* Karar dağılımı
* Puan dağılımı
* Son 12 aya göre değerlendirme sayısı
* Aylara göre kabul ve ret oranı
* Kriterlere göre ortalama puan
* En sık görülen kritik riskler
* Müşteri kaynaklarına göre performans
* Sektörlere göre kabul oranı

Dashboard ilk açıldığında örnek veya sahte veri gösterme.

Boş durum ekranında şu mesajı göster:

> İlk müşteri değerlendirmeni oluşturarak hangi projelere evet, hangilerine hayır demen gerektiğini sistematik hale getir.

Ana buton:

**Yeni değerlendirme oluştur**

İkincil buton:

**Örnek değerlendirmeyi yükle**

---

## 5.2 Yeni Müşteri Değerlendirmesi

Form tek bir uzun ekran halinde olmamalıdır.

Adım adım ilerleyen bir değerlendirme sihirbazı oluştur.

Üst bölümde ilerleme göstergesi bulunsun.

## Form Adımları

1. Müşteri bilgileri
2. Ticari uygunluk
3. Operasyonel uygunluk
4. Teknik hazırlık
5. Çalışma ilişkisi
6. Stratejik uyum
7. Genel kontrol
8. Sonuç

Kullanıcı:

* Önceki adıma dönebilmeli
* Taslağı kaydedebilmeli
* Daha sonra devam edebilmeli
* Eksik alanları görebilmeli
* Değerlendirilmemiş kriterleri ayırt edebilmeli

---

# 6. Müşteri Bilgileri

Aşağıdaki alanları ekle:

* Müşteri adı
* Şirket adı
* İletişim kişisi
* E-posta
* Telefon
* Sektör
* Şirket büyüklüğü
* Web sitesi
* Proje adı
* Proje açıklaması
* Talep edilen hizmet
* Tahmini proje bütçesi
* Para birimi
* Tahmini aylık destek bütçesi
* İlk iletişim tarihi
* Talep edilen teslim tarihi
* Potansiyel başlangıç tarihi
* Müşteri kaynağı
* Satış aşaması
* Genel notlar

## Müşteri Kaynağı Seçenekleri

* Referans
* Organik arama
* Sosyal medya
* LinkedIn
* Instagram
* YouTube
* Soğuk e-posta
* Soğuk mesaj
* Reklam
* Mevcut müşteri
* İş ortağı
* Etkinlik
* Topluluk
* Diğer

## Satış Aşaması Seçenekleri

* İlk temas
* Ön görüşme
* Keşif görüşmesi
* Teklif öncesi
* Teklif gönderildi
* Müzakere
* Kazanıldı
* Kaybedildi
* Reddedildi

---

# 7. Değerlendirme Seçenekleri

Her kriter için kullanıcı aşağıdaki durumlardan birini seçebilsin:

* Uygun
* Belirsiz
* Uygun değil
* Değerlendirilmedi

Puan karşılıkları:

* Uygun: 1
* Belirsiz: 0,5
* Uygun değil: 0
* Değerlendirilmedi: puan hesaplamasına dahil edilmez

Her kriter kartında aşağıdaki alanlar yer almalıdır:

* Kriter adı
* Kısa açıklama
* Ana değerlendirme sorusu
* İyi işaretler
* Kırmızı bayraklar
* Puan seçimi
* Not alanı
* Kritik risk işaretleme alanı
* Kanıt veya gözlem alanı
* Takip sorusu alanı

---

# 8. Değerlendirme Kriterleri

Toplam 14 kriter kullan.

---

## 8.1 Problem Şiddeti

### Soru

Müşteri, çözülmesi gereken gerçek, ölçülebilir ve ticari öneme sahip bir problem yaşıyor mu?

### İyi İşaretler

* Gelir kaybı
* Kaçan satış fırsatları
* Yüksek operasyon maliyeti
* Fazla manuel iş
* Personel kapasite problemi
* Ölçülebilir zaman kaybı
* Müşteri memnuniyeti sorunu
* Yüksek hata oranı
* Süreç gecikmeleri
* Yönetim görünürlüğü eksikliği

### Kırmızı Bayraklar

* Yalnızca AI kullanmış görünmek istiyor
* Problem net değil
* Çözümün iş etkisini açıklayamıyor
* Proje sadece “güzel olur” seviyesinde
* Sorun için herhangi bir veri sunamıyor
* Problemin sahibi belli değil

### Ağırlık

2

---

## 8.2 Aciliyet ve Değişim İsteği

### Soru

Müşteri problemi gerçekten çözmek istiyor mu ve gerekli değişiklikleri yapmaya hazır mı?

### İyi İşaretler

* Problem için net son tarih var
* Yönetim desteği mevcut
* Kaynak ayırmaya hazır
* Süreç değişikliğini kabul ediyor
* Ekip iş birliğine açık
* Mevcut sorunun maliyetini biliyor

### Kırmızı Bayraklar

* Sadece araştırma yapıyor
* Karar sürekli erteleniyor
* Değişiklik istemiyor
* Mevcut süreçlere dokunulmasını istemiyor
* Projenin sahibi yok
* İç direnç yüksek

### Ağırlık

1

---

## 8.3 Yatırım Getirisi Potansiyeli

### Soru

Projenin sağlayacağı finansal veya operasyonel fayda ölçülebiliyor mu?

### Ek Alanlar

* Tahmini yıllık ek gelir
* Tahmini yıllık maliyet tasarrufu
* Aylık zaman tasarrufu
* Saatlik operasyon maliyeti
* Tahmini geri ödeme süresi
* Hedeflenen ROI oranı
* Başarı metriği
* ROI notları

### Kırmızı Bayraklar

* Başarı metriği yok
* Finansal etki hesaplanamıyor
* Proje maliyeti potansiyel faydadan yüksek
* Müşteri yalnızca özellik satın alıyor
* Sonuç yerine teknolojiye odaklanıyor

### Ağırlık

2

---

## 8.4 Bütçe Uygunluğu

### Soru

Müşterinin bütçesi minimum çalışma seviyesini karşılıyor mu?

### Varsayılan Eşikler

* Kurulum projesi: 10.000 USD
* Kurulum ve destek: 15.000 USD
* Aylık danışmanlık veya bakım: 3.000 USD

Bu değerler ayarlar bölümünden değiştirilebilmelidir.

### Kırmızı Bayraklar

* En iyi fiyatı soruyor
* Önce küçük başlayalım diyor
* İleride daha fazla iş sözü veriyor
* Teklif öncesi ödeme planı istiyor
* Fiyatı sürekli pazarlık konusu yapıyor
* Beklentisi bütçesinden çok daha yüksek

### Ağırlık

2

---

## 8.5 Karar Vericiye Erişim

### Soru

Bütçeyi onaylayan ve sözleşmeyi imzalayan kişiyle doğrudan iletişim kurulabiliyor mu?

### Seçenekler

* Doğrudan karar verici
* Karar verici toplantılara katılıyor
* Tek onay katmanı var
* Birden fazla onay katmanı var
* Karar süreci belirsiz
* Karar vericiye erişim yok

### Kırmızı Bayraklar

* “Patronuma sormam gerekiyor”
* “Ekibimiz değerlendirecek”
* “Yönetim kuruluna sunacağız”
* Bütçe sahibi bilinmiyor
* Satın alma süreci tanımsız

### Ağırlık

2

---

## 8.6 Kapsam Netliği

### Soru

Müşteri neye ihtiyaç duyduğunu yeterince açık biçimde tanımlayabiliyor mu?

### İyi İşaretler

* Yazılı brief
* Açık çıktılar
* Belirli entegrasyonlar
* Başarı kriterleri
* Bilinen kullanıcı senaryoları
* Tanımlı proje sınırları
* Önceliklendirilmiş gereksinimler

### Kırmızı Bayraklar

* “Bir şeyler otomatikleştirelim”
* “İşimizi inceleyip ne yapacağımızı siz söyleyin”
* “Her şeyi daha iyi yapalım”
* Proje sınırlarının olmaması
* Sürekli yeni fikir eklenmesi
* Nihai karar sahibinin belli olmaması

### Ağırlık

1

---

## 8.7 Zaman Çizelgesi Gerçekçiliği

### Soru

Projenin teslim süresi kapsam ve kalite açısından gerçekçi mi?

### Otomatik Puanlama

* 21 gün veya üzeri: 1
* 14–20 gün: 0,5
* 14 günden kısa: 0
* Tarih belirtilmemiş: değerlendirilmedi
* “Acil”, “hemen” veya “en kısa sürede”: kritik risk önerisi

Talep edilen teslim tarihi ile mevcut tarih arasındaki süreyi otomatik hesapla.

### Kırmızı Bayraklar

* Birkaç gün içinde teslim beklentisi
* Lansman tarihinin çok yakın olması
* Kapsam netleşmeden tarih verilmesi
* Hız için testlerin atlanmasının istenmesi
* Hafta sonu çalışmasının normal kabul edilmesi

### Ağırlık

1

---

## 8.8 Teknoloji Yığını Uyumu

### Soru

Müşteri standart teknoloji yığınını kullanıyor veya geçiş yapmaya istekli mi?

### Varsayılan Teknoloji Yığını

* n8n
* Shopify
* Meta Ads
* Google Ads
* Lovable
* Claude API
* OpenAI API
* HubSpot
* Airtable
* Google Sheets
* Supabase
* WordPress

Bu liste ayarlar bölümünden değiştirilebilmelidir.

### Kırmızı Bayraklar

* Eski özel yazılım
* Dokümantasyonu olmayan CRM
* Kapalı sistem
* Geçişe kapalı müşteri
* Tek projede kullanılacak özel entegrasyon
* Resmî API bulunmaması
* Yalnızca manuel erişim sunulması

### Ağırlık

1

---

## 8.9 Şablon ve Tekrar Kullanılabilirlik Uyumu

### Soru

Talep mevcut bir çözüm şablonuyla en az yüzde 80 oranında örtüşüyor mu?

### Seçenekler

* Mevcut şablona doğrudan uyuyor
* Küçük özelleştirme gerekiyor
* Yeni fakat tekrar kullanılabilir şablon oluşturulabilir
* Büyük özelleştirme gerekiyor
* Tamamen özel ve tek seferlik

### Örnek Şablonlar

* Müşteri raporlama otomasyonu
* E-ticaret performans paneli
* Potansiyel müşteri takip sistemi
* Destek talebi otomasyonu
* Rakip istihbaratı sistemi
* İçerik üretim sistemi
* AI görünürlük denetimi
* Satış takip sistemi
* Müşteri onboarding sistemi
* Sosyal medya raporlama sistemi

### Ağırlık

1

---

## 8.10 Teknik ve Veri Hazırlığı

### Soru

Gerekli hesaplar, erişimler, altyapı ve veriler hazır mı?

### Kontrol Alanları

* Yönetici erişimleri hazır
* API erişimi mevcut
* Veri düzenli
* Süreçler dokümante edilmiş
* Alan adı hazır
* Hosting hazır
* Entegrasyon hesapları aktif
* Veri sahibi belli
* Sistem sahibi belli
* Test ortamı mevcut
* KVKK gereksinimleri belirlenmiş
* Güvenlik gereksinimleri belirlenmiş
* Yedekleme süreci mevcut

### Kırmızı Bayraklar

* Hesaplar proje başladıktan sonra açılacak
* Yönetici erişimi yok
* Veri dağınık
* Veri sahibi belli değil
* Sistem sahibi belli değil
* Ajansın temel BT desteği vermesi bekleniyor
* Veriler yalnızca kişisel cihazlarda tutuluyor

### Ağırlık

1

---

## 8.11 Bakım ve Destek Beklentisi

### Soru

Müşteri kurulum ile devam eden desteğin farklı hizmetler olduğunu kabul ediyor mu?

### İyi İşaretler

* Aylık destek ücretini soruyor
* İzleme ve bakım planı istiyor
* SLA beklentisini açıkça ifade ediyor
* Destek kapsamını sözleşmeyle kabul ediyor
* Değişiklik taleplerinin ayrıca ücretlendirileceğini anlıyor

### Kırmızı Bayraklar

* Sistem sonsuza kadar ücretsiz çalışmalı
* Tüm hatalar ücretsiz düzeltilmeli
* Bakım kurulum fiyatına dahil olmalı
* Ömür boyu destek bekliyor
* Sınırsız revizyon istiyor
* Her yeni ihtiyacı mevcut kapsama dahil görüyor

### Ağırlık

1

---

## 8.12 İletişim ve Çalışma Tarzı

### Soru

Müşterinin iletişim biçimi çalışma düzeniyle uyumlu mu?

### İyi İşaretler

* Yazılı ve açık iletişim
* 24–48 saat içinde yanıt
* Asenkron çalışmaya uygunluk
* Çalışma saatlerine saygı
* Bilgileri düzenli sağlama
* Tek bir iletişim sorumlusu
* Kararları yazılı biçimde onaylama

### Kırmızı Bayraklar

* Gece geç saatte acil yanıt beklentisi
* Sürekli anlık toplantı talebi
* Karmaşık konularda yalnızca sesli mesaj
* Sürekli yönlendirme ihtiyacı
* Aynı konuyu farklı kanallardan yazma
* Toplantı kararlarını sonradan değiştirme
* Agresif veya saygısız iletişim

### Ağırlık

1

---

## 8.13 İç Proje Sahibi

### Soru

Müşteri tarafında projeyi takip edecek, bilgi sağlayacak ve süreci ilerletecek bir iç sorumlu var mı?

### İyi İşaretler

* Proje sahibi belirlenmiş
* Düzenli geri bildirim verecek
* Departmanlar arası koordinasyon sağlayabilecek
* Kararları takip edecek
* Gerekli verilere erişebilecek

### Kırmızı Bayraklar

* Projeyi kimin yöneteceği belli değil
* Her toplantıya farklı kişi geliyor
* Sorumluluk ajansa bırakılıyor
* İç ekip projeye zaman ayırmıyor
* Bilgi sağlama sorumlusu yok

### Ağırlık

1

---

## 8.14 Stratejik Uyum

### Soru

Bu proje, kullanıcının önümüzdeki 12 aylık iş hedeflerine katkı sağlıyor mu?

### Kontrol Soruları

* İdeal müşteri profiline uyuyor mu?
* Güçlü bir vaka çalışması olur mu?
* Tekrar satılabilir mi?
* Ürünleşmiş hizmete dönüşebilir mi?
* Geliştirilmek istenen uzmanlığa katkı sağlar mı?
* Portföyde gösterilmek istenir mi?
* İdeal müşteri yönlendirmeleri getirebilir mi?
* Uzun vadeli konumlandırmayı güçlendirir mi?

### Kırmızı Bayraklar

* Ana uzmanlık alanının dışında
* Tek seferlik ve yeniden kullanılamaz
* Portföyde gösterilmek istenmiyor
* Hedef müşteri profiline uymuyor
* Ekibi yanlış alana yönlendiriyor
* Rastgele gelir dışında stratejik değeri yok

### Ağırlık

1

---

# 9. Puanlama Sistemi

## 9.1 Standart Puan

Her kriter için:

* Uygun: 1
* Belirsiz: 0,5
* Uygun değil: 0
* Değerlendirilmedi: hesaplamaya dahil edilmez

Standart puan, değerlendirilen kriterler üzerinden hesaplanmalı ve 10 üzerinden normalize edilmelidir.

Formül:

```text
Standart puan =
Alınan toplam puan / değerlendirilen kriter sayısı × 10
```

---

## 9.2 Ağırlıklı Puan

Ağırlıklar:

* Problem şiddeti: ×2
* ROI potansiyeli: ×2
* Bütçe uygunluğu: ×2
* Karar vericiye erişim: ×2
* Diğer kriterler: ×1

Ağırlıklı sonuç 100 üzerinden normalize edilmelidir.

Formül:

```text
Ağırlıklı puan =
Alınan ağırlıklı puan / değerlendirilen kriterlerin maksimum ağırlıklı puanı × 100
```

---

## 9.3 Güven Seviyesi

Tüm kriterler değerlendirilmemişse sonuç düşük güven seviyesine sahip olmalıdır.

Güven seviyesi:

* Yüksek: kriterlerin yüzde 90 veya fazlası değerlendirildi
* Orta: kriterlerin yüzde 70–89'u değerlendirildi
* Düşük: kriterlerin yüzde 70'inden azı değerlendirildi

---

# 10. Kritik Eleme Kuralları

Aşağıdaki koşullardan biri gerçekleşirse kritik uyarı oluştur:

* Bütçe minimum eşikten düşük
* Karar vericiye erişim yok
* Problem şiddeti “uygun değil”
* Teslim süresi 14 günden kısa
* Ücretsiz ömür boyu destek beklentisi
* Yönetici veya API erişimi sağlanamıyor
* Veri sahibi belli değil
* Proje hukuki açıdan riskli
* KVKK veya veri güvenliği riski kabul edilemez
* Müşteri saygısız veya tehditkâr iletişim kuruyor
* Projenin açıkça tanımlanmış sahibi yok
* Teknik olarak desteklenmeyen özel sistem kullanılıyor

Kritik kurallar ayarlar ekranından açılıp kapatılabilmelidir.

Her kritik kural için şu alanlar bulunmalıdır:

* Aktif veya pasif
* Açıklama
* Önem seviyesi
* Otomatik ret oluşturup oluşturmadığı
* Kullanıcı tarafından geçersiz kılınıp kılınamayacağı

---

# 11. Karar Seviyeleri

## 90–100: Kesinlikle Evet

* İdeal müşteri
* Teklif aynı gün hazırlanabilir
* Proje önceliklendirilebilir
* Güçlü stratejik ve finansal uyum

## 75–89: Nitelikli Evet

* Güçlü aday
* Zayıf noktalar sözleşme veya kapsamla çözülebilir
* Teklif öncesi koşullar açıkça belirtilmeli

## 55–74: Sarı Bayrak

* Önemli belirsizlikler var
* Ek bilgi veya ikinci görüşme gerekli
* Teklif göndermeden önce riskler çözülmeli

## 35–54: Nazik Ret

* Çok fazla operasyonel veya ticari risk var
* Alternatif sağlayıcı önerilebilir
* Karşı teklif yalnızca temel koşullar değişirse hazırlanmalı

## 0–34: Kesin Ret

* Projeye girilmemeli
* Karşı teklif hazırlanmamalı
* Kısa ve profesyonel ret mesajı gönderilmeli

Kritik eleme varsa karar sonucu ayrıca aşağıdaki durumlardan birine dönüşebilir:

* Koşullu ret
* Yönetici onayı gerekli
* Otomatik ret
* Teknik inceleme gerekli
* Hukuki inceleme gerekli

---

# 12. Sonuç Ekranı

Sonuç ekranında aşağıdaki bölümleri oluştur.

## Genel Karar

* Standart puan
* Ağırlıklı puan
* Karar seviyesi
* Güven seviyesi
* Değerlendirilen kriter sayısı
* Kritik eleme uyarıları
* Önerilen aksiyon

## Güçlü Alanlar

En yüksek puanlanan 3–5 kriteri göster.

Her biri için:

* Kriter adı
* Puan
* Neden güçlü olduğu
* Kullanıcının notu

## Riskler

En düşük puanlanan kriterleri ve kritik kırmızı bayrakları göster.

Her risk için:

* Risk seviyesi
* Kriter
* Açıklama
* Olası etkisi
* Önerilen çözüm

## Kararı Değiştirecek Koşullar

Sistem otomatik öneriler üretmeli.

Örnekler:

* Bütçe minimum seviyeye çıkarılırsa
* Teslim süresi 4 haftaya uzatılırsa
* Karar verici görüşmeye katılırsa
* Bakım paketi kabul edilirse
* Teknik erişimler proje öncesinde sağlanırsa
* Kapsam yazılı biçimde onaylanırsa
* İç proje sahibi atanırsa

Her öneri için tahmini yeni puanı göster.

## Önerilen Sonraki Adım

Örnekler:

* Aynı gün teklif gönder
* Karar vericiyle görüşme planla
* Teknik keşif toplantısı yap
* Bütçeyi yeniden konumlandır
* Teslim süresini müzakere et
* Kapsam belgesi talep et
* Veri erişimlerini doğrula
* Projeyi nazikçe reddet
* Alternatif sağlayıcıya yönlendir

---

# 13. Senaryo Simülatörü

Kullanıcı bazı kriterleri geçici olarak değiştirerek aşağıdaki soruya yanıt bulabilmelidir:

> Bu şart değişirse müşteri kabul edilebilir hale gelir mi?

Simülasyon örnekleri:

* Bütçe yükselirse
* Teslim tarihi uzatılırsa
* Bakım paketi kabul edilirse
* Karar verici görüşmeye katılırsa
* Teknik erişimler sağlanırsa
* Kapsam netleşirse
* İç proje sahibi atanırsa

Mevcut durum ile simüle edilen durumu yan yana göster.

Gösterilecek alanlar:

* Mevcut standart puan
* Yeni standart puan
* Mevcut ağırlıklı puan
* Yeni ağırlıklı puan
* Mevcut karar
* Yeni karar
* Çözülen kritik riskler
* Devam eden kritik riskler

Simülasyon gerçek değerlendirmeyi kullanıcı onaylamadan değiştirmemelidir.

---

# 14. Mesaj Oluşturucu

Sonuca göre hazır mesaj şablonları oluştur.

## Şablon Kategorileri

* Bütçe yetersiz
* Teknoloji yığını uyumsuz
* Teslim süresi gerçekçi değil
* Stratejik uyum yok
* Daha fazla bilgi gerekli
* Kapsam belgesi talebi
* Karar vericiyle görüşme talebi
* Teknik erişim talebi
* Şartlı kabul
* Teklif öncesi koşullar
* Nazik ret
* Kesin ret
* Alternatif sağlayıcıya yönlendirme
* Teklif gönderme
* İkinci keşif görüşmesi

## Mesaj Değişkenleri

* Müşteri adı
* Şirket adı
* İletişim kişisi
* Proje adı
* Minimum bütçe
* Mevcut bütçe
* Talep edilen teslim tarihi
* Önerilen teslim tarihi
* Ajans adı
* Kullanıcı adı
* Hizmet alanı
* Önerilen sonraki adım

Kullanıcı:

* Mesajı düzenleyebilmeli
* Panoya kopyalayabilmeli
* Mesajı sıfırlayabilmeli
* Farklı ton seçebilmeli

Ton seçenekleri:

* Profesyonel
* Samimi
* Doğrudan
* Danışmanlık odaklı

Mesajlar kısa, net, saygılı ve savunmacı olmayan bir dil kullanmalıdır.

---

# 15. Değerlendirme Geçmişi

Tüm değerlendirmeler `localStorage` içinde saklanmalıdır.

Liste görünümünde şu alanları göster:

* Müşteri
* Şirket
* Proje
* Değerlendirme tarihi
* Standart puan
* Ağırlıklı puan
* Karar
* Bütçe
* Sektör
* Müşteri kaynağı
* Satış aşaması
* Kritik risk sayısı

## Liste Özellikleri

* Arama
* Sektöre göre filtreleme
* Karara göre filtreleme
* Tarihe göre filtreleme
* Müşteri kaynağına göre filtreleme
* Satış aşamasına göre filtreleme
* Kritik riske göre filtreleme
* Puana göre sıralama
* Bütçeye göre sıralama
* Tarihe göre sıralama
* Değerlendirmeyi açma
* Düzenleme
* Kopyalama
* Arşivleme
* Silme
* Toplu silme
* JSON dışa aktarma
* JSON içe aktarma
* CSV dışa aktarma

Silme işlemlerinde onay penceresi göster.

---

# 16. Ayarlar

Kullanıcı aşağıdaki alanları değiştirebilmelidir:

* Ajans adı
* Kullanıcı adı
* Varsayılan para birimi
* Minimum proje bütçesi
* Minimum kurulum ve destek bütçesi
* Minimum aylık destek bedeli
* Standart teknoloji yığını
* Kabul puanı
* Kriter ağırlıkları
* Kritik eleme kuralları
* Standart teslim süreleri
* Mesaj imzası
* İdeal müşteri profili
* Stratejik odak alanları
* Tercih edilen iletişim kanalı
* Çalışma saatleri
* Varsayılan destek kapsamı
* Varsayılan karar eşikleri

Ayarlar `localStorage` içinde saklanmalıdır.

Ayarları varsayılan değerlere döndürme seçeneği ekle.

---

# 17. Veri Modeli

Aşağıdaki yapıya yakın TypeScript tipleri oluştur.

```ts
export type QualificationStatus =
  | "qualified"
  | "uncertain"
  | "disqualified"
  | "not_evaluated";

export type DecisionLevel =
  | "hell_yes"
  | "qualified_yes"
  | "yellow_flag"
  | "soft_no"
  | "hard_no";

export type ConfidenceLevel =
  | "high"
  | "medium"
  | "low";

export type RiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface CriterionAnswer {
  criterionId: string;
  status: QualificationStatus;
  score: number | null;
  weight: number;
  notes: string;
  evidence?: string;
  followUpQuestion?: string;
  isCriticalRisk: boolean;
}

export interface CriticalFailure {
  id: string;
  criterionId?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  blocksApproval: boolean;
}

export interface ClientEvaluation {
  id: string;
  clientName: string;
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  projectName: string;
  projectDescription?: string;
  requestedService?: string;
  estimatedBudget?: number;
  monthlyRetainer?: number;
  currency: string;
  requestedDeliveryDate?: string;
  potentialStartDate?: string;
  inquiryDate: string;
  leadSource?: string;
  salesStage?: string;
  generalNotes?: string;
  answers: CriterionAnswer[];
  standardScore: number;
  weightedScore: number;
  confidenceLevel: ConfidenceLevel;
  decision: DecisionLevel;
  criticalFailures: CriticalFailure[];
  recommendedNextAction?: string;
  isDraft: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Ayrıca aşağıdaki yapılar için gerekli tipleri oluştur:

* CriterionDefinition
* AgencySettings
* ScoringResult
* SimulationResult
* MessageTemplate
* DashboardMetrics
* ImportResult
* ExportFormat
* CriticalRule
* DecisionThreshold

---

# 18. Puanlama Motoru

Puanlama mantığını React bileşenlerinden tamamen ayır.

`lib/scoring.ts` içinde saf fonksiyonlar kullan.

Aşağıdaki fonksiyonlara benzer yapılar oluştur:

```ts
calculateStandardScore()
calculateWeightedScore()
calculateConfidenceLevel()
detectCriticalFailures()
calculateDecisionLevel()
calculateEvaluationResult()
simulateEvaluationChanges()
getStrongestCriteria()
getWeakestCriteria()
generateImprovementConditions()
```

Kurallar:

* Fonksiyonlar dış duruma bağlı olmamalı
* `localStorage` erişimi yapmamalı
* React kullanmamalı
* Aynı veri için her zaman aynı sonucu üretmeli
* Birim testlerle doğrulanmalı
* Eksik veri durumlarını güvenli biçimde yönetmeli

---

# 19. LocalStorage Servisi

Tüm `localStorage` işlemlerini tek bir servis üzerinden yönet.

Önerilen dosya:

```text
lib/storage.ts
```

Fonksiyonlar:

```ts
getEvaluations()
getEvaluationById()
saveEvaluation()
updateEvaluation()
deleteEvaluation()
archiveEvaluation()
duplicateEvaluation()
getSettings()
saveSettings()
resetSettings()
exportData()
importData()
```

Kurallar:

* JSON ayrıştırma hatalarını yakala
* Zod ile veri doğrula
* Bozuk veriyi uygulamaya yükleme
* Veri bulunamadığında güvenli varsayılan kullan
* Tarayıcı dışında çalıştırıldığında hata üretme
* Sürüm numarası kullan
* Gelecekte veri taşıma işlemlerine uygun yapı kur

---

# 20. Dışa ve İçe Aktarma

## JSON Dışa Aktarma

Aşağıdaki verileri içersin:

* Uygulama sürümü
* Dışa aktarma tarihi
* Ayarlar
* Değerlendirmeler

## JSON İçe Aktarma

* Zod doğrulaması yap
* Hatalı JSON için açıklayıcı hata ver
* Eski veri sürümlerini kontrol et
* Mevcut verinin üzerine yazma veya birleştirme seçenekleri sun
* Kopya kayıtları tespit et

## CSV Dışa Aktarma

Her değerlendirme için tek satır oluştur.

Sütunlar:

* Müşteri adı
* Şirket
* Proje
* Sektör
* Bütçe
* Para birimi
* Standart puan
* Ağırlıklı puan
* Karar
* Güven seviyesi
* Kritik risk sayısı
* Müşteri kaynağı
* Satış aşaması
* Değerlendirme tarihi

---

# 21. Örnek Başlangıç Verisi

Uygulama ilk açıldığında gerçek değerlendirme oluşturma.

Ancak kullanıcı isterse örnek değerlendirme yükleyebilsin.

## Örnek Değerlendirme

* Müşteri: Nova Commerce
* Şirket: Nova Commerce Ltd.
* Proje: Shopify Raporlama Otomasyonu
* Bütçe: 12.000 USD
* Süre: 4 hafta
* Standart teknoloji yığınına uygun
* Karar verici toplantıda
* Problem ölçülebilir
* ROI güçlü
* Teknik erişimlerin bir kısmı eksik
* Aylık bakım paketine açık
* İletişim düzenli
* Sonuç: Nitelikli Evet

---

# 22. Dosya Yapısı

Aşağıdaki yapıya yakın bir mimari kullan:

```text
app/
  layout.tsx
  page.tsx

  evaluations/
    page.tsx

    new/
      page.tsx

    [id]/
      page.tsx

      edit/
        page.tsx

  settings/
    page.tsx

components/
  dashboard/
    dashboard-metrics.tsx
    decision-chart.tsx
    score-distribution-chart.tsx
    criterion-performance-chart.tsx
    recent-evaluations.tsx
    empty-dashboard.tsx

  evaluation/
    evaluation-wizard.tsx
    client-information-step.tsx
    criterion-step.tsx
    review-step.tsx
    result-summary.tsx
    risk-list.tsx
    strengths-list.tsx
    improvement-conditions.tsx
    scenario-simulator.tsx

  scoring/
    score-card.tsx
    weighted-score.tsx
    confidence-badge.tsx
    decision-badge.tsx
    critical-warning.tsx

  messages/
    message-generator.tsx
    message-template-selector.tsx
    message-editor.tsx

  history/
    evaluation-table.tsx
    evaluation-filters.tsx
    evaluation-actions.tsx

  settings/
    agency-settings-form.tsx
    scoring-settings-form.tsx
    technology-stack-form.tsx
    critical-rules-form.tsx

  shared/
    app-header.tsx
    app-sidebar.tsx
    page-header.tsx
    empty-state.tsx
    confirm-dialog.tsx
    loading-state.tsx
    error-state.tsx

lib/
  scoring.ts
  criteria.ts
  storage.ts
  templates.ts
  validation.ts
  export.ts
  import.ts
  dates.ts
  currency.ts
  constants.ts
  utils.ts

types/
  evaluation.ts
  settings.ts
  scoring.ts
  templates.ts

tests/
  scoring.test.ts
  storage.test.ts
  import.test.ts
  dates.test.ts
```

Gerekirse yapıyı geliştir ancak gereksiz karmaşıklık oluşturma.

---

# 23. Form Doğrulama

Zod ile doğrulama yap.

## Zorunlu Alanlar

* Müşteri adı
* Proje adı
* Para birimi
* İlk iletişim tarihi

## Kurallar

* Bütçe negatif olamaz
* Aylık destek bedeli negatif olamaz
* Teslim tarihi geçmişte olamaz
* E-posta alanı geçerli formatta olmalı
* Web sitesi geçerli URL olmalı
* Puan yalnızca tanımlı değerlerden biri olmalı
* Ağırlık sıfırdan büyük olmalı

Hata mesajları anlaşılır ve kullanıcı odaklı olmalıdır.

---

# 24. Erişilebilirlik

Aşağıdaki erişilebilirlik kurallarına dikkat et:

* Tüm form alanlarında etiket kullan
* Klavye navigasyonu destekle
* Odak göstergelerini kaldırma
* Renk dışında metin ve ikon kullan
* Diyaloglarda odak yönetimi sağla
* Butonlara açıklayıcı isim ver
* Tablo başlıklarını doğru kullan
* Ekran okuyucu dostu hata mesajları oluştur
* Grafiklerin metin özetlerini göster

---

# 25. Mobil Kullanım

Mobil tasarımı ayrıca ele al.

Mobilde:

* Sihirbaz tek sütun çalışmalı
* Alt sabit navigasyon kullanılabilir
* Büyük tablolar kart görünümüne dönüşmeli
* Grafikler yatay taşmamalı
* Butonlar dokunmaya uygun boyutta olmalı
* Sonuç ekranında temel karar en üstte gösterilmeli
* Uzun açıklamalar açılır kapanır olmalı

---

# 26. Testler

Vitest kullan.

Aşağıdaki testleri yaz:

* Standart puan hesaplama
* Ağırlıklı puan hesaplama
* Değerlendirilmemiş kriterlerin hesaba katılmaması
* Güven seviyesi hesaplama
* Kritik eleme tespiti
* Karar seviyesi hesaplama
* Kritik elemenin yüksek puanı geçersiz kılması
* Tarih farkı hesaplama
* 14 günden kısa süre kuralı
* localStorage veri doğrulaması
* Bozuk JSON yönetimi
* JSON içe aktarma
* Kopya kayıt tespiti
* Senaryo simülasyonu
* Ayar değişikliğinin puanlamaya etkisi

---

# 27. Kodlama Kuralları

* `any` kullanma.
* Tüm TypeScript hatalarını çöz.
* Tek bir dev bileşen oluşturma.
* İş mantığını React bileşenlerinden ayır.
* Puanlama fonksiyonlarını saf fonksiyon olarak yaz.
* `localStorage` işlemlerini tek servis üzerinden yönet.
* Tarayıcı API’lerini yalnızca client component içinde kullan.
* Formlarda Zod doğrulaması uygula.
* Tarih ve para formatlamasını yardımcı fonksiyonlarda yönet.
* Silme işlemlerinde onay penceresi göster.
* Hatalı JSON içe aktarmada açıklayıcı hata mesajı ver.
* Boş durum, yüklenme ve hata durumlarını tasarla.
* Mobil görünümü ayrıca test et.
* Temsili veya sahte kod bırakma.
* “Buraya kod ekleyin” gibi yer tutucular kullanma.
* Gereksiz bağımlılık ekleme.
* Tekrarlanan kodu yardımcı fonksiyonlara taşı.
* Bileşenleri mümkün olduğunca küçük tut.
* Sunucu ve istemci bileşenlerini doğru ayır.
* Sonsuz render döngülerine karşı dikkatli ol.
* `localStorage` hydration hatalarını önle.

---

# 28. Geliştirme Sırası

Projeyi aşağıdaki sırayla geliştir:

1. Proje kurulumu
2. TypeScript tipleri
3. Kriter tanımları
4. Ayar modeli
5. Puanlama motoru
6. Kritik eleme motoru
7. Birim testler
8. LocalStorage servisi
9. Yeni değerlendirme formu
10. Sonuç ekranı
11. Değerlendirme geçmişi
12. Dashboard
13. Senaryo simülatörü
14. Mesaj oluşturucu
15. Ayarlar
16. JSON ve CSV dışa aktarma
17. JSON içe aktarma
18. Mobil iyileştirmeler
19. Erişilebilirlik kontrolleri
20. Son test ve hata düzeltmeleri

---

# 29. MVP Kapsamı

İlk çalışan sürümde mutlaka aşağıdakiler bulunmalıdır:

* Yeni müşteri değerlendirmesi oluşturma
* 14 kriteri puanlama
* Standart puan hesaplama
* Ağırlıklı puan hesaplama
* Kritik risk tespiti
* Karar üretme
* Sonuç ekranı
* LocalStorage kaydı
* Değerlendirme geçmişi
* Değerlendirme düzenleme
* Değerlendirme silme
* Temel ayarlar
* Temel testler

Dashboard grafikleri, gelişmiş mesaj oluşturucu ve senaryo simülatörü ikinci aşamada tamamlanabilir.

Ancak her aşama sonunda uygulama çalışır durumda olmalıdır.

---

# 30. Beklenen Teslim Şekli

Önce kısa bir mimari ve geliştirme planı yaz.

Ardından projeyi dosya dosya oluştur.

Her dosya için:

1. Dosya yolunu belirt.
2. Dosyanın tam kodunu ver.
3. Eksik veya temsili kod bırakma.
4. Yer tutucu kullanma.
5. Dosyanın hangi amaçla kullanıldığını bir cümleyle açıkla.

Projeyi tek yanıta sığdırmak mümkün değilse aşamalara böl.

Ancak:

* Her aşama çalışır olmalı
* Bir önceki aşamadaki dosyalar korunmalı
* Aynı dosyanın tamamını gereksiz yere tekrar verme
* Değişen dosyalar için tam güncel kodu sun
* Her aşamanın sonunda test ve çalıştırma komutlarını belirt

---

# 31. Kurulum Komutları

Aşağıdaki bilgileri ayrıca ver:

* Proje oluşturma komutu
* Gerekli paketler
* shadcn/ui kurulum komutları
* Geliştirme sunucusunu başlatma
* Üretim derlemesi
* TypeScript kontrolü
* Lint kontrolü
* Test çalıştırma
* Test kapsamı oluşturma

---

# 32. Tamamlanma Kriterleri

Proje aşağıdaki koşullar sağlandığında tamamlanmış kabul edilir:

* TypeScript hatası yok
* Lint hatası yok
* Üretim derlemesi başarılı
* Temel testler başarılı
* Değerlendirme kaydedilebiliyor
* Sayfa yenilendiğinde veri kaybolmuyor
* Puanlar doğru hesaplanıyor
* Kritik riskler doğru belirleniyor
* Karar seviyeleri doğru çalışıyor
* Değerlendirmeler düzenlenebiliyor
* Değerlendirmeler silinebiliyor
* Ayarlar saklanıyor
* Mobil görünüm kullanılabilir
* Boş ve hata durumları mevcut
* JSON dışa aktarma çalışıyor
* Bozuk JSON içe aktarma uygulamayı bozmuyor

---

# 33. Son Talimat

Önce çalışan ve sade bir MVP oluştur.

Görsel karmaşıklık yerine:

* Doğru veri modeli
* Güvenilir puanlama
* Sağlam localStorage yönetimi
* Temiz kullanıcı akışı
* Tip güvenliği
* Test edilebilir mimari

öncelikli olmalıdır.

Uygulama yalnızca bir müşteri puanlama aracı değil, kullanıcının hangi projelere evet veya hayır diyeceğini sistematik hale getiren bir karar işletim sistemi gibi çalışmalıdır.

Şimdi önce mimari planı çıkar, ardından çalışan MVP’yi dosya dosya kodlamaya başla.
