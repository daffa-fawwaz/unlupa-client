import { BookOpen, Users, User } from "lucide-react";
import { Link } from "react-router";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: "amber" | "blue" | "emerald";
}

const QuickAccessCard = ({
  title,
  description,
  icon,
  href,
  color,
}: QuickAccessCardProps) => {
  const colorClasses = {
    amber: {
      bg: "from-amber-500/10 to-transparent",
      border: "border-amber-500/20 hover:border-amber-500/50",
      iconBg: "bg-amber-500/20",
      iconText: "text-amber-500",
      titleText: "text-amber-100 group-hover:text-white",
      descText: "text-amber-500/60",
      hover: "hover:from-amber-500/20",
    },
    blue: {
      bg: "from-blue-500/10 to-transparent",
      border: "border-blue-500/20 hover:border-blue-500/50",
      iconBg: "bg-blue-500/20",
      iconText: "text-blue-500",
      titleText: "text-blue-100 group-hover:text-white",
      descText: "text-blue-500/60",
      hover: "hover:from-blue-500/20",
    },
    emerald: {
      bg: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/20 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/20",
      iconText: "text-emerald-500",
      titleText: "text-emerald-100 group-hover:text-white",
      descText: "text-emerald-500/60",
      hover: "hover:from-emerald-500/20",
    },
  };

  const colors = colorClasses[color];

  return (
    <Link
      to={href}
      className={`group p-4 rounded-xl bg-linear-to-r ${colors.bg} border ${colors.border} ${colors.hover} transition flex items-center gap-3 text-left cursor-pointer`}
    >
      <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconText} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h4 className={`text-sm font-bold ${colors.titleText}`}>
          {title}
        </h4>
        <p className={`text-[10px] ${colors.descText}`}>
          {description}
        </p>
      </div>
    </Link>
  );
};

interface QuickAccessCardsProps {
  role?: "student" | "teacher" | "admin";
}

export const QuickAccessCards = ({ role = "student" }: QuickAccessCardsProps) => {
  // Define quick access items based on role
  const getQuickAccessItems = () => {
    if (role === "student") {
      return [
        {
          title: "Dashboard Quran",
          description: "Kelola hafalan Al-Qur'an",
          icon: <BookOpen className="w-4 h-4" />,
          href: "/dashboard/alquran",
          color: "amber" as const,
        },
        {
          title: "Dashboard Kelas",
          description: "Lihat jadwal & materi",
          icon: <Users className="w-4 h-4" />,
          href: "/dashboard/kelas",
          color: "blue" as const,
        },
        {
          title: "Dashboard Pribadi",
          description: "Progress & statistik",
          icon: <User className="w-4 h-4" />,
          href: "/dashboard/pribadi",
          color: "emerald" as const,
        },
      ];
    }

    if (role === "teacher") {
      return [
        {
          title: "Dashboard Quran",
          description: "Monitor hafalan siswa",
          icon: <BookOpen className="w-4 h-4" />,
          href: "/dashboard/alquran",
          color: "amber" as const,
        },
        {
          title: "Kelola Kelas",
          description: "Jadwal & siswa",
          icon: <Users className="w-4 h-4" />,
          href: "/dashboard/classes",
          color: "blue" as const,
        },
        {
          title: "Dashboard Pribadi",
          description: "Statistik mengajar",
          icon: <User className="w-4 h-4" />,
          href: "/dashboard/profile",
          color: "emerald" as const,
        },
      ];
    }

    // Admin
    return [
      {
        title: "Dashboard Quran",
        description: "Overview hafalan",
        icon: <BookOpen className="w-4 h-4" />,
        href: "/dashboard/alquran",
        color: "amber" as const,
      },
      {
        title: "Kelola Kelas",
        description: "Semua kelas aktif",
        icon: <Users className="w-4 h-4" />,
        href: "/dashboard/classes",
        color: "blue" as const,
      },
      {
        title: "Dashboard Pribadi",
        description: "Pengaturan akun",
        icon: <User className="w-4 h-4" />,
        href: "/dashboard/profile",
        color: "emerald" as const,
      },
    ];
  };

  const items = getQuickAccessItems();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 mb-10">
      <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-amber-500" />
        Akses Cepat
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <QuickAccessCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            href={item.href}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};
