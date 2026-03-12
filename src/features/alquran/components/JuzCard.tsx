import type { LifecycleStats } from "@/features/alquran/types/quran.types";
import { BookOpen } from "lucide-react";

interface JuzCardProps {
  juzNumber: number;
  itemCount: number;
  stats: LifecycleStats;
  onClick: () => void;
}

export const JuzCard = ({
  juzNumber,
  itemCount,
  stats,
  onClick,
}: JuzCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0F1218]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 min-h-60 flex flex-col overflow-hidden"
    >
      {/* Background Gradient/Glow */}
      <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative Icon Background */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
        <BookOpen className="w-40 h-40 text-white" />
      </div>

      {/* Large Juz Number Watermark */}
      <div className="absolute top-2 right-4 text-7xl font-serif font-bold text-white/3 group-hover:text-amber-500/5 transition-colors duration-500 pointer-events-none select-none">
        {juzNumber}
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-serif text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
              Juz {juzNumber}
            </h3>
            <p className="text-gray-500 text-xs font-medium tracking-wide">
              AL-QUR'AN
            </p>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 group-hover:text-amber-400 transition-all">
            {itemCount} Item
          </div>
        </div>
      </div>

      {/* Lifecycle Grid */}
      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
        <div className="flex flex-col p-2 rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/5">
          <span className="text-[0.65rem] text-gray-500 uppercase tracking-wider font-bold mb-1">
            Menghafal
          </span>
          <span className="text-lg font-mono font-bold text-blue-400 leading-none">
            {stats.menghafal}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/5">
          <span className="text-[0.65rem] text-gray-500 uppercase tracking-wider font-bold mb-1">
            Latihan Interval
          </span>
          <span className="text-lg font-mono font-bold text-amber-400 leading-none">
            {stats.murajaah}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/5">
          <span className="text-[0.65rem] text-gray-500 uppercase tracking-wider font-bold mb-1">
            Ujian Interval
          </span>
          <span className="text-lg font-mono font-bold text-emerald-400 leading-none">
            {stats.terjaga}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/5">
          <span className="text-[0.65rem] text-gray-500 uppercase tracking-wider font-bold mb-1">
            Selesai
          </span>
          <span className="text-lg font-mono font-bold text-purple-400 leading-none">
            {stats.selesai}
          </span>
        </div>
      </div>
    </div>
  );
};
