# UNLUPA Golden Rules

## 1. Preserve Existing Functionality

Jangan merusak functionality yang sudah ada.

Jangan mengubah atau merusak:
- Business logic
- API
- Backend
- Database
- Authentication logic
- Authorization
- Routing
- Existing user flows

Jika sebuah perubahan UI membutuhkan perubahan pada functionality, jangan mengubah logic secara sembarangan. Identifikasi terlebih dahulu apakah perubahan tersebut benar-benar diperlukan.

## 2. UI/UX Focus

Pekerjaan redesign berfokus pada:
- UI
- UX
- Visual hierarchy
- Design system
- Layout
- Typography
- Spacing
- Responsive behavior
- Presentation layer

Jangan melakukan refactor besar pada business logic jika tidak diperlukan untuk pekerjaan UI.

## 3. Do Not Delete Blindly

Jangan menghapus:
- CSS
- Components
- Files
- Functions
- Existing code

hanya karena terlihat lama atau tidak digunakan.

Audit terlebih dahulu penggunaan kode tersebut.

Jika masih digunakan halaman lain, jangan hapus sebelum halaman tersebut dimigrasikan atau dipastikan aman.

## 4. Preserve Authentication Flow

Login, Register, Forgot Password, dan authentication flow yang sudah ada harus tetap dipertahankan.

Perbaikan pada Auth hanya boleh:
- Memperbaiki UI
- Memperbaiki styling
- Memperbaiki responsive layout
- Memperbaiki accessibility
- Memperbaiki bug visual yang membuat user tidak dapat menggunakan flow

Jangan mengubah authentication business logic tanpa alasan yang benar-benar diperlukan.

## 5. Verify Before Claiming Complete

Jangan menyatakan pekerjaan selesai hanya karena:
- TypeScript berhasil
- Build berhasil
- Tidak ada error compilation

Build success TIDAK berarti visual redesign berhasil.

Setiap pekerjaan UI harus diverifikasi dari:
- Source code
- Browser/rendered result
- Layout
- Responsive behavior
- Light mode
- Dark mode jika relevan
- Functionality yang terdampak

## 6. No Fake Redesign

Redesign bukan sekadar:
- Mengganti warna
- Mengganti class Tailwind
- Mengganti design tokens tanpa perubahan visual nyata

Jika targetnya redesign, hasil visual harus benar-benar berubah dan mengikuti arah desain yang telah ditetapkan.

## 7. Design Direction

Arah visual UNLUPA terinspirasi dari kualitas dan karakter UI:

- Linear
- Raycast

Bukan untuk menyalin produk tersebut secara literal.

Target karakter desain:

- Modern
- Premium
- Clean
- Minimal
- Sangat rapi
- Strong visual hierarchy
- Intentional spacing
- Subtle borders
- Subtle elevation
- Smooth interaction
- Professional
- Focused

Hindari:

- Dashboard/SaaS generic look
- Glassmorphism berlebihan
- Gradient berlebihan
- Card berlebihan
- Shadow berlebihan
- Dekorasi yang tidak memiliki fungsi
- Hardcoded colors yang merusak theme compatibility

## 8. Theme Rules

UNLUPA harus mendukung:

- Light Mode
- Dark Mode
- System Theme

Theme bukan hanya dekorasi.

Theme harus:
- Benar-benar mengubah tampilan aplikasi
- Konsisten di seluruh halaman yang sudah dimigrasikan
- Menggunakan semantic design tokens
- Persist setelah refresh
- Mengikuti system preference ketika System Theme dipilih

Jangan membuat Light/Dark mode dengan sekadar menambahkan hardcoded warna berbeda di setiap component jika design tokens dapat digunakan.

## 9. Responsive Rules

Setiap halaman yang dikerjakan harus mempertimbangkan:

- Desktop
- Tablet
- Mobile

Jangan hanya memastikan build berhasil.

Periksa:
- Overflow horizontal
- Layout yang terlalu sempit
- Text wrapping
- Grid behavior
- Sidebar behavior
- Touch target
- Spacing pada layar kecil

## 10. Work From Actual Repository State

Jangan mengandalkan asumsi dari context lama.

Sebelum melanjutkan pekerjaan:
- Audit kondisi repository
- Lihat perubahan yang sudah ada
- Identifikasi apa yang benar-benar sudah selesai
- Jangan mengulang pekerjaan yang sudah selesai tanpa alasan

## 11. Incremental Safe Changes

Kerjakan secara bertahap.

Setelah menyelesaikan bagian penting:
- Verifikasi hasil
- Pastikan tidak merusak halaman lain
- Update progress documentation

Jangan melakukan perubahan besar secara membabi buta ke seluruh project sekaligus.

## 12. Permanent Documentation

Setiap AI agent yang melanjutkan pekerjaan project ini WAJIB membaca:

1. UNLUPA_GOLDEN_RULES.md
2. UNLUPA_UI_PROGRESS.md

sebelum melakukan perubahan besar.

Golden Rules ini tidak boleh dihapus atau diabaikan.
