# UNLUPA UI Progress & Recovery Documentation

## Project Context
- **Goal:** Redesign visual UI/UX UNLUPA secara nyata dengan standar kualitas inspirasi **Linear** dan **Raycast**.
- **Karakter Visual Target:** Modern, premium, clean, minimal, sangat rapi, strong visual hierarchy, intentional spacing, subtle borders, subtle elevation, smooth interaction, fully theme-aware (Light/Dark/System).
- **Pendekatan:** Preservasi penuh business logic, backend/API integration, authentication flow, dan routing. Tidak ada penghapusan fitur atau logic secara acak.

## Current Progress Status

### Completed Work (Verified via Repo Audit)
1. **Golden Rules Document:** `UNLUPA_GOLDEN_RULES.md` telah dibuat dan aktif sebagai acuan utama perbaikan UI/UX.
2. **Theme System Foundation:**
   - `ThemeProvider.tsx` mendukung `light`, `dark`, dan `system` theme persistence (`theme.store.ts`).
   - Global design tokens OKLCH di `src/index.css` (semantic colors, typography, surface, radius, transition tokens).
   - Global Theme Toggle disiapkan di UI.
3. **Landing Page Layout & Hero Section:**
   - `LandingLayout.tsx` dan `HeroSection.tsx` sudah dikerjakan dengan design tokens, responsive layout, dan slide preview.
   - **Hero Section TIDAK Boleh Redesign Ulang** kecuali menemukan bug visual fatal.
4. **Auth Flow Fixes (Presentation Layer Only):**
   - `LoginForm.tsx`, `RegisterForm.tsx`, `ForgotPasswordForm.tsx` sudah memakai `bg-card`, `text-foreground`, `border-input`, `bg-background`, serta warna semantic `primary`/`destructive`.
   - Form inputs dan submit buttons telah dipastikan memiliki kontras yang cukup dan berfungsi normal di browser.

### In Progress / Pending Sections (Target Redesign)
1. **Landing Page Remaining Sections Alignment:**
   - `SolutionSection.tsx`: Perlu penyelarasan visual ke token semantic (masih ada hardcoded gradient/color class di problem cards).
   - `FeatureSection.tsx`: Perlu penataan card & slider agar sesuai karakter Linear/Raycast (subtle borders, clean spacing, theme-aware).
   - `PriceSection.tsx`: Perlu pembersihan hardcoded style dan konversi penuh ke semantic tokens.
   - `MetodologiSection.tsx`, `InklusivitasSection.tsx`, `TestimonialSection.tsx`, `FAQSection.tsx`, `CtaSection.tsx`: Audit & selaraskan ke theme tokens & Raycast/Linear design feel.
2. **Navbar & Footer Alignment:**
   - `LandingNavbar.tsx` & `LandingFooter.tsx`: Hilangkan warna bg dark hardcoded (`bg-[#0f0720]/80`) agar konsisten dalam Light/Dark mode.

---

## Important Files & System Components
- `UNLUPA_GOLDEN_RULES.md`: Aturan emas permanen.
- `src/index.css`: Source of truth design tokens (OKLCH system).
- `src/components/providers/ThemeProvider.tsx`: Multi-theme provider (Light, Dark, System).
- `src/stores/theme.store.ts`: Theme persistence store.
- `src/pages/LandingPage/LandingPage.tsx`: Main landing page composition.
- `src/features/landing/sections/`: Seluruh section landing page.
- `src/features/auth/`: Komponen login, register, dan forgot password.

---

## Current Design Decisions
1. **Teal Primary Accent:** `oklch(0.55 0.15 175)` (Light) & `oklch(0.70 0.15 175)` (Dark).
2. **Surface Hierarchy:** `surface-1`, `surface-2`, `surface-3` untuk menciptakan kedalaman subtil khas Raycast tanpa glassmorphism berlebihan.
3. **No Decorative Bloat:** Menghapus efek stars-overlay/card-glow yang berlebihan dan menggantinya dengan border subtil dan elevasi presisi.

---

## Next Priority Actions
1. Rapikan `LandingNavbar.tsx` & `LandingFooter.tsx` agar 100% theme-aware (Light + Dark).
2. Refactor `SolutionSection.tsx` & `FeatureSection.tsx` mengikuti standar Linear/Raycast.
3. Refactor `PriceSection.tsx` & `MetodologiSection.tsx` ke semantic tokens.
4. Refactor `InklusivitasSection.tsx`, `TestimonialSection.tsx`, `FAQSection.tsx`, `CtaSection.tsx`.
5. Jalankan TypeScript check & Vite build verification.

---

## Do Not Change
- Authentication business logic, form validation logic, dan API calls (`useLogin`, `useRegister`, `useCurrentUser`).
- 5-Fase Hafalan logic, Al-Qur'an FSRS calculation, dan API endpoints.
- Routing structure di `src/app/router.tsx`.

---

## Verification Log
- TypeScript Compilation: Pending run
- Vite Build: Pending run
- Visual/Browser Audit: To be verified step by step
