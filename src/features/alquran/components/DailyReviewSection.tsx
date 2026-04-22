import { useEffect, useMemo, useState, useCallback } from "react";
import { Flame, Star, Clock, BookOpen, Play, CheckCircle2 } from "lucide-react";
import { useDailyReviewEstimate, type JuzReviewEstimate } from "@/features/alquran/hooks/useDailyReviewEstimate";
import type { DailyTask, MyItemDetail } from "@/features/alquran/types/quran.types";
import { DailyReviewFlashcardModal } from "@/features/alquran/components/DailyReviewFlashcardModal";
import { alquranService } from "../services/alquran.services";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const formatEstimate = (seconds: number): string => {
  if (seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}d`;
  return `${Math.round(seconds / 60)} mnt`;
};

const getTodayDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/* ------------------------------------------------------------------ */
/* Main Section                                                         */
/* ------------------------------------------------------------------ */
export const DailyReviewSection = () => {
  const { loading, juzEstimates, refetch: refetchEstimates } = useDailyReviewEstimate();

  const [itemStatusMap, setItemStatusMap] = useState<Map<string, string>>(new Map());
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Flashcard queue state
  const [activeJuz, setActiveJuz] = useState<JuzReviewEstimate | null>(null);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);

  const refreshStatuses = useCallback(async () => {
    try {
      const response = await alquranService.getMyItems("quran");
      const map = new Map<string, string>();
      response.data.groups.forEach((group) => {
        group.items.forEach((item: MyItemDetail) => {
          map.set(item.item_id, item.status);
        });
      });
      setItemStatusMap(map);
    } catch {
      // silent
    }
  }, []);

  // Fetch daily tasks to get completed state from API
  const refreshDailyState = useCallback(async () => {
    try {
      const response = await alquranService.getDaily();
      const completed = new Set(
        response.filter((t) => t.state === "completed").map((t) => t.item_id),
      );
      setReviewedIds(completed);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const init = () => {
      void refetchEstimates();
      void refreshStatuses();
      void refreshDailyState();
    };
    init();

    const onGenerated = () => init();
    const onVisible = () => { if (document.visibilityState === "visible") init(); };

    window.addEventListener("alquran:daily-generated", onGenerated);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("alquran:daily-generated", onGenerated);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refetchEstimates, refreshStatuses, refreshDailyState]);

  // Filter reviewed items using component state (sourced from API)
  const filteredJuzGroups = useMemo(() => {
    return juzEstimates
      .map((juz) => {
        const items = juz.items.filter((item) => !reviewedIds.has(item.item_id));
        const totalEstimatedSeconds = items.reduce((s, i) => s + (i.estimatedReviewSeconds || 0), 0);
        return { ...juz, items, itemCount: items.length, totalEstimatedSeconds };
      })
      .filter((juz) => juz.itemCount > 0);
  }, [juzEstimates, reviewedIds]);

  const totalItems = filteredJuzGroups.reduce((s, j) => s + j.itemCount, 0);

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */
  const openJuz = (juz: JuzReviewEstimate, startIndex = 0) => {
    setActiveJuz(juz);
    setQueueIndex(startIndex);
    setIsFlashcardOpen(true);
  };

  const currentTask: DailyTask | null =
    activeJuz && activeJuz.items[queueIndex]
      ? {
          item_id: activeJuz.items[queueIndex].item_id,
          source: "interval_review",
          state: "pending",
          task_date: getTodayDateKey(),
          content_ref: activeJuz.items[queueIndex].content_ref,
          juz_index: activeJuz.juz_index,
          status: itemStatusMap.get(activeJuz.items[queueIndex].item_id) || activeJuz.items[queueIndex].status,
        }
      : null;

  const handleReviewed = async () => {
    if (!activeJuz) return;

    const reviewedId = activeJuz.items[queueIndex]?.item_id;

    // Mark as reviewed in component state
    if (reviewedId) {
      setReviewedIds((prev) => new Set([...prev, reviewedId]));
    }

    // Find next unreviewed item
    const updatedReviewed = new Set([...reviewedIds, reviewedId ?? ""]);
    const remaining = activeJuz.items.filter((qi) => !updatedReviewed.has(qi.item_id));

    if (remaining.length > 0) {
      const nextIdx = activeJuz.items.findIndex((qi) => qi.item_id === remaining[0].item_id);
      setQueueIndex(nextIdx >= 0 ? nextIdx : queueIndex + 1);
    } else {
      setIsFlashcardOpen(false);
      setActiveJuz(null);
    }

    void refetchEstimates();
  };

  const handleClose = () => {
    setIsFlashcardOpen(false);
    setActiveJuz(null);
    setQueueIndex(0);
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mb-8 animate-fadeIn relative">
      <div className="absolute -inset-1 blur-2xl bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl opacity-50 pointer-events-none" />

      <div className="relative bg-linear-to-br from-[#1A222C] to-[#0F141A] rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl shadow-emerald-900/20">
        <div className="h-1 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400" />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 border-b border-white/5 pb-6">
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
                <strong className="text-emerald-400">{totalItems} item</strong>{" "}
                di{" "}
                <strong className="text-emerald-400">{filteredJuzGroups.length} Juz</strong>{" "}
                yang menunggu untuk direview.
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-sm text-gray-400 animate-pulse">Memuat target harian...</p>
          )}

          {/* Empty */}
          {!loading && filteredJuzGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-bold mb-1">Semua sudah direview!</p>
              <p className="text-gray-400 text-sm">Tidak ada review tersisa hari ini.</p>
            </div>
          )}

          {/* Juz Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredJuzGroups.map((juz, index) => (
              <div
                key={juz.juz_id}
                className="group relative overflow-hidden rounded-xl bg-[#161D26] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500 pointer-events-none" />

                <div className="relative z-10 p-5">
                  {/* Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <BookOpen className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                        Juz {juz.juz_index}
                      </h3>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-emerald-300 font-bold text-sm">{juz.itemCount} item</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>~{formatEstimate(juz.totalEstimatedSeconds)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => openJuz(juz)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B0E14] font-bold text-xs transition-all shrink-0 shadow-md shadow-emerald-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Gas Review!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flashcard Modal */}
      {isFlashcardOpen && currentTask && activeJuz && (
        <DailyReviewFlashcardModal
          key={`${currentTask.item_id}-${queueIndex}`}
          isOpen={isFlashcardOpen}
          task={currentTask}
          queuePosition={queueIndex + 1}
          queueTotal={activeJuz.items.length}
          onClose={handleClose}
          onReviewed={handleReviewed}
        />
      )}
    </div>
  );
};
