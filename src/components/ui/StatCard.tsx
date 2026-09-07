import { ArrowUpRight, Users, BookOpen, DollarSign, Activity } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  desc: string;
  icon: React.ElementType;
  color: string;
};

// Dummy Data for Stats
export const stats = [
  {
    title: "Total Pengguna",
    value: "3,533",
    change: "+12.5%",
    icon: Users,
    color: "blue",
    desc: "Siswa & Pengajar",
  },
  {
    title: "Kelas Aktif",
    value: "156",
    change: "+8.2%",
    icon: BookOpen,
    color: "emerald",
    desc: "Sedang berlangsung",
  },
  {
    title: "Pendapatan",
    value: "Rp 154jt",
    change: "+23.1%",
    icon: DollarSign,
    color: "gold",
    desc: "Bulan ini",
  },
  {
    title: "Aktivitas Sistem",
    value: "98.9%",
    change: "+0.4%",
    icon: Activity,
    color: "purple",
    desc: "Uptime Server",
  },
];

const statIconStyles: Record<string, string> = {
  blue: "text-info",
  emerald: "text-success",
  gold: "text-warning",
  purple: "text-primary",
};

const statChipStyles: Record<string, string> = {
  blue: "bg-info/10 border border-info/20 text-info",
  emerald: "bg-success/10 border border-success/20 text-success",
  gold: "bg-warning/10 border border-warning/20 text-warning",
  purple: "bg-primary/10 border border-primary/20 text-primary",
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
    <div className="bg-card border border-border p-6 rounded-2xl group">
      <div className="flex justify-between items-start mb-4">
        <div className={`${statIconStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded ${statChipStyles[color]}`}
        >
          <ArrowUpRight className="w-3 h-3" />
          {change}
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
          {value}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          {desc}
        </p>
      </div>
    </div>
  );
};
