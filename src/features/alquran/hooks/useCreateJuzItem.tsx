import { alquranService } from "@/features/alquran/services/alquran.services";
import type {
  CreateJuzItemPayload,
  CreateJuzItemResponse,
} from "@/features/alquran/types/quran.types";
import { useState } from "react";

export const useCreateJuzItem = () => {
  const [data, setData] = useState<CreateJuzItemResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJuzItem = async (
    juzId: string,
    payload: CreateJuzItemPayload,
  ) => {
    try {
      setLoading(true);
      const response = await alquranService.createJuzItem(juzId, payload);
      setData(response);
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || "Failed to create juz item";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createJuzItem };
};
