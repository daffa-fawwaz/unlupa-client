import {
  Book,
  Check,
  Code,
  Coffee,
  Flame,
  GraduationCap,
  Hourglass,
  Loader2,
  Menu,
  Moon,
  Play,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router";
import type { DashboardContextType } from "@/layouts/DashboardLayout";

export const StudentDashboardPage = () => {
  const { toggleSidebar } = useOutletContext<DashboardContextType>();
  const [taskStatus, setTaskStatus] = useState<
    Record<string, "idle" | "loading" | "completed">
  >({});

  const simulateReview = (taskId: string) => {
    setTaskStatus((prev) => ({ ...prev, [taskId]: "loading" }));
    setTimeout(() => {
      setTaskStatus((prev) => ({ ...prev, [taskId]: "completed" }));
    }, 1500);
  };

  const getButtonContent = (taskId: string) => {
    const status = taskStatus[taskId] || "idle";
    if (status === "loading") {
      return <Loader2 className="w-4 h-4 spin-loader" />;
    }
    if (status === "completed") {
      return <Check className="w-4 h-4" />;
    }
    return <Play className="w-4 h-4 fill-current" />;
  };

  const getButtonClass = (taskId: string, baseClass: string) => {
    const status = taskStatus[taskId] || "idle";
    if (status === "completed") {
      return "btn-play bg-gray-700 text-gray-400 cursor-default";
    }
    return `btn-play ${baseClass}`;
  };

  const isCompleted = (taskId: string) => taskStatus[taskId] === "completed";

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 transition-all duration-300">
      {/* HEADER (PROFILE FOCUS - CLEANED) */}
      <nav className="flex justify-between items-center mb-10">
        {/* Left: Menu Trigger */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition group cursor-pointer"
        >
          <div className="p-2 rounded-lg border border-white/10 group-hover:border-amber-500/50 bg-white/5">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-sm font-mono tracking-widest hidden md:inline">
            MENU
          </span>
        </button>

        {/* Right: User Identity (Tanpa Angka Estimasi) */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white font-serif font-medium">
              Abdullah F.
            </p>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              Penjaga Ilmu
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-linear-to-b from-amber-500 to-amber-700 flex items-center justify-center font-serif font-bold text-black border-2 border-amber-400/50 shadow-lg shadow-amber-500/20">
            A
          </div>
        </div>
      </nav>

      {/* 1. QUOTE BANNER (Fixed Text) */}
      <div className="quote-banner fade-in-up mb-12 text-center md:text-left border-l-4 border-amber-500 bg-linear-to-r from-amber-900/20 to-transparent p-6 rounded-r-xl">
        <p className="text-xl md:text-2xl font-serif text-white italic leading-relaxed">
          "Menjaga hafalan itu lebih ringan <br /> daripada mengulang hafalan
          yang hilang."
        </p>
        <p className="text-xs text-amber-500 mt-3 font-mono uppercase tracking-widest flex items-center gap-2 md:justify-start justify-center">
          <Sun className="w-3 h-3" />
          {/* Fixed Text Greeting */}
          <span className="shimmer-text">
            Istiqomah Hari Ini = Kemudahan Esok Hari
          </span>
        </p>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Stat 1: Materi Terjaga */}
        <div className="glass-stat border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition"></div>
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono">
              Total Terjaga
            </p>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-4xl text-white font-serif mb-4">
            124 <span className="text-sm text-gray-500 font-sans">Item</span>
          </h3>
          <div className="space-y-2 border-t border-white/5 pt-4">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Al-Qur'an</span>{" "}
              <span className="text-emerald-300">60</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Kelas</span> <span className="text-emerald-300">40</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Pribadi</span> <span className="text-emerald-300">24</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Waktu (THE TROPHY) */}
        <div className="glass-stat border-purple-500/20 bg-purple-900/5 relative overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-[10px] text-purple-400/80 uppercase tracking-widest font-mono">
              Dedikasi Waktu
            </p>
            <Hourglass className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-center py-2 relative z-10">
            <h3 className="text-5xl text-white font-serif tracking-tight">
              12.5
            </h3>
            <p className="text-sm text-purple-300 mt-1">Jam Bulan Ini</p>
          </div>
          <p className="text-[10px] text-center text-gray-500 mt-6 relative z-10">
            "Waktu yang tak akan sia-sia"
          </p>
        </div>

        {/* Stat 3: Konsistensi (Heatmap) */}
        <div className="glass-stat border-amber-500/20">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] text-amber-500/80 uppercase tracking-widest font-mono">
              Konsistensi
            </p>
            <div className="flex items-center gap-1 text-amber-500">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">12 Hari</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-full">
            <div className="heatmap-grid flex-1 content-end">
              {[...Array(28)].map((_, i) => (
                <div
                  key={i}
                  className={`heatmap-cell ${
                    [
                      0, 1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19,
                      20,
                    ].includes(i)
                      ? "active"
                      : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TASK CENTER (REVIEW WAJIB) */}
      <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
        <h2 className="font-cinzel text-2xl text-white">
          Review Wajib Hari Ini
        </h2>
        <p className="text-xs text-gray-500 font-mono hidden md:block">
          Disusun oleh Algoritma UNLUPA
        </p>
      </div>

      {/* A. RUANG AL-QUR'AN */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-900/20 border border-emerald-500/20 text-emerald-400">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-white">Ruang Al-Qur'an</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            ± 18 Menit
          </div>
        </div>

        {/* Fase 1: Konsolidasi */}
        <div className="mb-6 pl-4 md:pl-6 border-l-2 border-red-500/30 space-y-3">
          <span className="phase-label bg-phase-red">
            Fase Konsolidasi (Kritis)
          </span>

          <div
            className={`item-row group ${
              isCompleted("task-1") ? "completed" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition">
                  QS. Al-Luqman
                </h4>
                <p className="text-[10px] text-gray-500">
                  Ayat 1-15 • ± 5 menit
                </p>
              </div>
            </div>
            <button
              className={getButtonClass("task-1", "btn-play-emerald")}
              onClick={() => simulateReview("task-1")}
              disabled={isCompleted("task-1")}
            >
              {getButtonContent("task-1")}
            </button>
          </div>
        </div>

        {/* Fase 2: Active */}
        <div className="mb-6 pl-4 md:pl-6 border-l-2 border-amber-500/30 space-y-3">
          <span className="phase-label bg-phase-amber">
            Active Review (Penguatan)
          </span>
          <div
            className={`item-row group ${
              isCompleted("task-2") ? "completed" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  QS. Ar-Rahman
                </h4>
                <p className="text-[10px] text-gray-500">Estimasi: ± 6 menit</p>
              </div>
            </div>
            <button
              className={getButtonClass("task-2", "btn-play-emerald")}
              onClick={() => simulateReview("task-2")}
              disabled={isCompleted("task-2")}
            >
              {getButtonContent("task-2")}
            </button>
          </div>
        </div>

        {/* Fase 3: Maintenance */}
        <div className="pl-4 md:pl-6 border-l-2 border-emerald-500/30 space-y-3">
          <span className="phase-label bg-phase-emerald">
            Maintenance (Penjagaan)
          </span>
          <div
            className={`item-row group ${
              isCompleted("task-3") ? "completed" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  QS. Al-Kahfi
                </h4>
                <p className="text-[10px] text-gray-500">Estimasi: ± 7 menit</p>
              </div>
            </div>
            <button
              className={getButtonClass("task-3", "btn-play-emerald")}
              onClick={() => simulateReview("task-3")}
              disabled={isCompleted("task-3")}
            >
              {getButtonContent("task-3")}
            </button>
          </div>
        </div>
      </div>

      {/* B. RUANG KELAS */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-blue-900/20 border border-blue-500/20 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-white">Ruang Kelas</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            ± 27 Menit
          </div>
        </div>

        {/* Kelas 1 */}
        <div className="mb-6">
          <p className="text-xs text-blue-400 mb-3 font-bold uppercase tracking-wider pl-1 flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span> Bahasa
            Arab
          </p>
          <div
            className={`item-row border-l-4 border-l-blue-500 group ${
              isCompleted("task-4") ? "completed" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-blue-900/30 flex items-center justify-center text-blue-300 border border-blue-500/20">
                <Book className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                  Kitab: Al-‘Arabiyyah Bayna Yadayk
                </h4>
                <p className="text-[10px] text-gray-500">
                  Bab 1: At-Tahiyyah • 4 Item • ± 12 menit
                </p>
              </div>
            </div>
            <button
              className={getButtonClass("task-4", "btn-play-blue")}
              onClick={() => simulateReview("task-4")}
              disabled={isCompleted("task-4")}
            >
              {getButtonContent("task-4")}
            </button>
          </div>
        </div>

        {/* Kelas 2 */}
        <div>
          <p className="text-xs text-blue-400 mb-3 font-bold uppercase tracking-wider pl-1 flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span> Teknologi
            Informasi
          </p>
          <div
            className={`item-row border-l-4 border-l-blue-500 group ${
              isCompleted("task-5") ? "completed" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-blue-900/30 flex items-center justify-center text-blue-300 border border-blue-500/20">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                  Materi: JavaScript Asyncronus
                </h4>
                <p className="text-[10px] text-gray-500">
                  Functions & Loops • 20 Item • ± 15 menit
                </p>
              </div>
            </div>
            <button
              className={getButtonClass("task-5", "btn-play-blue")}
              onClick={() => simulateReview("task-5")}
              disabled={isCompleted("task-5")}
            >
              {getButtonContent("task-5")}
            </button>
          </div>
        </div>
      </div>

      {/* C. RUANG PRIBADI */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-purple-900/20 border border-purple-500/20 text-purple-400">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-white">Ruang Pribadi</h3>
        </div>

        <div className="p-6 rounded-xl border border-dashed border-purple-500/20 bg-purple-900/5 text-center flex flex-col items-center justify-center min-h-[100px]">
          <Coffee className="w-6 h-6 text-purple-500/50 mb-2" />
          <p className="text-sm text-purple-200/60 italic font-serif">
            "Tidak ada review wajib hari ini. Nikmati ketenangan Anda."
          </p>
        </div>
      </div>

      {/* FOOTER SUMMARY */}
      <div className="mt-20 border-t border-white/5 pt-8 pb-4">
        <div className="glass-panel p-6 rounded-xl border border-amber-500/20 bg-linear-to-r from-amber-900/10 to-transparent flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <p className="font-serif italic text-white text-lg mb-1">
              "Setiap menit adalah investasi abadi."
            </p>
            <p className="text-xs text-gray-500">
              Teruslah menjaga, walau sedikit.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">
              Total Fokus Hari Ini
            </p>
            <p className="text-3xl font-serif text-amber-400">
              ± 45{" "}
              <span className="text-sm font-sans text-amber-500/50">Menit</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
