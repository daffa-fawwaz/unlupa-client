import { BookOpen, RotateCcw, ShieldCheck, Trophy } from "lucide-react";
import { useNavigate } from "react-router";

interface QuickAccessButtonsProps {
  counts?: {
    menghafal: number;
    interval: number;
    fsrs_active: number;
    graduate: number;
  };
}

const STATUS_BUTTONS = [
  {
    id: "menghafal" as const,
    label: "Menghafal",
    description: "Item yang masih dalam tahap hafalan",
    icon: BookOpen,
    semantic: "warning",
    route: "/dashboard/alquran/status/menghafal",
  },
  {
    id: "fsrs_active" as const,
    label: "Ujian FSRS",
    description: "Item dalam jadwal ujian berkala",
    icon: ShieldCheck,
    semantic: "success",
    route: "/dashboard/alquran/status/fsrs_active",
  },
  {
    id: "graduate" as const,
    label: "Selesai",
    description: "Item yang telah diselesaikan",
    icon: Trophy,
    semantic: "primary",
    route: "/dashboard/alquran/status/graduate",
  },
];

const buttonSemanticStyles: Record<
  string,
  { hover: string; bg: string; border: string; text: string }
> = {
  warning: {
    hover: "bg-warning/10",
    bg: "bg-warning/10",
    border: "border-warning/20",
    text: "text-warning",
  },
  success: {
    hover: "bg-success/10",
    bg: "bg-success/10",
    border: "border-success/20",
    text: "text-success",
  },
  primary: {
    hover: "bg-primary/10",
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
  },
};

export const QuickAccessButtons = ({ counts }: QuickAccessButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
      {STATUS_BUTTONS.map((button) => {
        const Icon = button.icon;
        const count = counts?.[button.id] ?? 0;
        const tone = buttonSemanticStyles[button.semantic];

        return (
          <button
            key={button.id}
            onClick={() => navigate(button.route)}
            className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-5 bg-card border ${tone.border} transition-all duration-300 group text-left hover:-translate-y-1`}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 ${tone.hover} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
              {/* Icon */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${tone.bg} ${tone.text} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              {/* Label */}
              <h3 className="text-foreground font-bold text-sm md:text-base mb-1 leading-tight">
                {button.label}
              </h3>

              {/* Count */}
              <p className={`text-2xl md:text-3xl font-black ${tone.text} mb-1`}>
                {count}
              </p>

              {/* Description */}
              <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed line-clamp-2">
                {button.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
