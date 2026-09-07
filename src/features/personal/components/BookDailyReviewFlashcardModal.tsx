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
  Brain,
  Image,
  Frown,
  Meh,
  Smile,
  Flame,
} from "lucide-react";
import type {
  BookDailyTask,
  ReviewIntervalResponse,
  ReviewFsrsResponse,
} from "@/features/personal/types/personal.types";
import { useReviewIntervalBook } from "@/features/personal/hooks/useReviewIntervalBook";
import { useReviewFsrsBook } from "@/features/personal/hooks/useReviewFsrsBook";
import { personalService } from "@/features/personal/services/personal.services";

interface BookDailyReviewFlashcardModalProps {
  isOpen: boolean;
  task: BookDailyTask | null;
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
    icon: Frown,
    descriptions: ["Blank", "Banyak Lupa", "Berpikir Lama", "Banyak Salah"],
    bg: "bg-red-600 border-red-500/70 hover:bg-red-700",
    headerBg: "bg-red-700",
    dot: "bg-white/80",
    textColor: "text-white",
  },
  {
    id: 2 as const,
    payloadValue: 2 as const,
    header: "Sedang",
    icon: Meh,
    descriptions: ["Sering Lupa", "Sering Salah", "Tersendat", "Lambat"],
    bg: "bg-warning border-warning/50 hover:bg-warning/90",
    headerBg: "bg-warning",
    dot: "bg-warning-foreground",
    textColor: "text-warning-foreground",
  },
  {
    id: 3 as const,
    payloadValue: 3 as const,
    header: "Baik",
    icon: Smile,
    descriptions: ["Lancar", "Cepat", "Yakin", "Benar"],
    bg: "bg-emerald-600 border-emerald-500/70 hover:bg-emerald-700",
    headerBg: "bg-emerald-700",
    dot: "bg-white/80",
    textColor: "text-white",
  },
  {
    id: 4 as const,
    payloadValue: 3 as const,
    header: "Sempurna",
    icon: Flame,
    descriptions: ["Reflek", "Tanpa Salah", "Sangat Lancar", "Sempurna"],
    bg: "bg-sky-600 border-sky-500/70 hover:bg-sky-700",
    headerBg: "bg-sky-700",
    dot: "bg-white/80",
    textColor: "text-white",
  },
] as const;

