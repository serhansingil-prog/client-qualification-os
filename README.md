# Client Qualification OS

Ajanslar ve danışmanlar için potansiyel müşterileri 14 sabit kriter üzerinden puanlayıp
beş karar seviyesinden birini (Kesinlikle Evet / Nitelikli Evet / Ek Bilgi Gerekli /
Nazik Ret / Kesin Ret) öneren bir müşteri niteleme aracı. Amaç, hangi projelerin kabul
edilmeye değer olduğunu erken ve sistematik biçimde ayırt etmek. Detaylı kullanım için
uygulama içindeki [Kullanım Kılavuzu](/guide) sayfasına bakın.

**Canlı:** https://client-qualification-os.vercel.app

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
