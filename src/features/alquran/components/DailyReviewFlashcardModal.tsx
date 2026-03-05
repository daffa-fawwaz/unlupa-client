import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Layers,
  Loader2,
  RefreshCw,
  RotateCw,
  X,
} from "lucide-react";
import type {
  DailyTask,
  ReviewIntervalResponse,
  ReviewFsrsResponse,
} from "@/features/alquran/types/quran.types";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";
import { useReviewFsrs } from "@/features/alquran/hooks/useReviewFsrs";
import { useReviewInterval } from "../hooks/useReviewInterval";

interface DailyReviewFlashcardModalProps {
  isOpen: boolean;
  task: DailyTask | null;
  onClose: () => void;
  onReviewed: (result: ReviewIntervalResponse | ReviewFsrsResponse) => Promise<void> | void;
}

/** Payload: merah=1, kuning=2, hijau=3, biru=3. Klik tombol = submit langsung. */
const REVIEW_BUTTONS = [
  {
    id: 1 as const,
    payloadValue: 1 as const,
    header: "Lemah",
    descriptions: ["Blank", "Banyak Lupa", "Berpikir Lama", "Banyak Salah"],
    wrapperClass:
      "border-2 border-rose-500/50 bg-rose-950/80 text-rose-100 shadow-[0_4px_0_0_rgba(190,18,60,0.5),0_6px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_0_rgba(190,18,60,0.5),0_8px_16px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(190,18,60,0.5),0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200",
    headerClass:
      "bg-rose-600/90 text-white font-black tracking-wide border-b border-rose-400/30",
    dotClassName: "bg-rose-400",
  },
  {
    id: 2 as const,
    payloadValue: 2 as const,
    header: "Sedang",
    descriptions: ["Sering Lupa", "Sering Salah", "Tersendat", "Lambat"],
    wrapperClass:
      "border-2 border-amber-500/50 bg-amber-950/80 text-amber-100 shadow-[0_4px_0_0_rgba(180,83,9,0.5),0_6px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_0_rgba(180,83,9,0.5),0_8px_16px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(180,83,9,0.5),0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200",
    headerClass:
      "bg-amber-600/90 text-white font-black tracking-wide border-b border-amber-400/30",
    dotClassName: "bg-amber-400",
  },
  {
    id: 3 as const,
    payloadValue: 3 as const,
    header: "Baik",
    descriptions: ["Lancar", "Cepat", "Yakin", "Benar"],
    wrapperClass:
      "border-2 border-emerald-500/50 bg-emerald-950/80 text-emerald-100 shadow-[0_4px_0_0_rgba(4,120,87,0.5),0_6px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_0_rgba(4,120,87,0.5),0_8px_16px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(4,120,87,0.5),0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200",
    headerClass:
      "bg-emerald-600/90 text-white font-black tracking-wide border-b border-emerald-400/30",
    dotClassName: "bg-emerald-400",
  },
  {
    id: 4 as const,
    payloadValue: 3 as const,
    header: "Sempurna",
    descriptions: ["Reflek", "Tanpa Salah", "Sangat Lancar", "Sempurna"],
    wrapperClass:
      "border-2 border-blue-500/50 bg-blue-950/80 text-blue-100 shadow-[0_4px_0_0_rgba(29,78,216,0.5),0_6px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_0_rgba(29,78,216,0.5),0_8px_16px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(29,78,216,0.5),0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-200",
    headerClass:
      "bg-blue-600/90 text-white font-black tracking-wide border-b border-blue-400/30",
    dotClassName: "bg-blue-400",
  },
] as const;

