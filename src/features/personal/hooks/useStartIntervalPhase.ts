import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedItem } from "../types/personal.types";

export const useStartIntervalPhase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterval = async (
    bookId: string,
    itemId: string,
  ): Promise<CreatedItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.startIntervalPhase(bookId, itemId);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal memulai interval.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { startInterval, loading, error };
};
