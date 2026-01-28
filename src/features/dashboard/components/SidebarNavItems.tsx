import { ChevronRight, GraduationCap, Moon, User } from "lucide-react";

type NavItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  navClass: string;
};

export const sidebarNavItems = [
  {
    title: "Ruang Al-Qur'an",
    description: "Jaga Hafalan Suci",
    icon: <Moon className="w-5 h-5" />,
    color: "emerald",
    navClass: "nav-quran",
  },
  {
    title: "Ruang Kelas",
    description: "Terstruktur & Akademis",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "blue",
    navClass: "nav-class",
  },
  {
    title: "Ruang Pribadi",
    description: "Materi Pilihan Anda",
    icon: <User className="w-5 h-5" />,
    color: "purple",
    navClass: "nav-private",
  },
];

export function NavItem({
  title,
  description,
  icon,
  color,
  navClass,
}: NavItemProps) {
  return (
    <div className={`nav-card ${navClass} group`}>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center border
        bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h4
          className={`text-sm font-serif text-white group-hover:text-${color}-300`}
        >
          {title}
        </h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>

      <ChevronRight
        className={`w-4 h-4 text-${color}-500/50 group-hover:translate-x-1 transition`}
      />
    </div>
  );
}
