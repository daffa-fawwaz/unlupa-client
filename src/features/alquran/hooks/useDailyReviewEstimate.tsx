import { useState, useEffect, useCallback } from "react";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { ItemByStatus } from "@/features/alquran/types/quran.types";

export interface ItemWithEstimate extends ItemByStatus {
  estimatedReviewSeconds: number;
}

export interface JuzReviewEstimate {
  juz_index: number;
  juz_id: string;
  items: ItemWithEstimate[];
  itemCount: number;
  totalEstimatedSeconds: number;
  totalEstimatedMinutes: number;
}

export const useDailyReviewEstimate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [juzEstimates, setJuzEstimates] = useState<JuzReviewEstimate[]>([]);

  const fetchEstimates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch items from both interval and fsrs_active status
      const [intervalResponse, fsrsResponse] = await Promise.all([
        alquranService.getItemsByStatus("interval"),
        alquranService.getItemsByStatus("fsrs_active"),
      ]);

      // Combine all items with their estimated review seconds
      const allItems: ItemWithEstimate[] = [
        ...intervalResponse.data.map((item) => ({
          ...item,
          estimatedReviewSeconds: item.estimatedReviewSeconds ?? 0,
        })),
        ...fsrsResponse.data.map((item) => ({
          ...item,
          estimatedReviewSeconds: item.estimatedReviewSeconds ?? 0,
        })),
      ];

      // Fetch from my-items to get juz info
      const myItemsResponse = await alquranService.getMyItems("quran");
      
      // Build a map of item_id -> juz_index
      const itemJuzMap = new Map<string, { juz_index: number; juz_id: string }>();
      myItemsResponse.data.groups.forEach((group) => {
        group.items.forEach((item) => {
          itemJuzMap.set(item.item_id, {
            juz_index: group.juz_index,
            juz_id: group.juz_id,
          });
        });
      });

      // Group items by juz
      const juzMap = new Map<number, JuzReviewEstimate>();
      
      allItems.forEach((item) => {
        const juzInfo = itemJuzMap.get(item.item_id);
        if (!juzInfo) return;

        if (!juzMap.has(juzInfo.juz_index)) {
          juzMap.set(juzInfo.juz_index, {
            juz_index: juzInfo.juz_index,
            juz_id: juzInfo.juz_id,
            items: [],
            itemCount: 0,
            totalEstimatedSeconds: 0,
            totalEstimatedMinutes: 0,
          });
        }

        const juzEstimate = juzMap.get(juzInfo.juz_index)!;
        juzEstimate.items.push(item);
        juzEstimate.itemCount += 1;
        juzEstimate.totalEstimatedSeconds += item.estimatedReviewSeconds || 0;
      });

      // Calculate minutes for each juz
      const estimates = Array.from(juzMap.values()).map((juz) => ({
        ...juz,
        totalEstimatedMinutes: Math.ceil(juz.totalEstimatedSeconds / 60),
      }));

      setJuzEstimates(estimates.sort((a, b) => a.juz_index - b.juz_index));
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message || "Failed to fetch review estimates";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEstimates();
  }, [fetchEstimates]);

  return {
    loading,
    error,
    juzEstimates,
    refetch: fetchEstimates,
  };
};
