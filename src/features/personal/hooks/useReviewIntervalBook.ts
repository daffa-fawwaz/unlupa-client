import { useCallback, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import type { ReviewIntervalPayload, ReviewIntervalResponse } from "@/features/personal/types/personal.types";

export const useReviewIntervalBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewInterval = useCallback(async (
    itemId: string,
    payload: ReviewIntervalPayload,
  ): Promise<ReviewIntervalResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.reviewIntervalBook(itemId, payload);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit review";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reviewInterval, loading, error };
};
