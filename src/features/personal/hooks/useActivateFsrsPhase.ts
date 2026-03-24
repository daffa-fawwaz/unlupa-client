import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedItem } from "../types/personal.types";

export const useActivateFsrsPhase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateFsrs = async (
    bookId: string,
    itemId: string,
  ): Promise<CreatedItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.activateFsrsPhase(bookId, itemId);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal mengaktifkan FSRS.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { activateFsrs, loading, error };
};
