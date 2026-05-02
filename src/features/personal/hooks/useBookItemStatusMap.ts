import { useCallback, useState } from "react";
import { personalService } from "../services/personal.services";
import type { ItemDetail } from "../types/personal.types";

// Maps content_ref → { status, item_id }
export type ItemStatusEntry = { status: string; item_id: string };
export type ItemStatusMap = Map<string, ItemStatusEntry>;

// content_ref format: book:{bookId}:item:{bookItemId}
export const contentRefForItem = (bookId: string, bookItemId: string) =>
  `book:${bookId}:item:${bookItemId}`;

const REVIEWABLE_STATUSES = ["menghafal", "interval", "fsrs_active", "graduate", "inactive", "start"];

export const useBookItemStatusMap = () => {
  const [statusMap, setStatusMap] = useState<ItemStatusMap>(new Map());
  const [loading, setLoading] = useState(false);

  const fetchStatusMap = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all statuses in parallel
      const results = await Promise.allSettled(
        REVIEWABLE_STATUSES.map((s) => personalService.getItemsByStatus(s))
      );

      const map: ItemStatusMap = new Map();
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          result.value.data.forEach((item: ItemDetail) => {
            map.set(item.content_ref, {
              status: item.status,
              item_id: item.item_id,
            });
          });
        }
      });
      setStatusMap(map);
      return map;
    } catch {
      return new Map<string, ItemStatusEntry>();
    } finally {
      setLoading(false);
    }
  }, []);

  return { statusMap, loading, fetchStatusMap };
};
