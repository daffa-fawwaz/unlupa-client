import { ProgressBar } from "@/features/alquran/components/ProgressBar";
import { JuzCard } from "@/features/alquran/components/JuzCard";
import type {
  CardJuzData,
  LifecycleStats,
} from "@/features/alquran/types/quran.types";
import { Sidebar } from "@/components/ui/Sidebar";
import { useEffect, useState } from "react";
import { useGetJuz } from "@/features/alquran/hooks/useGetJuz";
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
}

export const AlquranDashboard = ({
  progress,
  onJuzClick,
  onAddClick,
}: AlquranDashboardProps) => {
  const { data, getJuz } = useGetJuz();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    getJuz();
  }, [data]);

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

          {/* 🌟 HERO SECTION: Daily Review Target */}
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
