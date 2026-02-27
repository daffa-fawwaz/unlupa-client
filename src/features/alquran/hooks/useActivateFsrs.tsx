import { useState } from "react";
import { isAxiosError } from "axios";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { ActivateFsrsResponse } from "@/features/alquran/types/quran.types";

export const useActivateFsrs = () => {
  const [data, setData] = useState<ActivateFsrsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateFsrs = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await alquranService.activateFsrs(itemId);
      setData(response);
      return response;
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          "Gagal mengaktifkan mode terjaga"
        : "Gagal mengaktifkan mode terjaga";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, activateFsrs };
};
