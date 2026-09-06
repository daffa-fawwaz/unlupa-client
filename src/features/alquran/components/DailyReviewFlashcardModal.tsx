import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  Check,
  Loader2,
  RotateCw,
  X,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import type {
  DailyTask,
  ReviewIntervalResponse,
  ReviewFsrsResponse,
} from "@/features/alquran/types/quran.types";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";
import { useReviewFsrs } from "@/features/alquran/hooks/useReviewFsrs";
import { useReviewInterval } from "@/features/alquran/hooks/useReviewInterval";

interface DailyReviewFlashcardModalProps {
  isOpen: boolean;
  task: DailyTask | null;
  queuePosition?: number;
  queueTotal?: number;
  onClose: () => void;
  onReviewed: (
    result: ReviewIntervalResponse | ReviewFsrsResponse,
  ) => Promise<void> | void;
}

const REVIEW_BUTTONS = [
  {
    id: 1 as const,
    payloadValue: 1 as const,
    header: "Lemah",
    emoji: "😰",
    descriptions: ["Blank", "Banyak Lupa", "Berpikir Lama", "Banyak Salah"],
    bg: "bg-destructive/10 border-destructive/50 hover:bg-destructive/15",
    headerBg: "bg-destructive",
    headerText: "text-destructive-foreground",
    dot: "bg-destructive",
    textColor: "text-destructive",
  },
  {
    id: 2 as const,
    payloadValue: 2 as const,
    header: "Sedang",
    emoji: "😐",
    descriptions: ["Sering Lupa", "Sering Salah", "Tersendat", "Lambat"],
    bg: "bg-warning/10 border-warning/50 hover:bg-warning/15",
    headerBg: "bg-warning",
    headerText: "text-warning-foreground",
    dot: "bg-warning",
    textColor: "text-warning",
  },
  {
    id: 3 as const,
    payloadValue: 3 as const,
    header: "Baik",
    emoji: "😊",
    descriptions: ["Lancar", "Cepat", "Yakin", "Benar"],
    bg: "bg-success/10 border-success/50 hover:bg-success/15",
    headerBg: "bg-success",
    headerText: "text-success-foreground",
    dot: "bg-success",
    textColor: "text-success",
  },
  {
    id: 4 as const,
    payloadValue: 4 as const,
    header: "Sempurna",
    emoji: "🔥",
    descriptions: ["Reflek", "Tanpa Salah", "Sangat Lancar", "Sempurna"],
    bg: "bg-info/10 border-info/50 hover:bg-info/15",
    headerBg: "bg-info",
    headerText: "text-info-foreground",
    dot: "bg-info",
    textColor: "text-info",
  },
] as const;

