import { useState, useEffect } from "react";
import { personalService } from "../services/personal.services";
import type { ItemDetail } from "../types/personal.types";

// Module-level cache — persists across renders within a session, cleared on page reload
const cache = new Map<string, ItemDetail>();

export const useItemDetailCached = (bookItemId: string) => {
  const [detail, setDetail] = useState<ItemDetail | null>(cache.get(bookItemId) ?? null);

  useEffect(() => {
    if (!bookItemId) return;
    if (cache.has(bookItemId)) {
      setDetail(cache.get(bookItemId)!);
      return;
    }

    let cancelled = false;
    personalService
      .getItemDetail(bookItemId)
      .then((res) => {
        if (cancelled) return;
        cache.set(bookItemId, res.data);
        setDetail(res.data);
      })
      .catch(() => {
        // item might not have review state yet — that's fine
      });

    return () => {
      cancelled = true;
    };
  }, [bookItemId]);

  return detail;
};

export const invalidateItemDetailCache = (bookItemId?: string) => {
  if (bookItemId) {
    cache.delete(bookItemId);
  } else {
    cache.clear();
  }
};
