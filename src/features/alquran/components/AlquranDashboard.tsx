import { ProgressBar } from "@/features/alquran/components/ProgressBar";
import { JuzCard } from "@/features/alquran/components/JuzCard";
import type {
  CardJuzData,
  LifecycleStats,
} from "@/features/alquran/types/quran.types";
import { Sidebar } from "@/components/ui/Sidebar";
import { useCallback, useEffect, useState } from "react";
import { useGetJuz } from "@/features/alquran/hooks/useGetJuz";
import { alquranService } from "@/features/alquran/services/alquran.services";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardActionButtons } from "./DashboardActionButtons";
import { DailyReviewSection } from "./DailyReviewSection";

interface AlquranDashboardProps {
  progress: {
    totalPages: number;
    juzMastered: number;
    percentage: number;
  };
  juzStats: (juz: string) => LifecycleStats;
  juzCounts: (juz: string) => number;
  onJuzClick: (juz: { id: string; index: number }) => void;
  onAddClick: () => void;
  refreshSignal?: number;
}

export const AlquranDashboard = ({
  progress,
  onJuzClick,
  onAddClick,
  refreshSignal = 0,
}: AlquranDashboardProps) => {
  const { data, getJuz } = useGetJuz();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const triggerDailyGenerateIfNeeded = useCallback(async () => {
    const storageKey = "alquran:last-daily-generate-date";
    const lockKey = "alquran:daily-generate-lock";
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    const lastGeneratedDate = localStorage.getItem(storageKey);

    if (lastGeneratedDate === today) {
      return;
    }

    try {
      const lockRaw = localStorage.getItem(lockKey);
      if (lockRaw) {
        const lock = JSON.parse(lockRaw) as { date?: string; expiresAt?: number };
        if (
          lock.date === today &&
          typeof lock.expiresAt === "number" &&
          lock.expiresAt > Date.now()
        ) {
          return;
        }
      }
    } catch {
      localStorage.removeItem(lockKey);
    }

    try {
      localStorage.setItem(
        lockKey,
        JSON.stringify({
          date: today,
          expiresAt: Date.now() + 30_000,
        }),
      );

      await alquranService.generateDaily();
      localStorage.setItem(storageKey, today);
      localStorage.removeItem(lockKey);
      window.dispatchEvent(new Event("alquran:daily-generated"));
    } catch (error) {
      localStorage.removeItem(lockKey);
      console.error("Failed to generate daily target", error);
    }
  }, []);

  useEffect(() => {
    void getJuz();
  }, [getJuz]);

  useEffect(() => {
    void getJuz();
  }, [getJuz, refreshSignal]);

  useEffect(() => {
    void triggerDailyGenerateIfNeeded();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void triggerDailyGenerateIfNeeded();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const periodicCheckId = window.setInterval(
      () => void triggerDailyGenerateIfNeeded(),
      15 * 1000,
    );

    return () => {
      window.clearInterval(periodicCheckId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [triggerDailyGenerateIfNeeded]);

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[#0B0E14] rounded-3xl">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Overlay for mobile sidebar */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className="animate-fadeIn max-w-[1600px] mx-auto">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Main Stats / Progress */}
          <ProgressBar
            current={progress.juzMastered}
            total={30}
            percentage={progress.percentage}
          />

          {/* HERO SECTION: Daily Review Target */}
          <DailyReviewSection />

          {/* Section: Koleksi Hafalan & Actions */}
          <div className="mt-12 mb-6 border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 border-l-4 border-emerald-500 pl-3">
                Koleksi Hafalan & Juz
              </h2>
              <p className="text-gray-400 text-sm pl-4">
                Pantau progress hafalan dan tambahkan target Juz baru di sini.
              </p>
            </div>
          </div>

          {/* Actions Bar (Tambah Target etc) */}
          <DashboardActionButtons onAddClick={onAddClick} />

          {/* Juz Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.data.map((juz: CardJuzData) => (
              <JuzCard
                key={juz.juz_id}
                juzNumber={juz.juz_index}
                itemCount={juz.total_items}
                stats={{
                  menghafal: juz.menghafal,
                  murajaah: juz.interval,
                  terjaga: juz.fsrs_active,
                  selesai: juz.graduate,
                }}
                onClick={() =>
                  onJuzClick({ id: juz.juz_id, index: juz.juz_index })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
