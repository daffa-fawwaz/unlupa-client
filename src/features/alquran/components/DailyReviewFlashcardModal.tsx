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
} from "@/features/alquran/types/quran.types";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";
import { useReviewInterval } from "@/features/alquran/hooks/useReviewInterval";

interface DailyReviewFlashcardModalProps {
  isOpen: boolean;
  task: DailyTask | null;
  onClose: () => void;
  onReviewed: (result: ReviewIntervalResponse) => Promise<void> | void;
}

/** Payload: merah=1, kuning=2, hijau=3, biru=3. Klik tombol = submit langsung. */
const REVIEW_BUTTONS = [
  {
    id: 1 as const,
    payloadValue: 1 as const,
    descriptions: ["Blank", "Banyak Lupa", "Berpikir Lama", "Banyak Salah"],
    className:
      "border-2 border-rose-400/40 bg-rose-950/60 text-rose-100 hover:bg-rose-500/25 hover:border-rose-400/60 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-200",
    dotClassName: "bg-rose-400",
  },
  {
    id: 2 as const,
    payloadValue: 2 as const,
    descriptions: ["Sering Lupa", "Sering Salah", "Tersendat", "Lambat"],
    className:
      "border-2 border-amber-400/40 bg-amber-950/60 text-amber-100 hover:bg-amber-500/25 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-200",
    dotClassName: "bg-amber-400",
  },
  {
    id: 3 as const,
    payloadValue: 3 as const,
    descriptions: ["Lancar", "Cepat", "Yakin", "Benar"],
    className:
      "border-2 border-emerald-400/40 bg-emerald-950/60 text-emerald-100 hover:bg-emerald-500/25 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-200",
    dotClassName: "bg-emerald-400",
  },
  {
    id: 4 as const,
    payloadValue: 3 as const,
    descriptions: ["Reflek", "Tanpa Salah", "Sangat Lancar", "Sempurna"],
    className:
      "border-2 border-blue-400/40 bg-blue-950/60 text-blue-100 hover:bg-blue-500/25 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-200",
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
  const { reviewInterval, loading, error } = useReviewInterval();

  if (!isOpen || !task) return null;
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
      const response = await reviewInterval(task.item_id, btn.payloadValue);
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

        <div className="[perspective:2200px]">
          <div
            className={`relative min-h-[520px] md:min-h-[450px] w-full [transform-style:preserve-3d] transition-transform duration-700 ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div className="absolute inset-0 [backface-visibility:hidden] rounded-[1.5rem] md:rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-[#101725] via-[#0D1422] to-[#0A111C] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-y-auto">
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
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight break-words">
                    {title}
                  </h3>
                  <p className="text-cyan-200/80 mt-2 text-sm md:text-lg break-words">
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

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[1.5rem] md:rounded-[2rem] border border-emerald-400/20 bg-linear-to-br from-[#13211D] via-[#101B19] to-[#0B1513] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-y-auto">
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
                        className={`relative text-left p-4 rounded-2xl min-h-[120px] flex flex-col justify-center ${btn.className} disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed`}
                      >
                        {isSubmitting ? (
                          <div className="flex flex-col items-center justify-center gap-2 py-2">
                            <Loader2 className="w-8 h-8 animate-spin opacity-90" />
                            <span className="text-xs font-medium opacity-90">
                              Menyimpan...
                            </span>
                          </div>
                        ) : (
                          <ul className="space-y-2 sm:space-y-2.5">
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
