import { Menu, Moon, Plus } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { JuzCard } from "./JuzCard";
import type { LifecycleStats } from "../types/quran.types";
import { Sidebar } from "@/components/ui/Sidebar";
import { useState } from "react";

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
  onJuzClick,
  onAddClick,
}: AlquranDashboardProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div className="min-h-screen p-4 bg-deep-universe rounded">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Overlay for mobile sidebar */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className="mb-8 flex flex-col justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex mb-4 items-center gap-3 text-gray-400 hover:text-amber-500 transition group cursor-pointer"
          >
            <div className="p-2 rounded-lg border border-white/10 group-hover:border-amber-500/50 bg-white/5">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-sm font-mono tracking-widest hidden md:inline">
              MENU
            </span>
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
              <Moon className="w-8 h-8 text-amber-400" />
              Al-Qur'an Tracker
            </h1>
            <p className="text-gray-400">
              Pantau progres hafalan dan muraja'ahmu setiap hari.
            </p>
          </div>
        </div>

        <div className="animate-fadeIn ">
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
              className="shrink-0 w-full cursor-pointer sm:w-auto px-6 py-4 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center gap-3 text-black font-bold shadow-lg shadow-amber-900/20 hover:scale-[1.02] hover:shadow-amber-500/20 transition-all"
            >
              <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-black" />
              </div>
              <div className="text-left ">
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
                <div className="text-lg leading-tight font-serif">
                  Gabung Kelas
                </div>
              </div>
            </button>
          </div>

          {/* Juz Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <JuzCard
              key={"1"}
              juzNumber={"1"}
              itemCount={0}
              stats={{
                new: 0,
                memorizing: 0,
                consolidation: 0,
                active: 0,
                maintenance: 0,
                graduated: 0,
              }}
              onClick={() => onJuzClick("1")}
            />
          </div>
        </div>
      </div>
    </>
  );
};
