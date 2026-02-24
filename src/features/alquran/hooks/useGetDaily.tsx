import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import type { DailyTasksResponse } from "@/features/alquran/types/quran.types";
import { alquranService } from "@/features/alquran/services/alquran.services";

export const useGetDaily = () => {
  const [data, setData] = useState<DailyTasksResponse>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDaily = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await alquranService.getDaily();
      setData(response);
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ||
          "Failed to fetch daily tasks"
        : "Failed to fetch daily tasks";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getDaily };
};
