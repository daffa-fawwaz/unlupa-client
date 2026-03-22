import { useState } from "react";
import { bookActionService } from "@/features/dashboard/admin/services/pendingBook.service";
import type { BookActionResponse } from "@/features/dashboard/admin/types/pendingBook.types";

export const useRejectBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BookActionResponse | null>(null);

  const rejectBook = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookActionService.rejectBook(id);
      setData(response);
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
    rejectBook,
  };
};
