# Client Qualification OS

## English summary

**Client Qualification OS** helps agencies and consultants decide which prospects are
worth taking on. It scores each prospect against 14 fixed criteria and recommends one of
five decisions: Hell Yes, Qualified Yes, More Info Needed, Soft No, or Hard No.

**Live demo:** https://client-qualification-os.vercel.app (sign-up requires email
confirmation and admin approval; Demo Mode shows sample data without touching real data).

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (Auth +
Postgres with row-level security), Zod, Recharts, Vitest, deployed on Vercel.

**Highlights**
- Every user only sees their own evaluations (RLS on all tables); new accounts are
  approved by an admin before they can use the app.
- Role-based permissions (admin / moderator / user) with a permission matrix.
- Sector-based demo data (automation, ads, real estate).
- Optional AI insights and voice summaries using the user's own Anthropic API key, kept
  only in the browser.

**How it was built:** with Claude Code. Claude wrote most of the code; I made the product
decisions, tested, deployed and debugged it. This is a pilot for small businesses and has
no live customers yet.

---

## Türkçe

Ajanslar ve danışmanlar için potansiyel müşterileri 14 sabit kriter üzerinden puanlayıp
beş karar seviyesinden birini (Kesinlikle Evet / Nitelikli Evet / Ek Bilgi Gerekli /
Nazik Ret / Kesin Ret) öneren bir müşteri niteleme aracı. Amaç, hangi projelerin kabul
edilmeye değer olduğunu erken ve sistematik biçimde ayırt etmek. Detaylı kullanım için
uygulama içindeki [Kullanım Kılavuzu](/guide) sayfasına bakın.

**Canlı:** https://client-qualification-os.vercel.app

## Pilot bağlamı

Bu proje, küçük ve orta ölçekli işletmeler (KOBİ) için geliştirdiğim bir pilot sistemin
(Serhan Business OS, Temmuz 2026) parçasıdır. Hedef, küçük bir işletmenin "bu müşteriyi
alalım mı?" kararını sezgiyle değil, yazılı ve tekrarlanabilir ölçütlerle vermesi.
Henüz canlı müşteri yok; uygulama demo modu ve örnek verilerle denenebilir. Örnek
verilerdeki kişi ve firmalar uydurmadır.

## Nasıl geliştirildi

Bu proje [Claude Code](https://claude.com/claude-code) ile birlikte geliştirildi; kodun
büyük kısmını Claude yazdı. Ürün kararlarını (ne ölçüleceği, puanlama kuralları, hangi
özelliklerin gerektiği), test, dağıtım ve hata ayıklama sürecini ben yürüttüm. Commit
geçmişindeki `Co-Authored-By` satırları bunu açıkça gösterir.

## Öne çıkanlar

- 14 sabit kriter, 5 karar seviyesi; puanlama mantığı birim testlerle korunur
- Supabase Auth + Postgres, satır düzeyinde güvenlik (RLS): her kullanıcı yalnız kendi
  değerlendirmelerini görür; yeni kayıtlar admin onayından geçer
- Demo Modu: gerçek veriden tamamen ayrı, tarayıcıda (localStorage) çalışan sandbox
- Vercel'e sürekli dağıtım (`master` push'u production'a gider)

## Teknolojiler

Next.js (App Router, Turbopack) · TypeScript · Tailwind CSS · shadcn/ui (Base UI) ·
Supabase (Auth + Postgres) · Zod · React Hook Form · Recharts · Vitest

## Veri ve Kimlik Doğrulama

Kullanıcılar Supabase Auth ile giriş yapar; her kullanıcının değerlendirmeleri Supabase
üzerinde, satır düzeyinde güvenlik (RLS) ile kendi hesabına özel olarak saklanır. Yeni
kayıtlar admin onayından geçer. **Demo Modu**, gerçek verilerden tamamen ayrı, yalnızca
tarayıcının localStorage'ında yaşayan bir örnek-veri sandbox'ıdır; Supabase'e hiç
dokunmaz ve uygulamayı veri girmeden keşfetmek için kullanılır.

## Geliştirme

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini açın (port doluysa Next.js
otomatik olarak bir sonraki boş porta geçer).

### Ortam değişkenleri

Kök dizinde bir `.env.local` dosyası oluşturup aşağıdaki değişkenleri kendi Supabase
projenizin değerleriyle doldurun (gerçek değerler bu depoda tutulmaz):

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADMIN_EMAIL=
```

## Test ve build

```bash
npm run lint        # lint
npm run typecheck   # tip kontrolü
npm run test        # birim testleri
npm run build       # production build
```

## Deploy

`master` branch'i GitHub üzerinden Vercel'e bağlı; her push otomatik olarak production'a
deploy olur.
