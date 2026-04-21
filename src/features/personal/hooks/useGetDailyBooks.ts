import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import type { BookDailyTasksResponse } from "@/features/personal/types/personal.types";
import { personalService } from "@/features/personal/services/personal.services";

export const useGetDailyBooks = () => {
  const [data, setData] = useState<BookDailyTasksResponse>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDaily = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.getDailyBooks();
      setData(response);
      return response;
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
