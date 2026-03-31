import { useCallback, useState } from "react";
import { personalService } from "@/features/personal/services/personal.services";
import type { BookDailyReviewGroup, BookDailyTask, BookDailyReviewEstimate } from "@/features/personal/types/personal.types";
import { parseBookContentRef } from "@/features/personal/utils/bookReviewUtils";

/**
 * Hook to fetch and group daily review items by book
 * Filters items with content_ref starting with "book:"
 */
export const useBookDailyReviewEstimate = () => {
  const [loading, setLoading] = useState(false);
  const [bookGroups, setBookGroups] = useState<BookDailyReviewGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetails = useCallback(async (bookId: string): Promise<{ title: string } | null> => {
    try {
      const response = await personalService.getBookById(bookId);
      return { title: response.data.title };
    } catch {
      return null;
    }
  }, []);

  const refetch = useCallback(async (tasks: BookDailyTask[]) => {
    setLoading(true);
    setError(null);
    try {
      // Filter only book items
      const bookTasks = tasks.filter((task) => 
        task.content_ref && task.content_ref.startsWith("book:")
      );

      // Group by book_id
      const bookMap = new Map<string, BookDailyReviewGroup>();

      for (const task of bookTasks) {
        const parsed = parseBookContentRef(task.content_ref);
        if (!parsed) continue;

        const bookId = parsed.bookId;
        
        if (!bookMap.has(bookId)) {
          // Fetch book details
          const bookDetails = await fetchBookDetails(bookId);
          bookMap.set(bookId, {
            book_id: bookId,
            book_title: bookDetails?.title || `Book ${bookId}`,
            itemCount: 0,
            totalEstimatedSeconds: 0,
            totalEstimatedMinutes: 0,
            items: [],
          });
        }

        const bookGroup = bookMap.get(bookId)!;
        const estimateItem: BookDailyReviewEstimate = {
          item_id: task.item_id,
          content_ref: task.content_ref,
          status: task.status || "interval",
          estimatedReviewSeconds: 30, // Default estimate for book items
          book_title: bookGroup.book_title,
          book_item_title: task.book_item_title,
        };

        bookGroup.items.push(estimateItem);
        bookGroup.itemCount = bookGroup.items.length;
        bookGroup.totalEstimatedSeconds = bookGroup.items.reduce(
          (sum, item) => sum + (item.estimatedReviewSeconds || 0),
          0
        );
        bookGroup.totalEstimatedMinutes = Math.ceil(bookGroup.totalEstimatedSeconds / 60);

        bookMap.set(bookId, bookGroup);
      }

      setBookGroups(Array.from(bookMap.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch book review estimates");
    } finally {
      setLoading(false);
    }
  }, [fetchBookDetails]);

  return { loading, bookGroups, error, refetch };
};
