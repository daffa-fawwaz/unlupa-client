import { ArrowUpRight } from "@/components/foundations/hugeicons";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  desc: string;
  icon: React.ElementType;
  color: string;
};

const statIconStyles: Record<string, string> = {
  blue: "bg-cyan-900 text-cyan-50",
  emerald: "bg-emerald-700 text-emerald-50",
  gold: "bg-amber-700 text-amber-50",
  purple: "bg-rose-800 text-rose-50",
};

const statChipStyles: Record<string, string> = {
  blue: "text-cyan-950",
  emerald: "text-emerald-950",
  gold: "text-amber-950",
  purple: "text-rose-950",
};

const statCardStyles: Record<string, string> = {
  blue: "border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-cyan-100 to-emerald-100 text-cyan-950",
  emerald: "border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-emerald-100 to-lime-100 text-emerald-950",
  gold: "border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 text-amber-950",
  purple: "border-rose-200/80 bg-gradient-to-br from-rose-50 via-orange-100 to-red-100 text-rose-950",
};

export const StatCard = ({
  title,
  value,
  change,
  desc,
  icon: Icon,
  color,
}: StatCardProps) => {
  return (
    <div className={`group relative min-h-48 overflow-hidden rounded-3xl border p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${statCardStyles[color]}`}>
      <div className="relative mb-8 flex items-start justify-between">
        <div className={`flex size-12 items-center justify-center rounded-2xl shadow-sm ${statIconStyles[color]}`}>
          <Icon className="size-6" />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${statChipStyles[color]}`}
        >
          <ArrowUpRight className="size-3" />
          {change}
        </div>
      </div>

      <div className="relative">
        <p className="mb-4 text-sm font-semibold">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
          {value}
        </h3>
        <p className="mt-2 max-w-38 text-xs font-medium leading-relaxed opacity-75">
          {desc}
        </p>
      </div>
    </div>
  );
};
