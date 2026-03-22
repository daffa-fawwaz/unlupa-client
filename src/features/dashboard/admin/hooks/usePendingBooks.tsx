import { useState } from "react";
import { pendingBookService } from "../services/pendingBook.service";
import type { PendingBook } from "../types/pendingBook.types";

export const usePendingBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PendingBook[] | null>(null);

  const getPendingBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pendingBookService.getPendingBooks();
      setData(response.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    getPendingBooks,
  };
};
