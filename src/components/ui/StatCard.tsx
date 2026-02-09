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

export const StatCard = ({
  title,
  value,
  change,
  desc,
  icon: Icon,
  color,
}: StatCardProps) => {
  return (
    <div className={`monolith-card ${color} p-6 rounded-2xl group`}>
      <div className="card-nebula bg-current opacity-20"></div>

      <div className="flex justify-between items-start mb-4">
        <div className={`icon-orb text-${color}-400`}>
          <Icon className="w-6 h-6 neon-icon" />
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded
          bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}
        >
          <ArrowUpRight className="w-3 h-3" />
          {change}
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-white mb-1 tracking-tight group-hover:scale-105 transition-transform origin-left">
          {value}
        </h3>
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          {desc}
        </p>
      </div>
    </div>
  );
};
