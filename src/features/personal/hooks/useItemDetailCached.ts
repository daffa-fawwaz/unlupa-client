import { useState, useEffect } from "react";
import { personalService } from "../services/personal.services";
import type { ItemDetail } from "../types/personal.types";

const cache = new Map<string, ItemDetail>();

export const useItemDetailCached = (bookItemId: string) => {
  // Use the real item_id from localStorage if available (set during start phase)
  const realItemId = localStorage.getItem(`item-real-id-${bookItemId}`) || bookItemId;

  const [detail, setDetail] = useState<ItemDetail | null>(
    cache.get(realItemId) ?? null,
  );

  useEffect(() => {
    if (!realItemId) return;
    if (cache.has(realItemId)) {
      setDetail(cache.get(realItemId)!);
      return;
    }

    let cancelled = false;
    personalService
      .getItemDetail(realItemId)
      .then((res) => {
        if (cancelled) return;
        cache.set(realItemId, res.data);
        setDetail(res.data);
      })
      .catch(() => {
        // item might not have review state yet — that's fine
      });

    return () => {
      cancelled = true;
    };
  }, [realItemId]);

  return detail;
};

export const invalidateItemDetailCache = (bookItemId?: string) => {
  if (bookItemId) {
    cache.delete(bookItemId);
    const realId = localStorage.getItem(`item-real-id-${bookItemId}`);
    if (realId) cache.delete(realId);
  } else {
    cache.clear();
  }
};
