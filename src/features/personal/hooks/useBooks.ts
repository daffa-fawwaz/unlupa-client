import { useState, useCallback } from "react";
import { personalService } from "../services/personal.services";
import type { Book, CreateBookPayload, UpdateBookPayload } from "../types/personal.types";

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await personalService.getBooks();
      setBooks(response.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal mengambil daftar kitab");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = async (payload: CreateBookPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await personalService.createBook(payload);
      await fetchBooks();
      return response;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Gagal membuat kitab baru");
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, payload: UpdateBookPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await personalService.updateBook(id, payload);
      await fetchBooks();
      return response;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Gagal memperbarui kitab");
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await personalService.deleteBook(id);
      await fetchBooks();
      return response;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Gagal menghapus kitab");
    } finally {
      setLoading(false);
    }
  };

  const requestPublish = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await personalService.requestPublishBook(id);
      await fetchBooks();
      return response;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Gagal membagikan kitab");
    } finally {
      setLoading(false);
    }
  };

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    requestPublish,
  };
};
