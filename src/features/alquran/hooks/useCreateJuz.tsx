import { useState } from "react";
import type { CreateJuzResponse } from "../types/quran.types";
import { alquranService } from "../services/alquran.services";


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
      setError("Failed to create juz");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createJuz };
};