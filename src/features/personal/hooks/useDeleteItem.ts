import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { DeleteItemResponse } from "../types/personal.types";

interface UseDeleteItemOptions {
  onBookTreeUpdate?: (bookId: string, deletedItemId: string) => void;
}

export const useDeleteItem = (options?: UseDeleteItemOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (
    itemId: string,
    bookId?: string,
  ): Promise<DeleteItemResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.deleteItem(itemId);
      
      // Update book tree state if callback provided
      if (options?.onBookTreeUpdate && bookId) {
        options.onBookTreeUpdate(bookId, itemId);
      }
      
      return response;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal menghapus item.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
};
