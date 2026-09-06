import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Clock, CheckCircle, BarChart2, CalendarDays } from "lucide-react";
import type { ParsedContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";

interface ItemDetailStatsGridProps {
  reviewCount: number;
  createdDate: string;
  info: ParsedContentRef;
  nextReviewAt?: string;
}

interface StatCardProps {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  children: ReactNode;
}

function StatCard({
  icon: Icon,
  iconClassName,
  label,
  children,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-surface-1 border border-border hover:border-border transition-colors">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
        <Icon className={`w-4 h-4 ${iconClassName}`} />
        {label}
      </div>
      {children}
    </div>
  );
}

/** Format date to readable Indonesian format */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ItemDetailStatsGrid({
  reviewCount,
  createdDate,
  info,
  nextReviewAt,
}: ItemDetailStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <StatCard
        icon={Clock}
        iconClassName="text-warning/60"
        label="Total Review"
      >
        <span className="text-3xl font-mono font-bold text-foreground">
          {reviewCount}
          <span className="text-base text-muted-foreground font-normal ml-1">kali</span>
        </span>
      </StatCard>

      <StatCard
        icon={CheckCircle}
        iconClassName="text-success/60"
        label="Ditambahkan"
      >
        <span className="text-sm font-medium text-muted-foreground leading-snug mt-1">
          {formatDate(createdDate)}
        </span>
      </StatCard>

      <StatCard
        icon={BarChart2}
        iconClassName="text-info/60"
        label="Tipe Hafalan"
      >
        <span className="text-lg font-bold text-foreground capitalize">
          {info.type === "surah" ? "Per Surah" : "Per Halaman"}
        </span>
      </StatCard>

      <StatCard
        icon={CalendarDays}
        iconClassName="text-primary/60"
        label="Jadwal Latihan Interval Selanjutnya"
      >
        {nextReviewAt ? (
          <span className="text-sm font-mono font-bold text-foreground">
            {formatDate(nextReviewAt)}
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">Belum ada</span>
        )}
      </StatCard>
    </div>
  );
}
