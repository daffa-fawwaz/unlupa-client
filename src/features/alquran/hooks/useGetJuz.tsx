import { useState } from "react";
import type { GetJuzResponse } from "../types/quran.types";
import { alquranService } from "../services/alquran.services";

export const useGetJuz = () => {
  const [data, setData] = useState<GetJuzResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getJuz = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await alquranService.getJuz();
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

  return { data, loading, error, getJuz };
};
