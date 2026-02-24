import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
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
import { parseContentRef } from "@/features/alquran/components/item-detail/itemDetailView.config";
import { useReviewInterval } from "@/features/alquran/hooks/useReviewInterval";

interface DailyReviewFlashcardModalProps {
  isOpen: boolean;
  task: DailyTask | null;
  onClose: () => void;
  onReviewed: (result: ReviewIntervalResponse) => Promise<void> | void;
}

const RATING_OPTIONS = [
  { value: 1 as const, label: "Buruk", description: "Masih banyak lupa" },
  { value: 2 as const, label: "Sedang", description: "Sebagian lancar" },
  { value: 3 as const, label: "Bagus", description: "Lancar dan yakin" },
];

export const DailyReviewFlashcardModal = ({
  isOpen,
  task,
  onClose,
  onReviewed,
}: DailyReviewFlashcardModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | null>(null);
  const { reviewInterval, loading, error } = useReviewInterval();

  if (!isOpen || !task) return null;
  const info = task.content_ref ? parseContentRef(task.content_ref) : null;

  const title = info?.title || (task.juz_index > 0 ? `Juz ${task.juz_index}` : "Review Harian");
  const subtitle = info?.subtitle || "Detail konten belum tersedia";
  const range = info?.range || "-";
  const sourceLabel =
    task.source === "interval_review"
      ? "Murajaah"
      : task.source === "new_memorization"
        ? "Hafalan Baru"
        : "Ziyadah";

  const handleSubmitRating = async () => {
    if (!selectedRating || loading) return;

    try {
      const response = await reviewInterval(task.item_id, selectedRating);
      await onReviewed(response);
      onClose();
    } catch {
      // Error sudah disimpan di hook untuk ditampilkan di UI.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-2 md:-top-5 md:-right-5 z-20 p-2 rounded-full bg-[#111826] border border-white/10 text-gray-400 hover:text-white hover:bg-[#1A2232] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="[perspective:2200px]">
          <div
            className={`relative min-h-[480px] w-full [transform-style:preserve-3d] transition-transform duration-700 ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div className="absolute inset-0 [backface-visibility:hidden] rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-[#101725] via-[#0D1422] to-[#0A111C] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.20),transparent_35%)]" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
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

                <div className="p-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/5 mb-6">
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-cyan-200/80 mt-2 text-lg">{subtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                      <span>{info?.type === "surah" ? "Per Surah" : "Per Halaman"}</span>
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

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[2rem] border border-emerald-400/20 bg-linear-to-br from-[#13211D] via-[#101B19] to-[#0B1513] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_15%_25%,rgba(16,185,129,0.32),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.2),transparent_35%)]" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
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

                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  Seberapa kuat hafalanmu?
                </h3>
                <p className="text-gray-300 text-sm md:text-base mb-6">
                  Pilih nilai review untuk update interval item ini.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  {RATING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedRating(option.value)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedRating === option.value
                          ? "border-emerald-300/70 bg-emerald-500/20 shadow-lg shadow-emerald-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <p className="text-3xl font-black text-white">{option.value}</p>
                      <p className="text-sm font-bold text-emerald-200">{option.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitRating}
                  disabled={!selectedRating || loading}
                  className="w-full py-4 rounded-xl bg-linear-to-r from-emerald-400 to-teal-500 text-[#07110E] font-black tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menyimpan review...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Submit Nilai</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
