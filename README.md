# Client Qualification OS

Ajanslar ve danışmanlar için potansiyel müşterileri 14 sabit kriter üzerinden puanlayıp
beş karar seviyesinden birini (Kesinlikle Evet / Nitelikli Evet / Ek Bilgi Gerekli /
Nazik Ret / Kesin Ret) öneren bir değerlendirme aracı. Detaylı kullanım için uygulama
içindeki [Kullanım Kılavuzu](/guide) sayfasına bakın.

**Canlı:** https://client-qualification-os.vercel.app

## Geliştirme

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini açın (port doluysa Next.js
otomatik olarak bir sonraki boş porta geçer).

## Teknolojiler

Next.js (App Router, Turbopack) · TypeScript · Tailwind CSS · shadcn/ui (Base UI) ·
Zod · React Hook Form · Recharts · Vitest

Veriler şu an yalnızca tarayıcının localStorage'ında tutulur; backend/veritabanı yok.

## Test ve build

```bash
npx vitest run     # birim testleri
npx eslint .        # lint
npx tsc --noEmit    # tip kontrolü
npx next build      # production build
```

## Deploy

`master` branch'i GitHub üzerinden Vercel'e bağlı; her push otomatik olarak production'a
deploy olur.