export const DailyReviewFlashcardModal = ({
  isOpen,
  task,
  onClose,
  onReviewed,
}: DailyReviewFlashcardModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [submittingButtonId, setSubmittingButtonId] = useState<
    1 | 2 | 3 | 4 | null
  >(null);
  const { reviewFsrs, loading: loadingFsrs, error: errorFsrs } = useReviewFsrs();
  const { reviewInterval, loading: loadingInterval, error: errorInterval } = useReviewInterval();

  if (!isOpen || !task) return null;

  // Determine which review endpoint to use based on item status
  // 'interval' status -> use reviewInterval (rating 1-3)
  // 'fsrs_active', 'graduated', or 'graduate' status -> use reviewFsrs (rating 1-4)
  const itemStatus = task.status?.toLowerCase() || "";
  const useFsrsReview =
    itemStatus === "fsrs_active" ||
    itemStatus === "graduated" ||
    itemStatus === "graduate";

  const loading = useFsrsReview ? loadingFsrs : loadingInterval;
  const error = useFsrsReview ? errorFsrs : errorInterval;

  const info = task.content_ref ? parseContentRef(task.content_ref) : null;

  const title =
    info?.title ||
    (task.juz_index > 0 ? `Juz ${task.juz_index}` : "Review Harian");
  const subtitle = info?.subtitle || "Detail konten belum tersedia";
  const range = info?.range || "-";
  const sourceLabel =
    task.source === "interval_review"
      ? "Murajaah"
      : task.source === "new_memorization"
        ? "Hafalan Baru"
        : "Ziyadah";

  const handleRatingClick = async (
    btn: (typeof REVIEW_BUTTONS)[number],
  ) => {
    if (loading || submittingButtonId !== null) return;

    setSubmittingButtonId(btn.id);
    try {
      let response: ReviewIntervalResponse | ReviewFsrsResponse;
      
      if (useFsrsReview) {
        // Use FSRS review for 'fsrs_active' or 'graduated' items (rating 1-4)
        response = await reviewFsrs(task.item_id, btn.payloadValue as 1 | 2 | 3 | 4);
      } else {
        // Use Interval review for 'interval' items (rating 1-3 only)
        // Map rating 4 to 3 for interval review
        const intervalRating = Math.min(btn.payloadValue, 3) as 1 | 2 | 3;
        response = await reviewInterval(task.item_id, intervalRating);
      }
      
      await onReviewed(response);
      onClose();
    } catch {
      setSubmittingButtonId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[92vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:-top-5 md:-right-5 z-20 p-2 rounded-full bg-[#111826] border border-white/10 text-gray-400 hover:text-white hover:bg-[#1A2232] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="perspective-[2200px]">
          <div
            className={`relative min-h-130 md:min-h-112.5 w-full transform-3d transition-transform duration-700 ${
              isFlipped ? "transform-[rotateY(180deg)]" : ""
            }`}
          >
            <div className="absolute inset-0 backface-hidden rounded-3xl md:rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-[#101725] via-[#0D1422] to-[#0A111C] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-y-auto">
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.20),transparent_35%)]" />

              <div className="relative p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 text-xs font-bold tracking-wider uppercase">
                    Kartu Review
                  </span>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-cyan-500/20 hover:border-cyan-300/40 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    Balik Kartu
                  </button>
                </div>

                <div className="p-4 md:p-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/5 mb-5">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight wrap-break-word">
                    {title}
                  </h3>
                  <p className="text-cyan-200/80 mt-2 text-sm md:text-lg wrap-break-word">
                    {subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                      Sumber
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <RefreshCw className="w-4 h-4 text-cyan-300" />
                      <span>{sourceLabel}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                      Task Date
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <CalendarDays className="w-4 h-4 text-cyan-300" />
                      <span>{task.task_date}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                      Tipe
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <BookOpen className="w-4 h-4 text-cyan-300" />
                      <span>
                        {info?.type === "surah" ? "Per Surah" : "Per Halaman"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                      Rentang
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Layers className="w-4 h-4 text-cyan-300" />
                      <span>{range.replace("-", " - ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] rounded-3xl md:rounded-[2rem] border border-emerald-400/20 bg-linear-to-br from-[#13211D] via-[#101B19] to-[#0B1513] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-y-auto">
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_15%_25%,rgba(16,185,129,0.32),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.2),transparent_35%)]" />

              <div className="relative p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 text-xs font-bold tracking-wider uppercase">
                    Nilai Hafalan
                  </span>
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-emerald-500/20 hover:border-emerald-300/40 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    Lihat Depan
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3">
                  Seberapa kuat hafalanmu?
                </h3>
                <p className="text-gray-300 text-sm md:text-base mb-6">
                  Pilih satu tombol — nilai langsung tersimpan.
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                  {REVIEW_BUTTONS.map((btn) => {
                    const isSubmitting = submittingButtonId === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleRatingClick(btn)}
                        disabled={submittingButtonId !== null}
                        className={`relative overflow-hidden rounded-2xl min-h-33 flex flex-col text-left ${btn.wrapperClass} disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed`}
                      >
                        <div
                          className={`flex items-center justify-center py-2 px-3 text-center text-sm uppercase tracking-wider ${btn.headerClass}`}
                        >
                          {btn.header}
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-center">
                          {isSubmitting ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-2">
                              <Loader2 className="w-7 h-7 animate-spin opacity-90" />
                              <span className="text-xs font-medium opacity-90">
                                Menyimpan...
                              </span>
                            </div>
                          ) : (
                            <ul className="space-y-1.5 sm:space-y-2">
                              {btn.descriptions.map((d) => (
                                <li
                                  key={d}
                                  className="flex items-center gap-2 text-xs sm:text-sm font-medium leading-snug"
                                >
                                  <span
                                    className={`shrink-0 w-1.5 h-1.5 rounded-full ${btn.dotClassName}`}
                                  />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="p-3 rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-300 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
