import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Star,
  BookOpen,
  Layers,
  FolderOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { FlameBurst } from "@/components/ui/FlameBurst";
import { useGetDailyBooks } from "@/features/personal/hooks/useGetDailyBooks";
import { useParentGroupedReview } from "@/features/personal/hooks/useParentGroupedReview";
import { BookDailyReviewFlashcardModal } from "@/features/personal/components/BookDailyReviewFlashcardModal";
import { personalService } from "@/features/personal/services/personal.services";
import { invalidateBookTreeCache } from "@/features/personal/hooks/useBookTree";
import type { BookDailyTask, ParentGroup } from "@/features/personal/types/personal.types";

const ParentIcon = ({ type }: { type: ParentGroup["parent_type"] }) => {
  if (type === "submodule") return <Layers className="w-6 h-6 text-primary" />;
  if (type === "module") return <FolderOpen className="w-6 h-6 text-primary" />;
  return <BookOpen className="w-6 h-6 text-primary" />;
};

const formatEstimate = (seconds: number): string => {
  if (seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}d`;
  return `${Math.round(seconds / 60)} mnt`;
};

export const BookDailyReviewSection = () => {
  const { getDaily, data: dailyTasks } = useGetDailyBooks();
  const { loading, groups, buildGroups } = useParentGroupedReview();

  const [activeGroup, setActiveGroup] = useState<ParentGroup | null>(null);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  // Track reviewed item IDs in component state (session-only, cleared on reload)
  // This is intentional: on reload, fresh data comes from API
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      try {
        await personalService.generateDailyBooks();
        const tasks = await getDaily();
        // Pre-populate reviewed IDs from API state field
        if (Array.isArray(tasks)) {
          const completed = new Set(
            tasks
              .filter((t) => t.state === "done" || t.state === "completed")
              .map((t) => t.item_id),
          );
          setReviewedIds(completed);
        }
      } catch {
        // silent
      }
    };
    void init();

    const onGenerated = () => void init();
    const onVisible = () => { if (document.visibilityState === "visible") void init(); };

    window.addEventListener("books:daily-generated", onGenerated);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("books:daily-generated", onGenerated);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [getDaily]);

  useEffect(() => {
    if (dailyTasks && dailyTasks.length > 0) {
      // Also sync reviewed IDs from API data
      const completed = new Set(
        dailyTasks.filter((t) => t.state === "done" || t.state === "completed").map((t) => t.item_id),
      );
      setReviewedIds(completed);
      void buildGroups(dailyTasks);
    }
  }, [dailyTasks, buildGroups]);

  const filteredGroups = useMemo(() => {
    return groups
      .map((g) => {
        const items = g.items.filter((qi) => !reviewedIds.has(qi.item_id));
        const totalEstimatedSeconds = items.reduce((s, qi) => s + qi.estimatedSeconds, 0);
        return { ...g, items, totalEstimatedSeconds };
      })
      .filter((g) => g.items.length > 0);
  }, [groups, reviewedIds]);

  const totalItems = filteredGroups.reduce((s, g) => s + g.items.length, 0);

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

    const reviewedId = activeGroup.items[queueIndex]?.item_id;

    // Mark as reviewed in component state immediately (optimistic)
    if (reviewedId) {
      setReviewedIds((prev) => new Set([...prev, reviewedId]));
    }

    // Invalidate tree cache so review_count & stability are fresh
    invalidateBookTreeCache(activeGroup.book_id);

    // Find next unreviewed item
    const updatedReviewed = new Set([...reviewedIds, reviewedId ?? ""]);
    const remaining = activeGroup.items.filter((qi) => !updatedReviewed.has(qi.item_id));

    if (remaining.length > 0) {
      const nextIdx = activeGroup.items.findIndex((qi) => qi.item_id === remaining[0].item_id);
      setQueueIndex(nextIdx >= 0 ? nextIdx : queueIndex + 1);
    } else {
      const currentGroupIndex = filteredGroups.findIndex(
        (group) => group.parent_id === activeGroup.parent_id,
      );
      const nextGroup = filteredGroups
        .slice(currentGroupIndex + 1)
        .map((group) => {
          const items = group.items.filter((item) => !updatedReviewed.has(item.item_id));
          const totalEstimatedSeconds = items.reduce(
            (sum, item) => sum + item.estimatedSeconds,
            0,
          );
          return { ...group, items, totalEstimatedSeconds };
        })
        .find((group) => group.items.length > 0);

      if (nextGroup) {
        setActiveGroup(nextGroup);
        setQueueIndex(0);
        setIsFlashcardOpen(true);
      } else {
        setIsFlashcardOpen(false);
        setActiveGroup(null);
      }
    }

    // Re-generate to invalidate server cache, then fetch fresh state
    try {
      await personalService.generateDailyBooks();
      const tasks = await getDaily();
      if (Array.isArray(tasks)) {
        const done = new Set(
          tasks
            .filter((t) => t.state === "done" || t.state === "completed")
            .map((t) => t.item_id),
        );
        setReviewedIds(done);
      }
    } catch {
      // optimistic update already applied above
    }
  };

  const handleFlashcardClose = () => {
    setIsFlashcardOpen(false);
    setActiveGroup(null);
    setQueueIndex(0);
  };

  return (
    <div className="mb-16 md:mb-24 animate-fadeIn relative">
      <div className="relative bg-card rounded-xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-primary" />

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8 border-b border-border pb-6">
            <FlameBurst solid />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-2">
                <Star className="w-3.5 h-3.5" /> Review Harian
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">
                Target Review Buku Hari Ini
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                Ada{" "}
                <strong className="text-primary">{totalItems} item</strong>{" "}
                di{" "}
                <strong className="text-primary">{filteredGroups.length} wadah</strong>{" "}
                yang menunggu untuk direview.
              </p>
            </div>
          </div>

          {loading && <p className="text-sm text-muted-foreground animate-pulse">Memuat target harian...</p>}

          {!loading && filteredGroups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-bold mb-1">Semua sudah direview!</p>
              <p className="text-muted-foreground text-sm">Tidak ada review tersisa hari ini.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredGroups.map((group, index) => (
              <div
                key={group.parent_id}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/40 transition-colors hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <ParentIcon type={group.parent_type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors truncate leading-tight">
                        {group.parent_title}
                      </h3>
                      {group.parent_type !== "book" && (
                        <p className="text-muted-foreground text-xs truncate mt-0.5">{group.book_title}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span className="text-primary font-bold text-sm">{group.items.length} item</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>~{formatEstimate(group.totalEstimatedSeconds)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openGroup(group)}
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

      {isFlashcardOpen && currentTask && activeGroup && (
        <BookDailyReviewFlashcardModal
          key={currentTask.item_id}
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
