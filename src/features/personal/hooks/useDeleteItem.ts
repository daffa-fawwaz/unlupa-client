import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { DeleteItemResponse } from "../types/personal.types";

export const useDeleteItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (itemId: string): Promise<DeleteItemResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.deleteItem(itemId);
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
