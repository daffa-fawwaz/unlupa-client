import { useState, useCallback } from "react";
import { personalService } from "../services/personal.services";
import type { Book } from "../types/personal.types";

export const useBookDetail = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.getBookById(id);
      setBook(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Gagal memuat detail buku.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { book, loading, error, fetchBookDetail };
};