export const BookDailyReviewFlashcardModal = ({
  isOpen,
  task,
  queuePosition = 1,
  queueTotal = 1,
  onClose,
  onReviewed,
}: BookDailyReviewFlashcardModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [submittingButtonId, setSubmittingButtonId] = useState<1 | 2 | 3 | 4 | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemContent, setItemContent] = useState<string>("");
  const [itemAnswer, setItemAnswer] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");
  const [nextReviewDate, setNextReviewDate] = useState<string>("");
  const [nextIntervalDays, setNextIntervalDays] = useState<number>(0);
  const [itemStatus, setItemStatus] = useState<string>("");

  const { reviewInterval, loading: loadingInterval } = useReviewIntervalBook();
  const { reviewFsrs, loading: loadingFsrs } = useReviewFsrsBook();

  useEffect(() => {
    if (!isOpen || !task) return;
    setIsFlipped(false);
    setSubmittingButtonId(null);
    setShowSuccessModal(false);

    const fetchItemData = async () => {
      try {
        const response = await personalService.getItemDetail(task.item_id);
        const d = response.data;
        setItemStatus(d.status || "unknown");
        setItemContent(d.question || "Pertanyaan tidak tersedia");
        setItemAnswer(d.answer || "Jawaban tidak tersedia");
        console.log("DEBUG getItemDetail raw data keys:", Object.keys(d));
        console.log("DEBUG getItemDetail image value:", d.image);
        console.log("DEBUG getItemDetail normalized:", JSON.stringify(d));
        setItemImage(d.image || "");
      } catch {
        setItemStatus("unknown");
        setItemContent("Pertanyaan tidak tersedia");
        setItemAnswer("Jawaban tidak tersedia");
        setItemImage("");
      }
    };

    void fetchItemData();
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const currentStatus = itemStatus.toLowerCase();
  const useFsrsReview = currentStatus !== "interval";
  const loading = useFsrsReview ? loadingFsrs : loadingInterval;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleRatingClick = async (btn: (typeof REVIEW_BUTTONS)[number]) => {
    if (loading || submittingButtonId !== null) return;
    setSubmittingButtonId(btn.id);

    try {
      let response: ReviewIntervalResponse | ReviewFsrsResponse;

      if (useFsrsReview) {
        response = await reviewFsrs(task.item_id, {
          rating: btn.payloadValue as 1 | 2 | 3 | 4,
        });
        const fsrsData = (response as ReviewFsrsResponse).data;
        if (fsrsData && typeof fsrsData === "object" && "next_review_at" in fsrsData) {
          setNextReviewDate(formatDate(fsrsData.next_review_at as string));
          setNextIntervalDays((fsrsData.next_interval_days as number) || 1);
        }
      } else {
        const intervalRating = Math.min(btn.payloadValue, 3) as 1 | 2 | 3;
        response = await reviewInterval(task.item_id, { rating: intervalRating });
        const intervalData = (response as ReviewIntervalResponse).data;
        if (intervalData?.interval_next_review_at) {
          setNextReviewDate(formatDate(intervalData.interval_next_review_at));
          setNextIntervalDays(intervalData.interval_days || 1);
        }
      }

      await onReviewed(response);

      window.dispatchEvent(
        new CustomEvent("books:item-reviewed", {
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

  const progressPct = Math.round((queuePosition / queueTotal) * 100);

  return createPortal(
    <div className="fixed inset-0 z-9999 bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {queueTotal > 1 && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden max-w-[200px]">
                <div
                  className="h-full rounded-full bg-info transition-all duration-500"
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

      {/* Main content — 3D Flip Card Container */}
      <div className="flex-1 overflow-hidden relative" style={{ perspective: "1500px" }}>
        <div
          className="w-full h-full transition-transform duration-700 ease-in-out relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT — Question */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col bg-background"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-8 md:px-16 py-8 max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-info/20 border border-info/30 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-info" />
                </div>
                <span className="px-3 py-1 rounded-full bg-info/15 text-info border border-info/20 text-xs font-bold tracking-wider uppercase">
                  Pertanyaan
                </span>
              </div>

              {itemImage && itemImage.trim() !== "" && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface-1">
                  <img
                    src={itemImage}
                    alt={itemContent || "Gambar item"}
                    className="max-h-[320px] w-full object-contain bg-background"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8 rounded-2xl border border-info/20 bg-info/10 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-info/20 border border-info/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-info" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-snug whitespace-pre-wrap wrap-break-word">
                    {itemContent}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <CalendarDays className="w-4 h-4" />
                <span>{task.task_date}</span>
              </div>
            </div>

            {/* Sticky flip button */}
            <div className="px-4 sm:px-8 md:px-16 pb-6 pt-3 max-w-3xl mx-auto w-full shrink-0 border-t border-border bg-background">
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-info/15 border border-info/30 text-info font-bold text-base hover:bg-info/25 transition-colors"
              >
                <RotateCw className="w-5 h-5" />
                Lihat Jawaban
              </button>
            </div>
          </div>

          {/* BACK — Answer + Feedback */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col bg-background"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col px-4 sm:px-8 md:px-16 py-8 max-w-3xl mx-auto w-full">
              {/* Answer */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-success" />
                </div>
                <span className="px-3 py-1 rounded-full bg-success/15 text-success border border-success/20 text-xs font-bold tracking-wider uppercase">
                  Jawaban
                </span>
              </div>

              {itemImage && itemImage.trim() !== "" && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface-1">
                  <img
                    src={itemImage}
                    alt={itemContent || "Gambar item"}
                    className="max-h-[320px] w-full object-contain bg-background"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 rounded-2xl border border-success/20 bg-success/10 mb-6">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {itemAnswer}
                </p>
              </div>

              {/* Feedback section */}
              <div className="mb-4">
                <h3 className="text-lg font-black text-foreground mb-1">
                  Seberapa kuat hafalanmu?
                </h3>
                <p className="text-muted-foreground text-sm">Pilih satu — nilai langsung tersimpan.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
                      <div className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-black uppercase tracking-wide border-b border-border ${btn.headerBg}`}>
                        <btn.icon className="w-4 h-4" />
                        <span>{btn.header}</span>
                      </div>
                      <div className="flex-1 p-3">
                        {isSubmitting ? (
                          <div className="flex flex-col items-center justify-center gap-2 py-3">
                            <Loader2 className="w-5 h-5 animate-spin opacity-80" />
                            <span className="text-xs opacity-80">Menyimpan...</span>
                          </div>
                        ) : (
                          <ul className="space-y-1.5">
                            {btn.descriptions.map((d) => (
                              <li key={d} className="flex items-center gap-2 text-xs font-medium">
                                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${btn.dot}`} />
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

            {/* Sticky flip button */}
            <div className="px-4 sm:px-8 md:px-16 pb-6 pt-3 max-w-3xl mx-auto w-full shrink-0 border-t border-border bg-background">
              <button
                onClick={() => setIsFlipped(false)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-surface-1 border border-border text-muted-foreground font-bold text-base hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <RotateCw className="w-5 h-5" />
                Lihat Pertanyaan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-border bg-card shadow-xl p-6 md:p-8">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-success/20 border-2 border-success/40 flex items-center justify-center">
                  <Check className="w-8 h-8 text-success" />
                </div>
              </div>

              <h3 className="text-xl font-black text-foreground text-center mb-1">Review Berhasil!</h3>
              <p className="text-muted-foreground text-center text-sm mb-5">Hafalanmu sudah tercatat.</p>

              <div className="p-4 rounded-2xl bg-success/10 border border-success/30 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-success" />
                  <p className="text-success/70 text-xs font-bold uppercase tracking-wider">
                    Review Selanjutnya
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-foreground">{nextIntervalDays}</p>
                  <span className="text-muted-foreground text-sm">hari lagi</span>
                </div>
                <p className="text-success/60 text-xs mt-1">{nextReviewDate || "-"}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (queuePosition >= queueTotal) onClose();
                }}
                className="w-full py-3 rounded-xl bg-success hover:bg-success/90 text-success-foreground font-bold transition-all"
              >
                {queuePosition < queueTotal ? "Lanjut →" : "Selesai"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
