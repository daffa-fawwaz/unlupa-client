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
      console.log('[useItemDetail] Fetching item detail for:', itemId);
      const response = await personalService.getItemDetail(itemId);
      console.log('[useItemDetail] Item detail response:', response.data);
      setItemDetail(response.data);
    } catch (err: any) {
      console.error('[useItemDetail] Error fetching item detail:', err?.response?.data);
      // Don't set error state - just log it and continue
      // We'll use tree data as fallback
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
