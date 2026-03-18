import {
  Play,
  Flame,
  Star,
  Clock,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetDaily } from "@/features/alquran/hooks/useGetDaily";
import { useDailyReviewEstimate, type JuzReviewEstimate } from "@/features/alquran/hooks/useDailyReviewEstimate";
import type {
  DailyTask,
  MyItemDetail,
} from "@/features/alquran/types/quran.types";
import { DailyReviewFlashcardModal } from "@/features/alquran/components/DailyReviewFlashcardModal";
import { DailyReviewJuzModal } from "@/features/alquran/components/DailyReviewJuzModal";
import { alquranService } from "../services/alquran.services";

const getTodayDateKey = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getReviewedStorageKeyByTaskDate = (taskDate: string) =>
  `alquran:daily-reviewed:${taskDate}`;

const getReviewedIdsForTaskDate = (taskDate: string): string[] => {
  try {
    const raw = localStorage.getItem(getReviewedStorageKeyByTaskDate(taskDate));
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
};

// Get deactivated Juz indexes from localStorage
const getDeactivatedJuzIndexes = (): Set<number> => {
  const deactivated = new Set<number>();
  for (let i = 1; i <= 30; i++) {
    const stored = localStorage.getItem(`juz_${i}_active`);
    if (stored !== null && JSON.parse(stored) === false) {
      deactivated.add(i);
    }
  }
  return deactivated;
};

export const DailyReviewSection = () => {
  const { getDaily } = useGetDaily();
  const { 
    loading: estimateLoading, 
    juzEstimates, 
    refetch: refetchEstimates 
  } = useDailyReviewEstimate();
  
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isJuzModalOpen, setIsJuzModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [selectedJuzEstimate, setSelectedJuzEstimate] = useState<JuzReviewEstimate | null>(null);
  const [itemStatusMap, setItemStatusMap] = useState<Map<string, string>>(
    () => new Map(),
  );
  const [deactivatedJuzIndexes, setDeactivatedJuzIndexes] = useState<
    Set<number>
  >(() => getDeactivatedJuzIndexes());
  const [reviewedItemsVersion, setReviewedItemsVersion] = useState(0);

  const refreshActiveItemIds = useCallback(async () => {
    try {
      const response = await alquranService.getMyItems("quran");

      // Build status map from all items
      const statusMap = new Map<string, string>();
      response.data.groups.forEach((group) => {
        group.items.forEach((item: MyItemDetail) => {
          statusMap.set(item.item_id, item.status);
        });
      });
      setItemStatusMap(statusMap);

      // Update deactivated Juz indexes
      setDeactivatedJuzIndexes(getDeactivatedJuzIndexes());
    } catch (refreshError) {
      console.error("Failed to refresh active item ids", refreshError);
    }
  }, []);

  useEffect(() => {
    const refetchDaily = () => {
      void getDaily().catch(() => undefined);
      void refreshActiveItemIds();
      void refetchEstimates();
    };

    refetchDaily();
    const safetyRefetchId = window.setTimeout(refetchDaily, 800);
    window.addEventListener(
      "alquran:daily-generated",
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
        "alquran:daily-generated",
        refetchDaily as EventListener,
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [getDaily, refreshActiveItemIds, refetchEstimates]);

  // Filter juz estimates by deactivated status and reviewed items
  const filteredJuzEstimates = useMemo(() => {
    const todayKey = getTodayDateKey();
    const reviewedIds = getReviewedIdsForTaskDate(todayKey);

    return juzEstimates
      .map((juz) => {
        // Filter out reviewed items from each juz
        const filteredItems = juz.items.filter(
          (item) => !reviewedIds.includes(item.item_id)
        );

        // Return updated juz with filtered items
        return {
          ...juz,
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
      .filter(
        (juz) =>
          !deactivatedJuzIndexes.has(juz.juz_index) && juz.itemCount > 0
      );
  }, [juzEstimates, deactivatedJuzIndexes, reviewedItemsVersion]);

  // Calculate total items and time
  const totalItems = filteredJuzEstimates.reduce(
    (sum, juz) => sum + juz.itemCount,
    0
  );

  const formatTotalTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}d`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const openJuzModal = (juzIndex: number) => {
    // Find the filtered juz estimate by index
    const filteredJuz = filteredJuzEstimates.find(
      (juz) => juz.juz_index === juzIndex
    );
    if (filteredJuz) {
      setSelectedJuzEstimate(filteredJuz);
      setIsJuzModalOpen(true);
    }
  };

  const openFlashcard = (task: DailyTask) => {
    // Enrich task with item status from the API
    const enrichedTask: DailyTask = {
      ...task,
      status: itemStatusMap.get(task.item_id) || task.status,
    };
    setSelectedTask(enrichedTask);
    setIsFlashcardOpen(true);
    setIsJuzModalOpen(false);
  };

  const handleReviewed = async () => {
    const reviewedItemId = selectedTask?.item_id;
    const reviewedTaskDate = selectedTask?.task_date ?? getTodayDateKey();
    const reviewedStorageKey =
      getReviewedStorageKeyByTaskDate(reviewedTaskDate);

    const reviewedIds = getReviewedIdsForTaskDate(reviewedTaskDate);
    if (reviewedItemId && !reviewedIds.includes(reviewedItemId)) {
      localStorage.setItem(
        reviewedStorageKey,
        JSON.stringify([...reviewedIds, reviewedItemId]),
      );
      // Trigger re-render of filteredJuzEstimates
      setReviewedItemsVersion((prev) => prev + 1);
    }

    await getDaily();
    await refetchEstimates();
  };

  return (
    <div className="mb-8 animate-fadeIn relative">
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 blur-2xl bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl opacity-50 pointer-events-none" />

      <div className="relative bg-linear-to-br from-[#1A222C] to-[#0F141A] rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl shadow-emerald-900/20">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400" />

        <div className="p-6 md:p-8">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 transform -rotate-3">
                <Flame className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-2">
                  <Star className="w-3.5 h-3.5" /> Prioritas Utama
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                  Target Review Hari Ini
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                  Ada{" "}
                  <strong className="text-emerald-400">
                    {totalItems} item
                  </strong>{" "}
                  di{" "}
                  <strong className="text-emerald-400">
                    {filteredJuzEstimates.length} Juz
                  </strong>{" "}
                  yang menunggu untuk direview.
                </p>
              </div>
            </div>

            {filteredJuzEstimates.length > 0 && (
              <button
                onClick={() => {
                  const firstJuz = filteredJuzEstimates[0];
                  if (firstJuz.items.length > 0) {
                    const task: DailyTask = {
                      item_id: firstJuz.items[0].item_id,
                      source: "interval_review",
                      state: "pending",
                      task_date: getTodayDateKey(),
                      content_ref: firstJuz.items[0].content_ref,
                      juz_index: firstJuz.juz_index,
                      status: firstJuz.items[0].status,
                    };
                    openFlashcard(task);
                  }
                }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0B0E14] font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-current" />
                Gas Review!
              </button>
            )}
          </div>

          {/* Juz Cards Grid */}
          {estimateLoading && (
            <p className="text-sm text-gray-400">Memuat target harian...</p>
          )}
          {!estimateLoading && filteredJuzEstimates.length === 0 && (
            <p className="text-sm text-gray-400">
              Belum ada target review untuk hari ini.
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredJuzEstimates.map((juz, index) => (
              <button
                key={juz.juz_id}
                onClick={() => openJuzModal(juz.juz_index)}
                className="group relative overflow-hidden rounded-xl p-5 bg-[#161D26] border border-white/10 hover:bg-[#1A222C] hover:border-emerald-500/40 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                          Juz {juz.juz_index}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {juz.itemCount} item
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-sm">
                      {formatTotalTime(juz.totalEstimatedSeconds)}
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

      {/* Juz Modal - Shows items within a Juz */}
      <DailyReviewJuzModal
        isOpen={isJuzModalOpen}
        juzEstimate={selectedJuzEstimate}
        onClose={() => setIsJuzModalOpen(false)}
        onItemSelected={openFlashcard}
      />

      {/* Flashcard Modal - For reviewing individual items */}
      <DailyReviewFlashcardModal
        key={`${selectedTask?.item_id ?? "no-item"}-${isFlashcardOpen ? "open" : "close"}`}
        isOpen={isFlashcardOpen}
        task={selectedTask}
        onClose={() => setIsFlashcardOpen(false)}
        onReviewed={handleReviewed}
      />
    </div>
  );
};
