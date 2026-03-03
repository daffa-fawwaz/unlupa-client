import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  FileText,
  X,
  ArrowLeft,
  Check,
  ChevronRight,
} from "lucide-react";
import {
  SURAH_MAP,
  PAGE_DATABASE,
} from "@/features/alquran/constants/quranData";
import { DualRangeSlider } from "@/components/ui/DualRangeSlider";
import { clsx } from "clsx";
import { useCreateJuzItem } from "@/features/alquran/hooks/useCreateJuzItem";
import { SURAH_NAMES } from "@/features/alquran/constants/surahList";

import type { MyItemDetail } from "@/features/alquran/types/quran.types";

interface AddHafalanModalProps {
  isOpen: boolean;
  onClose: () => void;
  juzId: string; // e.g., UUID
  juzNumber: number; // e.g., 1-30
  existingItems: MyItemDetail[];
  onSave: (data: unknown) => void;
}

type Mode = "SURAH" | "PAGE" | null;

type ParsedContentRef =
  | { mode: "surah"; key: number; start: number; end: number }
  | { mode: "page"; key: 0; start: number; end: number }
  | null;

const normalizeRange = (start: number, end: number) => ({
  start: Math.min(start, end),
  end: Math.max(start, end),
});

const parseContentRef = (contentRef: string): ParsedContentRef => {
  if (contentRef.startsWith("surah:")) {
    const [, surahIdRaw, rangeRaw] = contentRef.split(":");
    const [startRaw, endRaw] = (rangeRaw || "").split("-");
    const surahId = Number(surahIdRaw);
    const start = Number(startRaw);
    const end = Number(endRaw);
    if (
      !Number.isFinite(surahId) ||
      !Number.isFinite(start) ||
      !Number.isFinite(end)
    ) {
      return null;
    }
    const normalized = normalizeRange(start, end);
    return {
      mode: "surah",
      key: surahId,
      start: normalized.start,
      end: normalized.end,
    };
  }

  if (contentRef.startsWith("page:")) {
    const [, rangeRaw] = contentRef.split(":");
    const [startRaw, endRaw] = (rangeRaw || "").split("-");
    const start = Number(startRaw);
    const end = Number(endRaw);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return null;
    }
    const normalized = normalizeRange(start, end);
    return {
      mode: "page",
      key: 0,
      start: normalized.start,
      end: normalized.end,
    };
  }

  return null;
};

const isRangeOverlapping = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) => Math.max(aStart, bStart) <= Math.min(aEnd, bEnd);

