import { useState, useCallback } from "react";
import { personalService } from "../services/personal.services";
import type { Book } from "../types/personal.types";

export const usePublishedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await personalService.getPublishedBooks();
      setBooks(response.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal mengambil daftar kitab dari perpustakaan global");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    books,
    loading,
    error,
    fetchBooks,
  };
};
