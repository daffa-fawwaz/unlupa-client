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
      className="group relative bg-card border border-border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 min-h-60 flex flex-col overflow-hidden"
    >
      {/* Decorative Icon Background */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
        <BookOpen className="w-40 h-40 text-foreground" />
      </div>

      {/* Large Juz Number Watermark */}
      <div className="absolute top-2 right-4 text-7xl font-serif font-bold text-foreground/3 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none select-none">
        {juzNumber}
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-serif text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
              Juz {juzNumber}
            </h3>
            <p className="text-muted-foreground text-xs font-medium tracking-wide">
              AL-QUR'AN
            </p>
          </div>
          <div className="px-3 py-1 bg-surface-1 border border-border rounded-full text-xs font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all">
            {itemCount} Item
          </div>
        </div>
      </div>

      {/* Lifecycle Grid */}
      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
        <div className="flex flex-col p-2 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Menghafal
          </span>
          <span className="text-lg font-mono font-bold text-foreground leading-none">
            {stats.menghafal}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Latihan Interval
          </span>
          <span className="text-lg font-mono font-bold text-foreground leading-none">
            {stats.murajaah}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Ujian Interval
          </span>
          <span className="text-lg font-mono font-bold text-foreground leading-none">
            {stats.terjaga}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider font-bold mb-1">
            Selesai
          </span>
          <span className="text-lg font-mono font-bold text-primary leading-none">
            {stats.selesai}
          </span>
        </div>
      </div>
    </div>
  );
};