export const DailyReviewFlashcardModal = ({
  isOpen,
  task,
  queuePosition = 1,
  queueTotal = 1,
  onClose,
  onReviewed,
}: DailyReviewFlashcardModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [submittingButtonId, setSubmittingButtonId] = useState<
    1 | 2 | 3 | 4 | null
  >(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nextIntervalDays, setNextIntervalDays] = useState(0);
  const [nextReviewDate, setNextReviewDate] = useState("");

  const { reviewFsrs, loading: loadingFsrs } = useReviewFsrs();
  const { reviewInterval, loading: loadingInterval } = useReviewInterval();

  useEffect(() => {
    if (!isOpen || !task) return;
    setIsFlipped(false);
    setSubmittingButtonId(null);
    setShowSuccessModal(false);
  }, [task, isOpen]);

  useEffect(() => {
    if (!showSuccessModal) return;

    const timer = window.setTimeout(() => {
      setShowSuccessModal(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [showSuccessModal]);

  if (!isOpen || !task) return null;

  const info = task.content_ref ? parseContentRef(task.content_ref) : null;
  const title =
    info?.title || task.content_ref || `Item ${queuePosition}`;
  const subtitle = info?.subtitle || task.content_ref || "";

  const itemStatus = task.status?.toLowerCase() || "";
  const useFsrsReview =
    itemStatus === "fsrs_active" ||
    itemStatus === "graduated" ||
    itemStatus === "graduate";
  const loading = useFsrsReview ? loadingFsrs : loadingInterval;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const progressPct = Math.round((queuePosition / queueTotal) * 100);

  const handleRatingClick = async (btn: (typeof REVIEW_BUTTONS)[number]) => {
    if (loading || submittingButtonId !== null) return;
    setSubmittingButtonId(btn.id);

    try {
      let response: ReviewIntervalResponse | ReviewFsrsResponse;

      if (useFsrsReview) {
        response = await reviewFsrs(
          task.item_id,
          btn.payloadValue as 1 | 2 | 3 | 4,
        );
        const fsrsData = (response as ReviewFsrsResponse).data;
        if (
          fsrsData &&
          typeof fsrsData === "object" &&
          "next_review_at" in fsrsData
        ) {
          setNextReviewDate(formatDate(fsrsData.next_review_at as string));
          setNextIntervalDays((fsrsData.next_interval_days as number) || 1);
        }
      } else {
        const intervalRating = Math.min(btn.payloadValue, 3) as 1 | 2 | 3;
        response = await reviewInterval(task.item_id, intervalRating);
        const intervalData = (response as ReviewIntervalResponse).data;
        if (intervalData?.interval_next_review_at) {
          setNextReviewDate(formatDate(intervalData.interval_next_review_at));
          setNextIntervalDays(intervalData.interval_days || 1);
        }
      }

      await onReviewed(response);

      window.dispatchEvent(
        new CustomEvent("alquran:item-reviewed", {
          detail: { itemId: task.item_id, rating: btn.payloadValue },
        }),
      );

      setShowSuccessModal(true);
    } catch {
      // error handled by hooks
    } finally {
      setSubmittingButtonId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {queueTotal > 1 && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden max-w-[200px]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-success to-success/70 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium shrink-0">
                {queuePosition}/{queueTotal}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-surface-1 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors ml-3 shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slide panels */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className={`absolute inset-0 flex transition-transform duration-500 ease-in-out ${isFlipped ? "-translate-x-1/2" : "translate-x-0"}`}
          style={{ width: "200%" }}
        >
          {/* FRONT — Question */}
          <div className="w-1/2 h-full flex flex-col bg-background">
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-8 md:px-16 py-8 max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-success" />
                </div>
                <span className="px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold tracking-wider uppercase">
                  Pertanyaan
                </span>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl border border-success/20 bg-surface-1 mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider">
                  <span className="px-3 py-1 rounded-full bg-surface-1 border border-border text-muted-foreground">
                    Juz {task.juz_index}
                  </span>
                  {queueTotal > 1 && (
                    <span className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success">
                      Item {queuePosition} dari {queueTotal}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-snug wrap-break-word mb-2">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-success/80 text-base sm:text-lg wrap-break-word">
                    {subtitle}
                  </p>
                )}
                {!info && task.content_ref && (
                  <p className="mt-3 text-xs text-muted-foreground font-mono break-all">
                    {task.content_ref}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span>{task.task_date}</span>
              </div>
            </div>

            <div className="px-4 sm:px-8 md:px-16 pb-6 pt-3 max-w-3xl mx-auto w-full shrink-0 border-t border-border bg-background">
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-success/10 border border-success/30 text-success font-bold text-base hover:bg-success/15 transition-colors"
              >
                <RotateCw className="w-5 h-5" />
                Lihat Jawaban
              </button>
            </div>
          </div>

          {/* BACK — Answer + Feedback */}
          <div className="w-1/2 h-full flex flex-col bg-background">
            <div className="flex-1 flex flex-col px-4 sm:px-8 md:px-16 py-8 max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-info" />
                </div>
                <span className="px-3 py-1 rounded-full bg-info/10 text-info border border-info/20 text-xs font-bold tracking-wider uppercase">
                  Nilai Hafalan
                </span>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Pertanyaan
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-black text-foreground mb-1">
                  Seberapa kuat hafalanmu?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Pilih satu — nilai langsung tersimpan.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {REVIEW_BUTTONS.map((btn) => {
                  const isSubmitting = submittingButtonId === btn.id;
                  return (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => void handleRatingClick(btn)}
                      disabled={submittingButtonId !== null}
                      className={`relative overflow-hidden rounded-2xl border-2 flex flex-col text-left transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none ${btn.bg} ${btn.textColor}`}
                    >
                      <div
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-black uppercase tracking-wide border-b border-black/10 ${btn.headerBg} ${btn.headerText}`}
                      >
                        <span>{btn.emoji}</span>
                        <span>{btn.header}</span>
                      </div>
                      <div className="flex-1 p-3">
                        {isSubmitting ? (
                          <div className="flex flex-col items-center justify-center gap-2 py-3">
                            <Loader2 className="w-5 h-5 animate-spin opacity-80" />
                            <span className="text-xs opacity-80">
                              Menyimpan...
                            </span>
                          </div>
                        ) : (
                          <ul className="space-y-1.5">
                            {btn.descriptions.map((d) => (
                              <li
                                key={d}
                                className="flex items-center gap-2 text-xs font-medium"
                              >
                                <span
                                  className={`shrink-0 w-1.5 h-1.5 rounded-full ${btn.dot}`}
                                />
                                {d}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm pointer-events-none">
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-border bg-card shadow-xl p-6 md:p-8">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-success/10 border-2 border-success/40 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
              </div>
              <h3 className="text-xl font-black text-foreground text-center mb-1">
                Review Berhasil!
              </h3>
              <p className="text-muted-foreground text-center text-sm mb-5">
                Hafalanmu sudah tercatat.
              </p>

              <div className="p-4 rounded-2xl bg-success/10 border border-success/30 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-success" />
                  <p className="text-success/70 text-xs font-bold uppercase tracking-wider">
                    Review Selanjutnya
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-foreground">
                    {nextIntervalDays}
                  </p>
                  <span className="text-muted-foreground text-sm">hari lagi</span>
                </div>
                <p className="text-success/60 text-xs mt-1">
                  {nextReviewDate || "-"}
                </p>
              </div>

              <div className="w-full py-3 rounded-xl bg-success text-success-foreground font-bold text-center">
                {queuePosition < queueTotal ? "Lanjut otomatis..." : "Selesai"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};
