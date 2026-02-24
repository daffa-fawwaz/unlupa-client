import { useState } from "react";
import { isAxiosError } from "axios";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { ReviewIntervalResponse } from "@/features/alquran/types/quran.types";

export const useReviewInterval = () => {
  const [data, setData] = useState<ReviewIntervalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewInterval = async (itemId: string, rating: 1 | 2 | 3) => {
    try {
      setLoading(true);
      setError(null);

      const response = await alquranService.reviewInterval(itemId, { rating });
      setData(response);
      return response;
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          "Gagal submit review interval"
        : "Gagal submit review interval";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reviewInterval };
};
