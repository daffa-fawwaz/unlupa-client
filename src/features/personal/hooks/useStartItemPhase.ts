import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedItem } from "../types/personal.types";

export const useStartItemPhase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPhase = async (
    bookId: string,
    itemId: string,
  ): Promise<CreatedItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.startItemPhase(bookId, itemId);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal memulai fase.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { startPhase, loading, error };
};
