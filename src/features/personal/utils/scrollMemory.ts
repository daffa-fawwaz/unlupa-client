const SCROLL_MEMORY_PREFIX = "unlupa:scroll:";

/** Simpan posisi scroll window untuk sebuah halaman (key = pathname) sebelum
 *  user menuju ke halaman detail turunannya, agar bisa di-restore saat kembali.
 */
export function rememberScroll(key: string): void {
  try {
    if (key) {
      sessionStorage.setItem(SCROLL_MEMORY_PREFIX + key, String(window.scrollY));
    }
  } catch {
    // abaikan — fitur non-kritikal, gagal menyimpan tak memengaruhi navigasi
  }
}

/** Ambil & hapus posisi scroll tersimpan untuk sebuah halaman (konsumsi sekali). */
export function takeScroll(key: string): number | null {
  try {
    const raw = key ? sessionStorage.getItem(SCROLL_MEMORY_PREFIX + key) : null;
    if (raw == null) return null;
    sessionStorage.removeItem(SCROLL_MEMORY_PREFIX + key);
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}