# UNLUPA — Eksekusi Visual Hari Ini
Tempel file ini ke AI agent. Mode: ANALISIS SINGKAT lalu EKSEKUSI.
Jangan tanya plan baru. Jangan perluas scope.

## STATUS TERKINI (percepatan handoff — baca juga UNLUPA_UI_PROGRESS.md)
- **G0, G1, G2, G3, G4 SELESAI.** Grep final seluruh `src/**/*.tsx` → 0 hits forbidden; build & tsc PASS (CSS 182.76 kB, JS 1196.88 kB).
- **Batch 4 temuan visual SELESAI diedit** (ThemeToggle hapus opsi System; arrow slider zoom 100%; slide "Daily Review Otomatis"; slide "Lupa Bukan Takdir") — MENUNGGU verifikasi browser.
- **BELUM: verifikasi visual user, backend dinyalakan + login + bug hunt, checkpoint commit G0–G4, G5 (commit terpisah), Tahap B.**
- Larangan mutlak tetap aktif: jangan ubah business logic/API/auth/router/FSRS; jangan ganti copy Indonesia; jangan commit tanpa perintah user.

## Misi
Ganti seluruh lapisan visual (warna, surface, border, shadow, typography class) agar:

- dewasa, profesional, clean, elegan
- light DAN dark sama-sama bagus
- TIDAK terlihat situs judi (emas mengkilap + merah + glow + nebula)
- TIDAK terlihat buatan AI (rainbow card, glass blur, cosmic, gradient mesh, 4 warna aksen)
- tetap UNLUPA, bukan clone Linear/Raycast

Referensi prinsip SAJA dari `docs/design/references/linear.md` dan `docs/design/references/raycast.md`:
restraint, 1 aksen, hairline border, surface ladder, whitespace, tracking negatif di display, tanpa shadow neon.
JANGAN menyalin warna lavender Linear `#5e6ad2`. JANGAN menyalin white-pill Raycast sebagai identitas.

## Larangan mutlak
- Jangan ubah business logic, API, DB, auth payload, authorization, router, FSRS, classroom/personal domain.
- Jangan rewrite struktur section landing yang sudah bagus.
- Jangan ganti copy Indonesia.
- Jangan buat plan sepanjang master plan lagi.
- Jangan kerjakan feature pages dalam-dalam (alquran/classroom/personal detail) kecuali hardcoded `text-white` / `bg-[#...]` yang bikin light mode pecah.
- Setelah setiap gelombang, BERHENTI untuk verifikasi browser jika layout pecah.

## Identitas yang dikunci (jangan dinego)
- Primary / CTA: teal muted yang SUDAH ada — `oklch(0.55 0.15 175)`
- Emas: HANYA 1 momen hero per halaman, matte, tanpa glow. Bukan warna tombol.
- Merah: HANYA destructive / momen “lupa”. Bukan CTA.
- Wordmark: Cinzel tracking-widest
- Headline editorial: Playfair Display
- Body/UI: Inter + `font-feature-settings: "ss03" "kern" "liga" "calt"`
- Angka/harga/phase: JetBrains Mono

## Token wajib (satu sistem, dua tema)

Light (`:root`)
- `--background`: oklch(0.99 0.005 95) off-white hangat, bukan #fff silau
- `--foreground`: oklch(0.17 0.02 250)
- `--card`: oklch(1 0.004 95)
- `--surface-1/2/3`: tangga 0.99 → 0.97 → 0.94
- `--border`: oklch(0.90 0.01 95)
- `--muted-foreground`: oklch(0.45 0.02 250)
- `--primary`: oklch(0.45 0.12 175) (sedikit lebih dalam di light agar kontras)
- `--primary-foreground`: white

Dark (`.dark`)
- `--background`: oklch(0.15 0.015 250) navy datar. BUKAN #000. BUKAN nebula.
- `--foreground`: oklch(0.96 0.01 95)
- `--card`: oklch(0.19 0.015 250)
- `--surface-1/2/3`: 0.19 → 0.22 → 0.25
- `--border`: oklch(0.28 0.015 250)
- `--muted-foreground`: oklch(0.65 0.02 250)
- `--primary`: oklch(0.72 0.12 175) (lebih terang di dark agar kebaca)
- `--primary-foreground`: oklch(0.15 0.02 250)

Semantic hanya untuk status: success / warning / destructive / info.
JANGAN pakai semantic sebagai warna kartu pricing/feature.

Hapus / larang di UI:
`bg-deep-universe`, `stars-overlay`, `text-white`, `bg-white`, `text-slate-*`, `text-gray-*`,
`#7C3AED`, `#FBBF24`, `#f59e0b`, `#34d399`, `#60a5fa`, `#c084fc`,
`bg-white/5`, `border-white/5`, `backdrop-blur-xl`, `shadow-[0_0_40px`, radial nebula,
`bg-${color}`, `rounded-[2rem]`, glass-panel sebagai look final.

Radius: button/input `rounded-md` (8px), card `rounded-xl` (12px), screenshot/panel `rounded-2xl` (16px).
Pill 9999 hanya badge/tab kecil.
Shadow: `shadow-sm` card, `shadow-xl` modal. Nol glow.

