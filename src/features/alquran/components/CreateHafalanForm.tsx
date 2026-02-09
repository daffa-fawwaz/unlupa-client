import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { DualRangeSlider } from "./DualRangeSlider";
import { SURAH_MAP, PAGE_DATABASE } from "../constants/quranData";

interface CreateHafalanFormProps {
  onClose: () => void;
  onSubmit: (
    juz: string,
    surahName: string,
    ayatStart: number,
    ayatEnd: number,
    pageStart: number,
    pageEnd: number,
    time: number,
  ) => void;
}

export const CreateHafalanForm = ({
  onClose,
  onSubmit,
}: CreateHafalanFormProps) => {
  const [selectedJuz, setSelectedJuz] = useState("");
  const [selectedSurahIdx, setSelectedSurahIdx] = useState("");
  const [ayatRange, setAyatRange] = useState({ start: 1, end: 5 });
  const [pageRange, setPageRange] = useState({ start: 1, end: 1 });
  const [timeEstimate, setTimeEstimate] = useState(5);
  const [showSliders, setShowSliders] = useState(false);

  const selectedSurah =
    selectedJuz && selectedSurahIdx !== ""
      ? SURAH_MAP[selectedJuz][parseInt(selectedSurahIdx)]
      : null;

  const pageInfo = selectedJuz ? PAGE_DATABASE[selectedJuz] : null;

  const handleJuzChange = (juz: string) => {
    setSelectedJuz(juz);
    setSelectedSurahIdx("");
    setShowSliders(false);
  };

  const handleSurahChange = (idx: string) => {
    setSelectedSurahIdx(idx);
    if (idx !== "" && selectedJuz) {
      const surah = SURAH_MAP[selectedJuz][parseInt(idx)];
      const pages = PAGE_DATABASE[selectedJuz];

      // Set initial ranges
      setAyatRange({ start: 1, end: Math.min(5, surah.a) });
      setPageRange({ start: pages.min, end: pages.min });
      setTimeEstimate(5);
      setShowSliders(true);
    } else {
      setShowSliders(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedSurah || !selectedJuz) return;

    onSubmit(
      selectedJuz,
      selectedSurah.n,
      ayatRange.start,
      ayatRange.end,
      pageRange.start,
      pageRange.end,
      timeEstimate,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-[550px] bg-[rgba(10,12,15,0.95)] border border-amber-500/30 backdrop-blur-3xl rounded-3xl p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h1 className="text-xl font-serif text-white">Hafalan Baru</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step 1: Juz & Surah Selection */}
        <div className="mb-6">
          <label className="block font-mono text-xs text-amber-400 uppercase tracking-widest mb-2">
            1. Pilih Juz
          </label>
          <select
            value={selectedJuz}
            onChange={(e) => handleJuzChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-3.5 py-3.5 rounded-xl font-inter cursor-pointer appearance-none transition-colors hover:bg-white/10 focus:outline-none focus:border-amber-400 focus:bg-amber-500/5"
          >
            <option value="">-- Pilih Juz --</option>
            {Array.from({ length: 30 }, (_, i) => 30 - i).map((juz) => (
              <option key={juz} value={juz.toString()}>
                Juz {juz}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block font-mono text-xs text-amber-400 uppercase tracking-widest mb-2">
            2. Pilih Surah
          </label>
          <select
            value={selectedSurahIdx}
            onChange={(e) => handleSurahChange(e.target.value)}
            disabled={!selectedJuz}
            className="w-full bg-white/5 border border-white/10 text-white px-3.5 py-3.5 rounded-xl font-inter cursor-pointer appearance-none transition-colors hover:bg-white/10 focus:outline-none focus:border-amber-400 focus:bg-amber-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedJuz ? "-- Pilih Surah --" : "-- Pilih Juz Dulu --"}
            </option>
            {selectedJuz &&
              SURAH_MAP[selectedJuz].map((surah, idx) => (
                <option key={idx} value={idx.toString()}>
                  {surah.n}
                </option>
              ))}
          </select>
        </div>

        {/* Step 2: Sliders (Auto Reveal) */}
        {showSliders && selectedSurah && pageInfo && (
          <div className="space-y-6 animate-fadeIn">
            <DualRangeSlider
              min={1}
              max={selectedSurah.a}
              value1={ayatRange.start}
              value2={ayatRange.end}
              onChange={(start, end) => setAyatRange({ start, end })}
              label="Rentang Ayat"
            />

            <DualRangeSlider
              min={pageInfo.min}
              max={pageInfo.max}
              value1={pageRange.start}
              value2={pageRange.end}
              onChange={(start, end) => setPageRange({ start, end })}
              label="Rentang Halaman"
            />

            {/* Time Slider (Single) */}
            <div className="mb-6">
              <div className="flex justify-between font-mono text-sm text-gray-400 mb-2">
                <span>Estimasi Review</span>
                <span className="text-amber-400 font-bold text-lg">
                  {timeEstimate} Menit
                </span>
              </div>
              <div className="relative w-full h-12 px-2.5">
                <div className="absolute top-1/2 left-2.5 right-2.5 h-1 bg-white/10 rounded-full -translate-y-1/2" />
                <div
                  className="absolute top-1/2 left-2.5 h-1 bg-amber-400 rounded-full -translate-y-1/2 pointer-events-none"
                  style={{
                    width: `calc(${(timeEstimate / 60) * 100}% - 10px)`,
                    boxShadow: "0 0 10px rgba(251, 191, 36, 0.4)",
                  }}
                />
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(parseInt(e.target.value))}
                  className="absolute top-1/2 left-2.5 w-[calc(100%-20px)] -translate-y-1/2 z-20 appearance-none bg-transparent cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-linear-to-r from-amber-400 to-amber-600 text-black font-bold uppercase rounded-xl transition-transform hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(245,158,11,0.2)] tracking-wider flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Simpan Hafalan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
