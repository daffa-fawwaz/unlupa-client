import { useState } from "react";
import type { CreateJuzResponse } from "@/features/alquran/types/quran.types";
import { alquranService } from "@/features/alquran/services/alquran.services";

export const useCreateJuz = () => {
  const [data, setData] = useState<CreateJuzResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJuz = async (juzIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await alquranService.createJuz(juzIndex);
      setData(response);
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message || "Failed to create juz";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createJuz };
};
