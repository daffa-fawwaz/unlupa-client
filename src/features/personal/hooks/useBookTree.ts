import { useState, useCallback } from "react";
import { personalService } from "../services/personal.services";
import type { BookTree } from "../types/personal.types";

export const useBookTree = () => {
  const [tree, setTree] = useState<BookTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookTree = useCallback(async (bookId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.getBookTree(bookId);
      setTree(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err.message ??
          "Gagal memuat struktur buku.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { tree, loading, error, fetchBookTree };
};
