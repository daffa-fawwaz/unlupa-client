import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock, Play, Star } from "lucide-react";
import { FlameBurst } from "@/components/ui/FlameBurst";
import { alquranService } from "@/features/alquran/services/alquran.services";
import { DailyReviewFlashcardModal } from "@/features/alquran/components/DailyReviewFlashcardModal";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";
import { useDailyReviewEstimate, type JuzReviewEstimate } from "@/features/alquran/hooks/useDailyReviewEstimate";
import type { DailyTask, DailyTaskGroup, MyItemDetail } from "@/features/alquran/types/quran.types";

const formatEstimate = (seconds: number): string => {
  if (seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}d`;
  return `${Math.round(seconds / 60)} mnt`;
};

const getTodayDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export const QuranClassDailyReviewSection = ({ classId }: { classId: string }) => {
  const { loading, juzEstimates, refetch: refetchEstimates } =
    useDailyReviewEstimate(classId);

  const [itemStatusMap, setItemStatusMap] = useState<Map<string, string>>(new Map());
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [activeJuz, setActiveJuz] = useState<JuzReviewEstimate | null>(null);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);

  const refreshStatuses = useCallback(async () => {
    try {
      const response = await alquranService.getMyItems("quran", classId);
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
  }, [classId]);

  const refreshDailyState = useCallback(async () => {
    try {
      const response: DailyTaskGroup[] = await alquranService.getClassDaily(classId);
      const completed = new Set(
        response
          .flatMap((group) => group.items)
          .filter((t) => t.state === "completed" || t.state === "done")
          .map((t) => t.item_id),
      );
      setReviewedIds(completed);
    } catch {
      // silent
    }
  }, [classId]);

  useEffect(() => {
    const init = () => {
      void refetchEstimates();
      void refreshStatuses();
      void refreshDailyState();
    };

    init();

    const onVisible = () => {
      if (document.visibilityState === "visible") init();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refetchEstimates, refreshStatuses, refreshDailyState]);

  const filteredJuzGroups = useMemo(() => {
    return juzEstimates
      .map((juz) => {
        const items = juz.items.filter((item) => !reviewedIds.has(item.item_id));
        const totalEstimatedSeconds = items.reduce(
          (s, i) => s + (i.estimatedReviewSeconds || 0),
          0,
        );
        return { ...juz, items, itemCount: items.length, totalEstimatedSeconds };
      })
      .filter((juz) => juz.itemCount > 0);
  }, [juzEstimates, reviewedIds]);

  const totalItems = filteredJuzGroups.reduce((sum, juz) => sum + juz.itemCount, 0);

  const currentTask: DailyTask | null =
    activeJuz && activeJuz.items[queueIndex]
      ? {
          item_id: activeJuz.items[queueIndex].item_id,
          source: "interval_review",
          state: "pending",
          task_date: getTodayDateKey(),
          content_ref: activeJuz.items[queueIndex].content_ref,
          juz_index: activeJuz.juz_index,
          status:
            activeJuz.items[queueIndex].status ||
            itemStatusMap.get(activeJuz.items[queueIndex].item_id) ||
            "",
        }
      : null;

  const openJuz = (juz: JuzReviewEstimate, startIndex = 0) => {
    setActiveJuz(juz);
    setQueueIndex(startIndex);
    setIsFlashcardOpen(true);
  };

  const handleReviewed = async () => {
    if (!activeJuz) return;

    const reviewedId = activeJuz.items[queueIndex]?.item_id;
    const nextReviewed = new Set(reviewedIds);

    if (reviewedId) {
      nextReviewed.add(reviewedId);
      setReviewedIds(nextReviewed);
    }

    const remaining = activeJuz.items.filter((qi) => !nextReviewed.has(qi.item_id));

    if (remaining.length > 0) {
      const nextIdx = activeJuz.items.findIndex((qi) => qi.item_id === remaining[0].item_id);
      setQueueIndex(nextIdx >= 0 ? nextIdx : queueIndex + 1);
    } else {
      const currentGroupIndex = filteredJuzGroups.findIndex(
        (juz) => juz.juz_id === activeJuz.juz_id,
      );
      const nextJuz = filteredJuzGroups
        .slice(currentGroupIndex + 1)
        .map((juz) => {
          const items = juz.items.filter((item) => !nextReviewed.has(item.item_id));
          const totalEstimatedSeconds = items.reduce(
            (sum, item) => sum + (item.estimatedReviewSeconds || 0),
            0,
          );
          return { ...juz, items, itemCount: items.length, totalEstimatedSeconds };
        })
        .find((juz) => juz.itemCount > 0);

      if (nextJuz) {
        setActiveJuz(nextJuz);
        setQueueIndex(0);
        setIsFlashcardOpen(true);
      } else {
        setIsFlashcardOpen(false);
        setActiveJuz(null);
      }
    }

    void refetchEstimates();
  };

  const handleClose = () => {
    setIsFlashcardOpen(false);
    setActiveJuz(null);
    setQueueIndex(0);
  };

  return (
    <section className="relative mb-8 animate-fadeIn">
      <div className="relative bg-card rounded-xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-primary" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8 border-b border-border pb-6">
            <FlameBurst solid />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-2">
                <Star className="w-3.5 h-3.5" /> Review Kelas
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">
                Target Review Kelas Hari Ini
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                Ada{" "}
                <strong className="text-primary">{totalItems} item</strong>{" "}
                di{" "}
                <strong className="text-primary">{filteredJuzGroups.length} Juz</strong>{" "}
                yang menunggu untuk direview di kelas ini.
              </p>
            </div>
          </div>

          {loading && <p className="text-sm text-muted-foreground animate-pulse">Memuat target harian...</p>}

          {!loading && filteredJuzGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <p className="text-foreground font-bold mb-1">Semua sudah direview!</p>
              <p className="text-muted-foreground text-sm">Tidak ada review kelas tersisa hari ini.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredJuzGroups.map((juz, index) => (
              <div
                key={juz.juz_id}
                className="group relative w-full max-w-full overflow-hidden rounded-xl bg-surface-1 border border-border hover:border-primary/40 transition-colors hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                        Juz {juz.juz_index}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        {juz.itemCount} item di dalam wadah ini
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {juz.items.slice(0, 4).map((item, itemIndex) => {
                      const parsed = item.content_ref ? parseContentRef(item.content_ref) : null;
                      return (
                        <span
                          key={item.item_id}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1 text-[11px] text-foreground"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">
                            {itemIndex + 1}
                          </span>
                          <span className="max-w-[11rem] truncate">
                            {parsed?.title || item.content_ref || `Item ${itemIndex + 1}`}
                          </span>
                        </span>
                      );
                    })}
                    {juz.itemCount > 4 && (
                      <span className="inline-flex items-center rounded-full border border-border bg-surface-1 px-3 py-1 text-[11px] text-muted-foreground">
                        +{juz.itemCount - 4} item lagi
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span className="text-primary font-bold text-sm">
                          {juz.itemCount} item siap review
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>~{formatEstimate(juz.totalEstimatedSeconds)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => openJuz(juz)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-colors shrink-0"
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

      {isFlashcardOpen && currentTask && activeJuz && (
        <DailyReviewFlashcardModal
          key={currentTask.item_id}
          isOpen={isFlashcardOpen}
          task={currentTask}
          queuePosition={queueIndex + 1}
          queueTotal={activeJuz.items.length}
          onClose={handleClose}
          onReviewed={handleReviewed}
        />
      )}
    </section>
  );
};
