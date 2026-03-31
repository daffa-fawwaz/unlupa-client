import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedItem, CreateItemPayload } from "../types/personal.types";

interface UseCreateItemOptions {
  onBookTreeUpdate?: (bookId: string, newItem: CreatedItem) => void;
}

export const useCreateItem = (options?: UseCreateItemOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdItem, setCreatedItem] = useState<CreatedItem | null>(null);

  const createItem = async (
    bookId: string,
    payload: CreateItemPayload,
  ): Promise<CreatedItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.createItem(bookId, payload);
      const newItem = response.data;
      setCreatedItem(newItem);
      
      // Update book tree state if callback provided
      if (options?.onBookTreeUpdate) {
        options.onBookTreeUpdate(bookId, newItem);
      }
      
      return newItem;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal menambahkan item.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createItem, loading, error, createdItem };
};
