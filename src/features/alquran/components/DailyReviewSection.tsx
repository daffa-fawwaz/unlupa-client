import {
  Play,
  Flame,
  Star,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetDaily } from "@/features/alquran/hooks/useGetDaily";
import type {
  DailyTask,
  ReviewIntervalResponse,
} from "@/features/alquran/types/quran.types";
import { DailyReviewFlashcardModal } from "@/features/alquran/components/DailyReviewFlashcardModal";
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

export const DailyReviewSection = () => {
  const { data, loading, error, getDaily } = useGetDaily();
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [hiddenTaskKeys, setHiddenTaskKeys] = useState<string[]>([]);
  const [activeItemIds, setActiveItemIds] = useState<Set<string>>(
    () => new Set(),
  );

  const refreshActiveItemIds = useCallback(async () => {
    try {
      const response = await alquranService.getMyItems("quran");
      const ids = response.data.groups.flatMap((group) =>
        group.items.map((item) => item.item_id),
      );
      setActiveItemIds(new Set(ids));
    } catch (refreshError) {
      console.error("Failed to refresh active item ids", refreshError);
    }
  }, []);

  useEffect(() => {
    const refetchDaily = () => {
      void getDaily().catch(() => undefined);
      void refreshActiveItemIds();
    };

    refetchDaily();
    const safetyRefetchId = window.setTimeout(refetchDaily, 800);
    window.addEventListener("alquran:daily-generated", refetchDaily as EventListener);
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
  }, [getDaily, refreshActiveItemIds]);

  const mapSourceToType = (source: string) => {
    switch (source) {
      case "interval_review":
        return "Murajaah";
      case "new_memorization":
        return "Hafalan Baru";
      default:
        return "Ziyadah";
    }
  };

  const dailyReviewItems = useMemo(
    () =>
      data
        .filter((task) => {
          if (task.state !== "pending") return false;
          if (!activeItemIds.has(task.item_id)) return false;
          const reviewedIds = getReviewedIdsForTaskDate(task.task_date);
          const isPersistedReviewed = reviewedIds.includes(task.item_id);
          const localKey = `${task.task_date}:${task.item_id}`;
          const isLocallyHidden = hiddenTaskKeys.includes(localKey);
          return !isPersistedReviewed && !isLocallyHidden;
        })
        .map((task: DailyTask) => {
          const status = task.state === "pending" ? "pending" : "completed";
          const urgency =
            task.state === "pending"
              ? task.source === "interval_review"
                ? "high"
                : "medium"
              : "low";
          const title = task.juz_index > 0 ? `Juz ${task.juz_index}` : "Review";
          const range =
            task.content_ref && task.content_ref.trim().length > 0
              ? task.content_ref
              : `Task ${task.task_date}`;

          return {
            id: task.item_id,
            task,
            title,
            range,
            type: mapSourceToType(task.source),
            urgency,
            status,
          };
        }),
    [activeItemIds, data, hiddenTaskKeys],
  );

  const pendingCount = dailyReviewItems.filter((i) => i.status === "pending")
    .length;
  const firstPendingTask = dailyReviewItems.find(
    (item) => item.status === "pending",
  )?.task;

  const openFlashcard = (task: DailyTask) => {
    setSelectedTask(task);
    setIsFlashcardOpen(true);
  };

  const handleReviewed = async (result: ReviewIntervalResponse) => {
    const reviewedItemId = result.data.item_id;
    const reviewedTaskDate = selectedTask?.task_date ?? getTodayDateKey();
    const reviewedStorageKey = getReviewedStorageKeyByTaskDate(reviewedTaskDate);
    const localKey = `${reviewedTaskDate}:${reviewedItemId}`;

    const reviewedIds = getReviewedIdsForTaskDate(reviewedTaskDate);
    if (!reviewedIds.includes(reviewedItemId)) {
      localStorage.setItem(
        reviewedStorageKey,
        JSON.stringify([...reviewedIds, reviewedItemId]),
      );
    }

    setHiddenTaskKeys((prev) => {
      if (prev.includes(localKey)) {
        return prev;
      }
      const next = [...prev, localKey];
      return next;
    });

    await getDaily();
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
                    {pendingCount} flashcard
                  </strong>{" "}
                  yang menunggu untuk direview. Pertahankan streak hafalanmu
                  agar tidak lupa!
                </p>
              </div>
            </div>

            <button
              disabled={pendingCount === 0}
              onClick={() => {
                if (firstPendingTask) {
                  openFlashcard(firstPendingTask);
                }
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/40 disabled:text-gray-300 text-[#0B0E14] font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0 whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-current" />
              Gas Review Semua!
            </button>
          </div>

          {/* Items List */}
          {loading && (
            <p className="text-sm text-gray-400">Memuat target harian...</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && dailyReviewItems.length === 0 && (
            <p className="text-sm text-gray-400">
              Belum ada target review untuk hari ini.
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-4 mt-2">
            {dailyReviewItems.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center justify-between p-4 md:p-5 rounded-xl border transition-all duration-300 ${
                  item.status === "completed"
                    ? "bg-[#0B0E14]/50 border-emerald-500/20 opacity-60"
                    : "bg-[#161D26] border-white/10 hover:bg-[#1A222C] hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
                }`}
                onClick={() => {
                  if (item.status === "pending") {
                    openFlashcard(item.task);
                  }
                }}
              >
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  {/* Status Icon */}
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : item.urgency === "high"
                          ? "bg-red-500/10 text-red-500"
                          : item.urgency === "medium"
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {item.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <AlertCircle
                        className={`w-5 h-5 md:w-6 md:h-6 ${item.urgency === "high" ? "animate-pulse" : ""}`}
                      />
                    )}
                  </div>

                  <div className="min-w-0 pr-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3
                        className={`text-lg md:text-xl font-bold truncate ${item.status === "completed" ? "text-gray-400" : "text-white group-hover:text-emerald-400 transition-colors"}`}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                          item.type === "Murajaah"
                            ? "bg-blue-500/20 text-blue-400"
                            : item.type === "Hafalan Baru"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-teal-500/20 text-teal-400"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm font-medium truncate">
                      {item.range}
                    </p>
                  </div>
                </div>

                {item.status !== "completed" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-[#0B0E14] text-gray-400 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
