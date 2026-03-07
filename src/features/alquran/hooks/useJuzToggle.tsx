import { useState } from "react";
import { isAxiosError } from "axios";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { JuzToggleActiveResponse } from "@/features/alquran/types/quran.types";

export const useJuzToggle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateJuz = async (juzIndex: number): Promise<JuzToggleActiveResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await alquranService.activateJuz(juzIndex);
      return response;
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          "Gagal mengaktifkan Juz"
        : "Gagal mengaktifkan Juz";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deactivateJuz = async (juzIndex: number): Promise<JuzToggleActiveResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await alquranService.deactivateJuz(juzIndex);
      return response;
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          "Gagal menonaktifkan Juz"
        : "Gagal menonaktifkan Juz";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { activateJuz, deactivateJuz, loading, error };
};
