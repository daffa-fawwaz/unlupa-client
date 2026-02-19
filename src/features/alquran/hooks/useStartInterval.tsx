import { useState } from "react";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { StartIntervalResponse } from "@/features/alquran/types/quran.types";

/**
 * useStartInterval
 *
 * Custom hook untuk memanggil endpoint POST /api/v1/items/:item_id/start-interval.
 *
 * Kenapa dipisahkan ke custom hook?
 * - Supaya logika async (loading, error, data) tidak "bocor" ke dalam komponen.
 * - Komponen cukup tahu: "loading ga? ada error ga? panggil fungsi ini."
 * - Hook yang tahu cara memanggil service; service yang tahu URL-nya.
 * - Ini membuat setiap lapisan punya satu tanggung jawab (Single Responsibility Principle).
 */
export const useStartInterval = () => {
  const [data, setData] = useState<StartIntervalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterval = async (itemId: string, intervalDays: number) => {
    try {
      setLoading(true);
      setError(null); // Reset error sebelum request baru

      const response = await alquranService.startInterval(itemId, {
        interval_days: intervalDays,
      });

      setData(response);
      return response; // Return supaya caller (modal) bisa bereaksi setelah sukses
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ||
        "Gagal memulai interval murajaah";
      setError(message);
      throw err; // Re-throw supaya modal bisa handle error juga kalau perlu
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, startInterval };
};
