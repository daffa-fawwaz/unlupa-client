import { useCallback, useState } from "react";
import { pendingBookService } from "../services/pendingBook.service";
import type { PendingBook } from "../types/pendingBook.types";

export const usePendingBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PendingBook[] | null>(null);

  const getPendingBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pendingBookService.getPendingBooks();
      setData(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch pending books");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    getPendingBooks,
  };
};
