import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Flame,
  Star,
  BookOpen,
  Layers,
  FolderOpen,
  CheckCircle2,
} from "lucide-react";
import { useGetDailyBooks } from "@/features/personal/hooks/useGetDailyBooks";
import { useParentGroupedReview } from "@/features/personal/hooks/useParentGroupedReview";
import { BookDailyReviewFlashcardModal } from "@/features/personal/components/BookDailyReviewFlashcardModal";
import { personalService } from "@/features/personal/services/personal.services";
import { getTodayDateKey, getReviewedIdsForTaskDate } from "@/features/personal/utils/bookReviewUtils";
import type { BookDailyTask, ParentGroup } from "@/features/personal/types/personal.types";

/* ------------------------------------------------------------------ */
/* Parent icon helper                                                   */
/* ------------------------------------------------------------------ */
const ParentIcon = ({ type }: { type: ParentGroup["parent_type"] }) => {
  if (type === "submodule") return <Layers className="w-6 h-6 text-purple-400" />;
  if (type === "module") return <FolderOpen className="w-6 h-6 text-purple-400" />;
  return <BookOpen className="w-6 h-6 text-purple-400" />;
};

/* ------------------------------------------------------------------ */
/* Main Section                                                         */
/* ------------------------------------------------------------------ */
export const BookDailyReviewSection = () => {
  const { getDaily, data: dailyTasks } = useGetDailyBooks();
  const { loading, groups, buildGroups } = useParentGroupedReview();

  // Flashcard queue state
  const [activeGroup, setActiveGroup] = useState<ParentGroup | null>(null);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [reviewedVersion, setReviewedVersion] = useState(0);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        await personalService.generateDailyBooks();
        await getDaily();
      } catch {
        // silent
      }
    };
    void init();

    const onGenerated = () => void init();
    const onVisible = () => {
      if (document.visibilityState === "visible") void init();
    };

    window.addEventListener("books:daily-generated", onGenerated);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("books:daily-generated", onGenerated);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [getDaily]);

  // Rebuild groups when tasks change
  useEffect(() => {
    if (dailyTasks && dailyTasks.length > 0) {
      void buildGroups(dailyTasks);
    }
  }, [dailyTasks, buildGroups]);

  // Filter out already-reviewed items
  const filteredGroups = useMemo(() => {
    const todayKey = getTodayDateKey();
    const reviewedIds = getReviewedIdsForTaskDate(todayKey);

    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((qi) => !reviewedIds.includes(qi.item_id)),
      }))
      .filter((g) => g.items.length > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, reviewedVersion]);

  const totalItems = filteredGroups.reduce((s, g) => s + g.items.length, 0);

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */
  const openGroup = (group: ParentGroup, startIndex = 0) => {
    setActiveGroup(group);
    setQueueIndex(startIndex);
    setIsFlashcardOpen(true);
  };

  const currentTask: BookDailyTask | null =
    activeGroup && activeGroup.items[queueIndex]
      ? activeGroup.items[queueIndex].task
      : null;

  const handleReviewed = async () => {
    if (!activeGroup) return;

    // Mark as reviewed in localStorage
    const todayKey = getTodayDateKey();
    const storageKey = `books:daily-reviewed:${todayKey}`;
    const reviewedIds = getReviewedIdsForTaskDate(todayKey);
    const reviewedId = activeGroup.items[queueIndex]?.item_id;

    if (reviewedId && !reviewedIds.includes(reviewedId)) {
      localStorage.setItem(storageKey, JSON.stringify([...reviewedIds, reviewedId]));
    }

    setReviewedVersion((v) => v + 1);

    // Check if there's a next item in the queue
    const nextIndex = queueIndex + 1;
    const remainingItems = activeGroup.items.filter(
      (qi) => !getReviewedIdsForTaskDate(todayKey).includes(qi.item_id),
    );

    if (remainingItems.length > 0) {
      // Advance to next unreviewed item
      const nextItem = remainingItems[0];
      const nextIdx = activeGroup.items.findIndex(
        (qi) => qi.item_id === nextItem.item_id,
      );
      setQueueIndex(nextIdx >= 0 ? nextIdx : nextIndex);
    } else {
      // All done in this group
      setIsFlashcardOpen(false);
      setActiveGroup(null);
    }

    await getDaily();
  };

  const handleFlashcardClose = () => {
    setIsFlashcardOpen(false);
    setActiveGroup(null);
    setQueueIndex(0);
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mb-16 md:mb-24 animate-fadeIn relative">
      {/* Background glow */}
      <div className="absolute -inset-1 blur-2xl bg-linear-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl opacity-50 pointer-events-none" />

      <div className="relative bg-linear-to-br from-[#1A222C] to-[#0F141A] rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-900/20">
        <div className="h-1 w-full bg-linear-to-r from-purple-400 via-pink-400 to-purple-400" />

        <div className="p-6 md:p-8">
          {/* Header */}
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
                  <strong className="text-purple-400">{totalItems} item</strong>{" "}
                  di{" "}
                  <strong className="text-purple-400">
                    {filteredGroups.length} wadah
                  </strong>{" "}
                  yang menunggu untuk direview.
                </p>
              </div>
            </div>

            {filteredGroups.length > 0 && (
              <button
                onClick={() => openGroup(filteredGroups[0])}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-[#0B0E14] font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-current" />
                Gas Review!
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-sm text-gray-400 animate-pulse">Memuat target harian...</p>
          )}

          {/* Empty state */}
          {!loading && filteredGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-white font-bold mb-1">Semua sudah direview!</p>
              <p className="text-gray-400 text-sm">Tidak ada review tersisa hari ini.</p>
            </div>
          )}

          {/* Group Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredGroups.map((group, index) => (
              <button
                key={group.parent_id}
                onClick={() => openGroup(group)}
                className="group relative overflow-hidden rounded-xl p-5 bg-[#161D26] border border-white/10 hover:bg-[#1A222C] hover:border-purple-500/40 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <ParentIcon type={group.parent_type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black text-white group-hover:text-purple-400 transition-colors truncate leading-tight">
                          {group.parent_title}
                        </h3>
                        {group.parent_type !== "book" && (
                          <p className="text-gray-500 text-xs truncate mt-0.5">
                            {group.book_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-purple-300 font-bold text-sm">
                        {group.items.length} item perlu direview
                      </span>
                    </div>
                    <Play className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors fill-current" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flashcard Modal */}
      {isFlashcardOpen && currentTask && activeGroup && (
        <BookDailyReviewFlashcardModal
          key={`${currentTask.item_id}-${queueIndex}`}
          isOpen={isFlashcardOpen}
          task={currentTask}
          queuePosition={queueIndex + 1}
          queueTotal={activeGroup.items.length}
          onClose={handleFlashcardClose}
          onReviewed={handleReviewed}
        />
      )}
    </div>
  );
};
