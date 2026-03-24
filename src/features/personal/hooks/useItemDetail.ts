import { useState, useCallback } from "react";
import { personalService } from "../services/personal.services";
import type { ItemDetail } from "../types/personal.types";

export const useItemDetail = () => {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = useCallback(async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.getItemDetail(itemId);
      setItem(response.data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal mengambil detail item.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { item, loading, error, fetchItemDetail };
};
