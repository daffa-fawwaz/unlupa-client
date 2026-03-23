import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedItem, CreateItemPayload } from "../types/personal.types";

export const useCreateItem = () => {
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
      setCreatedItem(response.data);
      return response.data;
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