## Bug yang HARUS beres dulu (sebelum ganti section lain)
Landing localhost saat ini RUSAK. Perbaiki ini di gelombang 0:

1. Heading menampilkan literal `<br />` — render sebagai line break, bukan string.
2. Paragraf hero pecah satu kata per baris — perbaiki width/flex/min-width. Teks harus wrap normal.
3. Kartu kanan saling numpuk — stack kebaca, tidak overlap.
4. Root:
   - `LandingLayout.tsx` jangan `bg-white text-slate-800`
   - `LandingPage.tsx` jangan `bg-deep-universe text-white`
   - keduanya: `bg-background text-foreground`
5. Load font di `index.css` + `index.html` (Inter, Playfair Display, Cinzel, JetBrains Mono).
6. `tailwind.config.ts` legacy purple/amber: sync ke `var(--primary)` / hapus override yang bentrok dengan `@theme` teal.

Kalau gelombang 0 belum kebaca di light DAN dark, JANGAN lanjut.

## Gelombang eksekusi (satu hari, berurutan)

### G0 — Unblock theme (wajib pertama)
File: `src/layouts/LandingLayout.tsx`, `src/pages/LandingPage/LandingPage.tsx`,
`src/index.css` (fonts + hapus radial `.bg-deep-universe`), `src/index.html`, `tailwind.config.ts`,
Hero heading/layout pecah.
Selesai jika: toggle light/dark, semua teks landing kebaca, tidak ada `<br />` mentah, tidak ada kolom 1-kata.

### G1 — Landing sisa yang masih rainbow/glass
Urutan file:
1. `PriceSection.tsx` + hapus pemakaian `ShardCard` jika orphan
   - semua tier: `bg-card border-border`
   - SATU featured: `border-primary` atau `bg-primary/5`
   - icon semua `bg-primary/10 text-primary`
   - harga `font-mono text-foreground`
2. `FAQSection.tsx` — `bg-card border-border`, `text-foreground` / `text-muted-foreground`, aksen `text-primary` bukan amber, font-cinzel di item → `font-mono` / `font-serif`
3. `TestimonialSection.tsx` — kartu `bg-card border shadow-sm`, avatar `bg-muted`, tanpa marquee neon / grid pattern / blur 20px
4. `HeroSection.tsx` — ganti `bg-${item.color}/10` ke map literal atau semua `bg-primary/10`; hapus nav fixed duplikat jika sudah ada `LandingNavbar`
5. Navbar shadow hardcoded → `shadow-sm`

JANGAN sentuh Solution / Feature / Metodologi / Inklusivitas / CTA kecuali class hardcoded non-token.

### G2 — Auth
Pertahankan layout editorial Login/Register.
Ganti: cosmic-loader → `Loader2 text-primary`; `btn-submit` → `<Button>`; input raw → `components/ui/Input` tanpa ubah name/onChange; `h-1px` → `h-px`.

### G3 — Dashboard shell
- `DashboardLayout.tsx`: `bg-deep-universe` → `bg-background`
- `ComingSoonRoomPage.tsx`: tulis ulang PRESENTASI ke `bg-card border-border text-foreground`, icon `bg-primary/10`, tanpa glass/glow/gradient text
- `DashboardTable*` + `LogoutConfirmModal`: `bg-card border-border text-foreground divide-border`, overlay `bg-background/80`
- Sidebar overlay `rgba(0,0,0,0.5)` → token
- Teacher tones: static map semantic (`bg-info/10` dll), bukan `bg-${tone}`

### G4 — Sweep sisa hardcoded (cepat, jangan redesign)
Grep lalu ganti class saja:
`text-white`, `bg-white/5`, `border-white/5`, `bg-[#`, `text-amber-`, `text-emerald-`, `text-purple-`, `glass-panel` yang masih di `src/`.
Halaman alquran/ayat: tetap `font-serif` untuk ayat, hanya token warna yang diganti.

### G5 — Bersihkan CSS legacy SETELAH grep 0
Hapus bertahap di `src/index.css` hanya class yang sudah tidak terpakai:
`.monolith-card`, `.energy-card`, `.shard-card`, `.glass-panel`, `.log-card`, `.faq-item`, `.cosmic-loader`, `.shimmer-text`, `.bg-deep-universe` radial.
Jangan hapus sebelum `grep -r` di `src/` kosong.

## Definition of done (hari ini)
- Light: latar off-white, teks navy, CTA teal, kontras kebaca
- Dark: navy datar, teks off-white, CTA teal, NOL glow/nebula/bintang
- System theme ikut OS + persist localStorage yang sudah ada
- Tidak ada rainbow di Price
- Tidak ada glass di FAQ/Testimonial/ComingSoon
- Login → dashboard masih jalan
- `npm run build` lolos (tidak ada class dinamis `bg-${color}`)

## Format laporan agent (wajib singkat)
Setelah tiap gelombang tulis:
- file diubah
- grep sisa berbahaya (jumlah hit)
- apa yang BELUM disentuh
- minta user cek localhost light/dark

Jangan klaim “seluruh web selesai” sebelum G0–G3 lolos cek browser.
