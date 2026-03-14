import { useState } from "react";
import { isAxiosError } from "axios";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { ReviewFsrsResponse } from "@/features/alquran/types/quran.types";

export const useReviewFsrs = () => {
  const [data, setData] = useState<ReviewFsrsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewFsrs = async (itemId: string, rating: 1 | 2 | 3 | 4) => {
    try {
      setLoading(true);
      setError(null);

      const response = await alquranService.reviewFsrs(itemId, { rating });
      setData(response);
      return response;
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          "Gagal submit review"
        : "Gagal submit review";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reviewFsrs };
};
