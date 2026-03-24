import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedItem, UpdateItemPayload } from "../types/personal.types";

export const useUpdateItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedItem, setUpdatedItem] = useState<CreatedItem | null>(null);

  const updateItem = async (
    itemId: string,
    payload: UpdateItemPayload,
  ): Promise<CreatedItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.updateItem(itemId, payload);
      setUpdatedItem(response.data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal memperbarui item.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { updateItem, loading, error, updatedItem };
};
