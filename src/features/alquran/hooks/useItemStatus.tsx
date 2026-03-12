  import { useState, useEffect, useCallback } from "react";
  import { alquranService } from "@/features/alquran/services/alquran.services";
  import type { MyItemsQuranResponse } from "@/features/alquran/types/quran.types";

  export type ItemStatus = "menghafal" | "interval" | "fsrs_active" | "graduate";

  interface UseItemStatusResult {
    status: ItemStatus | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
  }

  /**
   * Reusable hook to get the status of a specific item from the my-items API.
   * Can be used in any item component to check its status.
   *
   * @param itemId - The item_id to check status for
   * @returns Object with status, loading, error, and refresh function
   *
   * @example
   * // In your component
   * const { status, loading, error } = useItemStatus("some-item-id");
   *
   * if (status === "menghafal") {
   *   // render menghafal component
   * } else if (status === "interval") {
   *   // render interval component
   * } else if (status === "fsrs_active") {
   *   // render fsrs_active component
   * }
   */
  export const useItemStatus = (itemId: string | null): UseItemStatusResult => {
    const [status, setStatus] = useState<ItemStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItemStatus = useCallback(async () => {
      if (!itemId) {
        setStatus(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response: MyItemsQuranResponse = await alquranService.getMyItems("quran");
        
        // Search through all groups and items to find the matching item_id
        const foundItem = response.data.groups
          .flatMap((group) => group.items)
          .find((item) => item.item_id === itemId);

        if (foundItem) {
          setStatus(foundItem.status as ItemStatus);
        } else {
          setStatus(null);
        }
      } catch (err) {
        const message =
          (err as any)?.response?.data?.message || "Failed to fetch item status";
        setError(message);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }, [itemId]);

    useEffect(() => {
      fetchItemStatus();
    }, [fetchItemStatus]);

    return {
      status,
      loading,
      error,
      refresh: fetchItemStatus,
    };
  };
