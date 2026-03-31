import {
  Play,
  Flame,
  Star,
  Clock,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetDailyBooks } from "@/features/personal/hooks/useGetDailyBooks";
import { useBookDailyReviewEstimate } from "@/features/personal/hooks/useBookDailyReviewEstimate";
import type { BookDailyTask } from "@/features/personal/types/personal.types";
import { BookDailyReviewFlashcardModal } from "@/features/personal/components/BookDailyReviewFlashcardModal";
import { BookDailyReviewModal } from "@/features/personal/components/BookDailyReviewModal";
import { personalService } from "@/features/personal/services/personal.services";
import { getTodayDateKey, getReviewedIdsForTaskDate } from "@/features/personal/utils/bookReviewUtils";

export const BookDailyReviewSection = () => {
  const { getDaily, data: dailyTasks } = useGetDailyBooks();
  const {
    loading: estimateLoading,
    bookGroups,
    refetch: refetchEstimates,
  } = useBookDailyReviewEstimate();

  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<BookDailyTask | null>(null);
  const [selectedBookGroup, setSelectedBookGroup] = useState<typeof bookGroups[0] | null>(null);
  const [reviewedItemsVersion, setReviewedItemsVersion] = useState(0);

  useEffect(() => {
    const refetchDaily = async () => {
      try {
        // First, generate daily tasks
        await personalService.generateDailyBooks();
        // Then fetch the tasks
        await getDaily();
      } catch (error) {
        console.error("Failed to refetch daily tasks", error);
      }
    };

    refetchDaily();
    const safetyRefetchId = window.setTimeout(refetchDaily, 800);
    
    window.addEventListener(
      "books:daily-generated",
      refetchDaily as EventListener,
    );
    
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetchDaily();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(safetyRefetchId);
      window.removeEventListener(
        "books:daily-generated",
        refetchDaily as EventListener,
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [getDaily]);

  // Refetch estimates when daily tasks change
  useEffect(() => {
    if (dailyTasks && dailyTasks.length > 0) {
      void refetchEstimates(dailyTasks);
    }
  }, [dailyTasks, refetchEstimates, reviewedItemsVersion]);

  // Filter book groups by reviewed items
  const filteredBookGroups = useMemo(() => {
    const todayKey = getTodayDateKey();
    const reviewedIds = getReviewedIdsForTaskDate(todayKey);

    return bookGroups
      .map((book) => {
        // Filter out reviewed items from each book
        const filteredItems = book.items.filter(
          (item) => !reviewedIds.includes(item.item_id)
        );

        // Return updated book with filtered items
        return {
          ...book,
          items: filteredItems,
          itemCount: filteredItems.length,
          totalEstimatedSeconds: filteredItems.reduce(
            (sum, item) => sum + (item.estimatedReviewSeconds || 0),
            0
          ),
          totalEstimatedMinutes: Math.ceil(
            filteredItems.reduce(
              (sum, item) => sum + (item.estimatedReviewSeconds || 0),
              0
            ) / 60
          ),
        };
      })
      .filter((book) => book.itemCount > 0);
  }, [bookGroups, reviewedItemsVersion]);

  // Calculate total items and time
  const totalItems = filteredBookGroups.reduce(
    (sum, book) => sum + book.itemCount,
    0
  );

  const totalBooks = filteredBookGroups.length;

  const formatTotalTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}d`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const openBookModal = (bookGroup: typeof filteredBookGroups[0]) => {
    setSelectedBookGroup(bookGroup);
    setIsBookModalOpen(true);
  };

  const openFlashcard = (task: BookDailyTask) => {
    setSelectedTask(task);
    setIsFlashcardOpen(true);
    setIsBookModalOpen(false);
  };

  const handleReviewed = async () => {
    const reviewedItemId = selectedTask?.item_id;
    const reviewedTaskDate = selectedTask?.task_date ?? getTodayDateKey();
    const reviewedStorageKey = `books:daily-reviewed:${reviewedTaskDate}`;

    const reviewedIds = getReviewedIdsForTaskDate(reviewedTaskDate);
    if (reviewedItemId && !reviewedIds.includes(reviewedItemId)) {
      localStorage.setItem(
        reviewedStorageKey,
        JSON.stringify([...reviewedIds, reviewedItemId]),
      );
      // Trigger re-render of filteredBookGroups
      setReviewedItemsVersion((prev) => prev + 1);
    }

    await getDaily();
    await refetchEstimates(dailyTasks || []);
  };

  return (
    <div className="mb-16 md:mb-24 animate-fadeIn relative">
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 blur-2xl bg-linear-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl opacity-50 pointer-events-none" />

      <div className="relative bg-linear-to-br from-[#1A222C] to-[#0F141A] rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-900/20">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-linear-to-r from-purple-400 via-pink-400 to-purple-400" />

        <div className="p-6 md:p-8">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0 transform -rotate-3">
                <Flame className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide uppercase mb-2">
                  <Star className="w-3.5 h-3.5" /> Review Harian
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                  Target Review Buku Hari Ini
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                  Ada{" "}
                  <strong className="text-purple-400">
                    {totalItems} item
                  </strong>{" "}
                  di{" "}
                  <strong className="text-purple-400">
                    {totalBooks} Buku
                  </strong>{" "}
                  yang menunggu untuk direview.
                </p>
              </div>
            </div>

            {filteredBookGroups.length > 0 && (
              <button
                onClick={() => {
                  const firstBook = filteredBookGroups[0];
                  if (firstBook.items.length > 0) {
                    const task: BookDailyTask = {
                      item_id: firstBook.items[0].item_id,
                      source: "interval_review",
                      state: "pending",
                      task_date: getTodayDateKey(),
                      content_ref: firstBook.items[0].content_ref,
                      status: firstBook.items[0].status,
                      book_title: firstBook.book_title,
                      book_item_title: firstBook.items[0].book_item_title,
                    };
                    openFlashcard(task);
                  }
                }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-[#0B0E14] font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-current" />
                Gas Review!
              </button>
            )}
          </div>

          {/* Book Cards Grid */}
          {estimateLoading && (
            <p className="text-sm text-gray-400">Memuat target harian...</p>
          )}
          {!estimateLoading && filteredBookGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm">
                Tidak ada review hari ini.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredBookGroups.map((book, index) => (
              <button
                key={book.book_id}
                onClick={() => openBookModal(book)}
                className="group relative overflow-hidden rounded-xl p-5 bg-[#161D26] border border-white/10 hover:bg-[#1A222C] hover:border-purple-500/40 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors truncate">
                          {book.book_title}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {book.itemCount} item
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-bold text-sm">
                      {formatTotalTime(book.totalEstimatedSeconds)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      estimasi review
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book Modal - Shows items within a book */}
      <BookDailyReviewModal
        isOpen={isBookModalOpen}
        bookGroup={selectedBookGroup}
        onClose={() => setIsBookModalOpen(false)}
        onItemSelected={openFlashcard}
      />

      {/* Flashcard Modal - For reviewing individual items */}
      <BookDailyReviewFlashcardModal
        key={`${selectedTask?.item_id ?? "no-item"}-${isFlashcardOpen ? "open" : "close"}`}
        isOpen={isFlashcardOpen}
        task={selectedTask}
        onClose={() => setIsFlashcardOpen(false)}
        onReviewed={handleReviewed}
      />
    </div>
  );
};
