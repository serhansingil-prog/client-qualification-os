export interface ChangelogEntry {
  date: string;
  type: "major" | "minor";
  title: string;
  description: string;
}

// Newest first. Updated by hand after each notable change — not derived
// from git history automatically, so entries are written for a reader,
// not copy-pasted commit messages.
export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: "2026-07-15",
    type: "minor",
    title: "Değişiklik Günlüğü sayfası eklendi",
    description:
      "Admin'e özel, yapılan geliştirmeleri major/minor etiketiyle listeleyen, 5'erli sayfalanan bu sayfa eklendi.",
  },
  {
    date: "2026-07-15",
    type: "major",
    title: "Toplu arşivleme ve admin işlem logu",
    description:
      "Kullanıcı Onayları tablosuna toplu seçim ve arşivleme eklendi — arşivlenen hesaplar silinmiyor, sadece listeden gizleniyor. Admin'in onayla/reddet/arşivle işlemleri artık ayrı bir günlükte (Son İşlemler) kaydediliyor.",
  },
  {
    date: "2026-07-15",
    type: "minor",
    title: "Kayıt tarihine saat eklendi",
    description: "Kullanıcı Onayları tablosunda kayıt tarihinin yanına işlem saati de gösteriliyor.",
  },
  {
    date: "2026-07-15",
    type: "minor",
    title: "Kullanım Kılavuzu'nda tam ekran görsel önizleme",
    description:
      "Adım adım kullanım kartlarındaki ekran görüntüleri artık küçük önizleme olarak gösteriliyor; tıklanınca tam ekran büyütülmüş halde açılıyor.",
  },
  {
    date: "2026-07-15",
    type: "major",
    title: "Tema 4 renk sistemi",
    description:
      "Uygulama Platinum/Linen/Jet Black nötrleri ve Teal birincil vurgu rengiyle yeniden temalandırıldı. Karar rozetleri ve kritik kural şiddetleri için marka renklerinden tamamen bağımsız, ayrı bir semantik palet tanımlandı.",
  },
  {
    date: "2026-07-15",
    type: "minor",
    title: "Kullanıcı Onayları tablosuna sayfalama",
    description: "Admin onay listesi artık 10'ar kayıt halinde sayfalanıyor.",
  },
  {
    date: "2026-07-15",
    type: "major",
    title: "Admin onaylı kayıt sistemi",
    description:
      "Yeni kayıt olan kullanıcılar admin onaylayana kadar uygulamayı kullanamıyor. Onay bekleyenler /pending ekranına yönlendiriliyor; admin /admin ekranından kayıtları onaylayıp reddedebiliyor.",
  },
  {
    date: "2026-07-15",
    type: "major",
    title: "Supabase ile çok kullanıcılı hesap sistemi",
    description:
      "E-posta/şifre girişi eklendi; değerlendirmeler ve ajans ayarları localStorage'dan Supabase Postgres'e taşındı, Row Level Security ile her kullanıcının verisi kendine kilitlendi. Demo modu tamamen yerel kalmaya devam ediyor.",
  },
  {
    date: "2026-07-15",
    type: "major",
    title: "İlk sürüm: Client Qualification OS",
    description:
      "14 kriterli puanlama sihirbazı, panel, değerlendirme geçmişi, mesaj oluşturucu, senaryo simülatörü ve ayarlar ekranlarıyla ilk sürüm yayınlandı.",
  },
];
