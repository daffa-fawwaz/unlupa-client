import { useState } from "react";
import { personalService } from "../services/personal.services";

export interface StartPhaseResult {
  item_id: string;
  book_item_id: string;
  status: string;
}

export const useStartItemPhase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPhase = async (
    bookId: string,
    itemId: string,
  ): Promise<StartPhaseResult> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.startItemPhase(bookId, itemId);
      // response.data is StartMemorizationResult from backend
      return response.data as unknown as StartPhaseResult;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as Error).message ??
        "Gagal memulai fase.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { startPhase, loading, error };
};
