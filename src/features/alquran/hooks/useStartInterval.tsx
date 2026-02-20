import { useState } from "react";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { StartIntervalResponse } from "@/features/alquran/types/quran.types";

export const useStartInterval = () => {
  const [data, setData] = useState<StartIntervalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterval = async (itemId: string, intervalDays: number) => {
    try {
      setLoading(true);
      setError(null); 
      
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
