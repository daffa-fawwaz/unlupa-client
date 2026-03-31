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
      console.log('[useStartItemPhase] Calling API...');
      const response = await personalService.startItemPhase(bookId, itemId);
      console.log('[useStartItemPhase RAW]', JSON.stringify(response.data, null, 2));
      console.log('[useStartItemPhase] Returning response.data');
      return response.data;
    } catch (err: any) {
      console.error('[useStartItemPhase] ERROR:', err?.response?.data);
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
