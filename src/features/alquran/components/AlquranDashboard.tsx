import { Plus } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { JuzCard } from "./JuzCard";
import type { LifecycleStats } from "../types/quran.types";

interface AlquranDashboardProps {
  progress: {
    totalPages: number;
    juzMastered: number;
    percentage: number;
  };
  juzStats: (juz: string) => LifecycleStats;
  juzCounts: (juz: string) => number;
  onJuzClick: (juz: string) => void;
  onAddClick: () => void;
}

export const AlquranDashboard = ({
  progress,
  juzStats,
  juzCounts,
  onJuzClick,
  onAddClick,
}: AlquranDashboardProps) => {
  return (
    <div className="animate-fadeIn">
      {/* Header handled in main layout, simplified here */}

      {/* Main Stats / Progress */}
      <ProgressBar
        current={progress.juzMastered}
        total={30}
        percentage={progress.percentage}
      />

      {/* Actions Bar */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={onAddClick}
          className="shrink-0 w-full sm:w-auto px-6 py-4 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center gap-3 text-black font-bold shadow-lg shadow-amber-900/20 hover:scale-[1.02] hover:shadow-amber-500/20 transition-all"
        >
          <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-black" />
          </div>
          <div className="text-left">
            <div className="text-xs opacity-75 uppercase tracking-wider">
              Hafalan Baru
            </div>
            <div className="text-lg leading-tight">Tambah Target</div>
          </div>
        </button>

        <button className="shrink-0 w-full sm:w-auto px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-white hover:bg-white/10 hover:border-white/20 transition-all">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">CN</span>
          </div>
          <div className="text-left">
            <div className="text-xs opacity-50 uppercase tracking-wider">
              Komunitas
            </div>
            <div className="text-lg leading-tight font-serif">Gabung Kelas</div>
          </div>
        </button>
      </div>

      {/* Juz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 30 }, (_, i) => {
          const juz = (i + 1).toString();
          const count = juzCounts(juz);
          const stats = juzStats(juz);

          return (
            <JuzCard
              key={juz}
              juzNumber={juz}
              itemCount={count}
              stats={stats}
              onClick={() => onJuzClick(juz)}
            />
          );
        })}
      </div>
    </div>
  );
};
