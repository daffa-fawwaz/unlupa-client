import {
  Menu,
  ShieldCheck,
  Sun,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect } from "react";
import { useOutletContext } from "react-router";
import type { DashboardContextType } from "@/layouts/DashboardLayout";
import { useGetMyItems } from "@/features/alquran/hooks/useGetMyItems";
import { QuickAccessCards } from "@/components/ui/QuickAccessCards";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useGetDaily } from "@/features/alquran/hooks/useGetDaily";

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

export const StudentDashboardPage = () => {
  const { toggleSidebar } = useOutletContext<DashboardContextType>();
  const { name } = useCurrentUser();

  const { data: myItems, loading: myItemsLoading, getMyItems } = useGetMyItems();
  const { data: dailyTasks, loading: dailyLoading } = useGetDaily();

  useEffect(() => {
    void getMyItems("quran");
  }, []);

  const totalTerjaga =
    myItems?.data.groups.reduce((sum, group) => sum + group.item_count, 0) ?? 0;

  // Calculate items by status (dinamis dari API)
  const allItems = myItems?.data.groups.flatMap((group) => group.items) ?? [];
  const totalSelesai = allItems.filter(
    (item) => item.status === "graduated" || item.status === "graduate"
  ).length;

  // Review hari ini (dari daily tasks)
  const reviewHariIni = dailyTasks?.length ?? 0;

  // Calculate estimated focus time today (dinamis dari localStorage)
  // Asumsi: 1 item review = ~3-5 menit (estimasi berdasarkan kompleksitas)
  const reviewedToday = getReviewedIdsForTaskDate(getTodayDateKey()).length;
  const estimatedFocusTime = reviewedToday * 4; // 4 menit per item (rata-rata)

  // Get initial letter for avatar
  const initialLetter = name.charAt(0).toUpperCase();

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

        {/* Right: User Identity (Dynamic from auth store) */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white font-serif font-medium">
              {name}
            </p>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              Penjaga Ilmu
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-linear-to-b from-amber-500 to-amber-700 flex items-center justify-center font-serif font-bold text-black border-2 border-amber-400/50 shadow-lg shadow-amber-500/20">
            {initialLetter}
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

      {/* QUICK ACCESS CARDS */}
      <QuickAccessCards role="student" />

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Stat 1: Materi Terjaga (dinamis dari my-items API) */}
        <div className="glass-stat border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition"></div>
          <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono">
              Total Terjaga
            </p>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-4xl text-white font-serif mb-4">
            {myItemsLoading ? "..." : totalTerjaga}{" "}
            <span className="text-sm text-gray-500 font-sans">Item</span>
          </h3>
          <div className="space-y-2 border-t border-white/5 pt-4">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Al-Qur'an</span>{" "}
              <span className="text-emerald-300">
                {myItemsLoading ? "..." : totalTerjaga}
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: Review Hari Ini (dinamis dari daily tasks API) */}
        <div className="glass-stat border-purple-500/20 bg-purple-900/5 relative overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-[10px] text-purple-400/80 uppercase tracking-widest font-mono">
              Review Hari Ini
            </p>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-center py-2 relative z-10">
            <h3 className="text-5xl text-white font-serif tracking-tight">
              {dailyLoading ? "..." : reviewHariIni}
            </h3>
            <p className="text-sm text-purple-300 mt-1">Tugas Review</p>
          </div>
          <p className="text-[10px] text-center text-gray-500 mt-6 relative z-10">
            {reviewHariIni > 0 
              ? "Ayo selesaikan sekarang!" 
              : "Tidak ada tugas hari ini"}
          </p>
        </div>

        {/* Stat 3: Total Selesai/Graduated (dinamis dari my-items API) */}
        <div className="glass-stat border-amber-500/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition"></div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] text-amber-500/80 uppercase tracking-widest font-mono">
              Total Selesai
            </p>
            <div className="flex items-center gap-1 text-amber-500">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-bold">{totalSelesai}</span>
            </div>
          </div>
          <div className="text-center py-2">
            <p className="text-xs text-gray-400 mb-2">
              Item yang telah dihafal dengan sempurna
            </p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ 
                  width: totalTerjaga > 0 
                    ? `${Math.min((totalSelesai / totalTerjaga) * 100, 100)}%` 
                    : "0%" 
                }}
              />
            </div>
            <p className="text-[10px] text-amber-500/70 mt-2">
              {totalTerjaga > 0 
                ? `${Math.round((totalSelesai / totalTerjaga) * 100)}% dari total terjaga`
                : "Mulai menghafal untuk melihat progress"}
            </p>
          </div>
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
              ± {estimatedFocusTime}{" "}
              <span className="text-sm font-sans text-amber-500/50">Menit</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