export const AddHafalanModal = ({
  isOpen,
  onClose,
  juzId,
  juzNumber,
  existingItems = [],
  onSave,
}: AddHafalanModalProps) => {
  const [mode, setMode] = useState<Mode>(null);
  const [selectedSurahIndex, setSelectedSurahIndex] = useState<number>(0);

  // Get data for this Juz using juzNumber
  const pageRange = useMemo(
    () => PAGE_DATABASE[juzNumber.toString()] ?? { min: 1, max: 1 },
    [juzNumber],
  ); // Fallback to avoid crash
  const surahs = useMemo(
    () => SURAH_MAP[juzNumber.toString()] ?? [],
    [juzNumber],
  );

  // Parse Surah Range (e.g., "Al-Baqarah (142-252)" -> name: "Al-Baqarah", start: 142, end: 252)
  const parsedSurahs = useMemo(() => {
    return surahs.map((s) => {
      const match = s.n.match(/(.+?)\s*\((\d+)-(\d+)\)/);
      if (match) {
        return {
          name: match[1].trim(),
          start: parseInt(match[2]),
          end: parseInt(match[3]),
          totalAyat: parseInt(match[3]) - parseInt(match[2]) + 1,
        };
      }
      return {
        name: s.n, // Full name if no range (e.g., "Al-Fatihah")
        start: 1,
        end: s.a,
        totalAyat: s.a,
      };
    });
  }, [surahs]);

  // Compute initial range based on mode and selection
  const initialRange = useMemo(() => {
    if (mode === "PAGE") {
      return { min: pageRange.min, max: pageRange.max };
    }
    if (mode === "SURAH" && parsedSurahs[selectedSurahIndex]) {
      const surah = parsedSurahs[selectedSurahIndex];
      return { min: surah.start, max: surah.end };
    }
    return { min: 0, max: 0 };
  }, [mode, pageRange, parsedSurahs, selectedSurahIndex]);

  const [range, setRange] = useState(initialRange);

  // Sync range when mode or surah selection changes
  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const currentParsedRef = useMemo<ParsedContentRef>(() => {
    if (!mode) return null;

    if (mode === "PAGE") {
      const normalized = normalizeRange(range.min, range.max);
      return {
        mode: "page",
        key: 0,
        start: normalized.start,
        end: normalized.end,
      };
    }

    const surah = parsedSurahs[selectedSurahIndex];
    if (!surah) return null;

    const surahIndex = SURAH_NAMES.findIndex(
      (name) =>
        name === surah.name ||
        name.startsWith(surah.name) ||
        surah.name.startsWith(name),
    );
    const surahId = surahIndex !== -1 ? surahIndex + 1 : 0;
    const normalized = normalizeRange(range.min, range.max);
    return {
      mode: "surah",
      key: surahId,
      start: normalized.start,
      end: normalized.end,
    };
  }, [mode, parsedSurahs, range.max, range.min, selectedSurahIndex]);

  const isDuplicate = useMemo(() => {
    if (!currentParsedRef) return false;

    return existingItems.some((item) => {
      const existingParsedRef = parseContentRef(item.content_ref);
      if (!existingParsedRef) return false;
      if (existingParsedRef.mode !== currentParsedRef.mode) return false;
      if (existingParsedRef.key !== currentParsedRef.key) return false;

      return isRangeOverlapping(
        existingParsedRef.start,
        existingParsedRef.end,
        currentParsedRef.start,
        currentParsedRef.end,
      );
    });
  }, [currentParsedRef, existingItems]);

  // API Hook
  const { createJuzItem, loading, error } = useCreateJuzItem();

  const handleSave = async () => {
    if (isDuplicate) return;

    let contentRef = "";
    let modeType = "";

    if (mode === "PAGE") {
      modeType = "page";
      // Format: "page:start-end"
      contentRef = `page:${range.min}-${range.max}`;
    } else {
      modeType = "surah";
      const surah = parsedSurahs[selectedSurahIndex];

      // Find Surah ID
      // Handle edge case like "An-Naba" vs "An-Naba'"
      const surahIndex = SURAH_NAMES.findIndex(
        (name) =>
          name === surah.name ||
          name.startsWith(surah.name) ||
          surah.name.startsWith(name),
      );

      const surahId = surahIndex !== -1 ? surahIndex + 1 : 0;

      // Format: "surah:SURAH_ID:START-END"
      // Example: "surah:1:1-7"
      contentRef = `surah:${surahId}:${range.min}-${range.max}`;
    }

    try {
      await createJuzItem(juzId, {
        mode: modeType,
        content_ref: contentRef,
      });

      onSave(null); // Trigger refresh in parent
      onClose();

      // Reset state
      setTimeout(() => {
        setMode(null);
        setSelectedSurahIndex(0);
      }, 300);
    } catch (err) {
      console.error("Failed to save:", err);
      // Optional: Show error toast here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg max-h-[92vh] bg-[#0F1218] border border-white/10 rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-[#0F1218]/95 backdrop-blur">
          <div className="flex items-center gap-3">
            {mode && (
              <button
                onClick={() => setMode(null)}
                className="p-2 -ml-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg sm:text-xl font-serif text-white">
              {mode === "PAGE"
                ? "Target Halaman"
                : mode === "SURAH"
                  ? "Target Surah"
                  : "Tambah Hafalan"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {!mode ? (
            // STEP 1: Mode Selection
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setMode("SURAH")}
                className="group relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-left flex flex-col gap-3 sm:gap-4 overflow-hidden"
              >
                <div className="p-2.5 sm:p-3 w-fit rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    Per Surah
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Hafalan berdasarkan ayat dalam surah tertentu.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setMode("PAGE")}
                className="group relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-left flex flex-col gap-3 sm:gap-4 overflow-hidden"
              >
                <div className="p-2.5 sm:p-3 w-fit rounded-xl sm:rounded-2xl bg-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    Per Halaman
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Hafalan berdasarkan rentang halaman Mushaf.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            // STEP 2: Input Controls
            <div className="space-y-6 sm:space-y-8">
              {/* Surah Selector (Only for SURAH mode) */}
              {mode === "SURAH" && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Pilih Surah di Juz {juzNumber}
                  </label>
                  <div className="flex flex-col gap-2 max-h-[36vh] sm:max-h-[40vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {parsedSurahs.map((surah, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSurahIndex(idx)}
                        className={clsx(
                          "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between shrink-0",
                          selectedSurahIndex === idx
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-500"
                            : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10",
                        )}
                      >
                        <div>
                          <div className="font-bold text-sm">{surah.name}</div>
                          <div className="text-xs opacity-70">
                            Ayat {surah.start} - {surah.end}
                          </div>
                        </div>
                        {selectedSurahIndex === idx && (
                          <Check className="w-5 h-5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Slider Input */}
              <div className="space-y-6 pt-2">
                <div className="flex justify-between items-end gap-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {mode === "PAGE" ? "Rentang Halaman" : "Rentang Ayat"}
                  </label>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white shrink-0">
                    {range.min} <span className="text-gray-600">-</span>{" "}
                    {range.max}
                  </div>
                </div>

                <div className="px-2">
                  <DualRangeSlider
                    key={`${mode}-${selectedSurahIndex}`}
                    min={
                      mode === "PAGE"
                        ? pageRange.min
                        : parsedSurahs[selectedSurahIndex]?.start || 1
                    }
                    max={
                      mode === "PAGE"
                        ? pageRange.max
                        : parsedSurahs[selectedSurahIndex]?.end || 10
                    }
                    onChange={setRange}
                  />
                </div>

                <p className="text-xs text-center text-gray-500">
                  Geser tombol untuk menentukan target hafalanmu.
                </p>
              </div>

              {/* Save Button */}
              <div className="space-y-3 pb-1">
                <button
                  onClick={handleSave}
                  disabled={loading || isDuplicate}
                  className={clsx(
                    "w-full py-4 rounded-xl text-black font-bold shadow-lg transition-all flex items-center justify-center gap-2",
                    isDuplicate
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-linear-to-r from-amber-500 to-orange-600 shadow-amber-900/20 hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                >
                  {loading ? (
                    <span>Menyimpan...</span>
                  ) : isDuplicate ? (
                    <span>Hafalan Sudah Ada</span>
                  ) : (
                    <>
                      <span>Simpan Target</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {isDuplicate && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center animate-fadeIn">
                    <p className="text-red-400 text-xs font-semibold">
                      Anda sudah memiliki target hafalan ini. Silakan pilih
                      rentang ayat atau surah lain.
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
