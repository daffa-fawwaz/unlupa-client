import { useState, useEffect, useCallback } from "react";
import { personalService } from "../services/personal.services";
import type { ItemDetail } from "../types/personal.types";

export const useItemDetail = (itemId?: string) => {
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = useCallback(async () => {
    if (!itemId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.getItemDetail(itemId);
      setItemDetail(response.data);
    } catch (err: any) {
      // Error logged silently - using tree data as fallback
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (itemId) {
      void fetchItemDetail();
    }
  }, [itemId, fetchItemDetail]);

  return { itemDetail, loading, error, refetch: fetchItemDetail };
};
