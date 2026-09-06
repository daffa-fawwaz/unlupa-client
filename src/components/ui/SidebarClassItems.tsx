import { ChevronRight, GraduationCap, Moon, User } from "lucide-react";
import { NavLink } from "react-router";

type NavClassItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  navClass: string;
  href: string;
  onClose?: () => void;
};

export const sidebarClassItems = [
  {
    title: "Ruang Al-Qur'an",
    description: "Jaga Hafalan Suci",
    icon: <Moon className="w-5 h-5" />,
    color: "emerald",
    navClass: "border-success/20 bg-success/10 hover:border-success/50 hover:bg-success/20",
    href: "dashboard/alquran",
  },
  {
    title: "Ruang Kelas",
    description: "Terstruktur & Akademis",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "blue",
    navClass: "border-info/20 bg-info/10 hover:border-info/50 hover:bg-info/20",
    href: "dashboard/kelas",
  },
  {
    title: "Ruang Pribadi",
    description: "Materi Pilihan Anda",
    icon: <User className="w-5 h-5" />,
    color: "purple",
    navClass: "border-primary/20 bg-primary/10 hover:border-primary/50 hover:bg-primary/20",
    href: "dashboard/pribadi",
  },
];

const roomIconStyles: Record<string, string> = {
  emerald: "bg-success/20 text-success border-success/30",
  blue: "bg-info/20 text-info border-info/30",
  purple: "bg-primary/20 text-primary border-primary/30",
};

const roomTitleStyles: Record<string, string> = {
  emerald: "group-hover:text-success",
  blue: "group-hover:text-info",
  purple: "group-hover:text-primary",
};

const roomChevronStyles: Record<string, string> = {
  emerald: "text-success/50",
  blue: "text-info/50",
  purple: "text-primary/50",
};

export function NavClassItem({
  title,
  description,
  icon,
  color,
  navClass,
  href,
  onClose,
}: NavClassItemProps) {
  return (
    <NavLink onClick={onClose} to={`/${href}`} className={`flex items-center gap-4 p-4 rounded-2xl border bg-surface-1 mb-3 cursor-pointer transition-all relative overflow-hidden group hover:translate-x-1 ${navClass}`}>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center border ${roomIconStyles[color]}`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h4
          className={`text-sm font-serif text-foreground ${roomTitleStyles[color]}`}
        >
          {title}
        </h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <ChevronRight
        className={`w-4 h-4 ${roomChevronStyles[color]} group-hover:translate-x-1 transition`}
      />
    </NavLink>
  );
}
