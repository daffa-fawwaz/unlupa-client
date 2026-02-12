import type { LifecycleStats } from "@/features/alquran/types/quran.types";

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
      className="relative bg-linear-to-br from-[rgba(20,15,10,0.9)] to-[rgba(10,10,10,0.7)] border border-amber-500/15 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] min-h-[220px] flex flex-col overflow-hidden group"
    >
      {/* Large Juz Number Watermark */}
      <div className="absolute top-[-15px] right-2.5 text-[5rem] font-cinzel font-bold text-white/5 pointer-events-none">
        {juzNumber}
      </div>

      {/* Header */}
      <div className="relative z-10 mb-auto">
        <h3 className="text-2xl font-serif text-white mb-2">Juz {juzNumber}</h3>
        <div className="inline-block px-2 py-1 bg-white/5 border mb-2 border-white/10 rounded text-xs text-gray-400">
          {itemCount} Item
        </div>
      </div>

      {/* Lifecycle Grid */}
      <div className="grid grid-cols-2 gap-3 border-t border-dashed border-white/10 pt-4 mt-auto">
        <div className="flex flex-col items-center">
          <span className="text-base font-mono font-bold text-blue-400">
            {stats.menghafal}
          </span>
          <span className="text-[0.5rem] text-gray-500 uppercase tracking-wider text-center mt-0.5">
            Menghafal
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-base font-mono font-bold text-amber-400">
            {stats.murajaah}
          </span>
          <span className="text-[0.5rem] text-gray-500 uppercase tracking-wider text-center mt-0.5">
            Murajaah
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-base font-mono font-bold text-emerald-400">
            {stats.terjaga}
          </span>
          <span className="text-[0.5rem] text-gray-500 uppercase tracking-wider text-center mt-0.5">
            Terjaga
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-base font-mono font-bold text-purple-400">
            {stats.selesai}
          </span>
          <span className="text-[0.5rem] text-gray-500 uppercase tracking-wider text-center mt-0.5">
            Selesai
          </span>
        </div>
      </div>
    </div>
  );
};
