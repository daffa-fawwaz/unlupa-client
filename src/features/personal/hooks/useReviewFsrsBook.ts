import { useCallback, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import type { ReviewFsrsPayload, ReviewFsrsResponse } from "@/features/personal/types/personal.types";

export const useReviewFsrsBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewFsrs = useCallback(async (
    itemId: string,
    payload: ReviewFsrsPayload,
  ): Promise<ReviewFsrsResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.reviewFsrsBook(itemId, payload);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit review";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reviewFsrs, loading, error };
};
