import { ClassroomSearchInput } from "@/features/classroom/components/shared/ClassroomSearchInput";
import type { ElementType, ReactNode } from "react";

interface EmptyStateWrapperProps {
  // Header Section
  title: string;
  badge?: string;
  subtitle?: string;

  // Empty State Section
  emptyTitle: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon: ElementType;
  buttonIcon?: ElementType;

  // Styling Customization
  className?: string;
  mainBgColor?: string;
  wrapperGradient?: string;
  glowColor?: string;
  borderColor?: string;
  buttonClassName?: string;
  colorScheme?: "blue" | "green" | "red" | "orange";

  children?: ReactNode;
}

const COLOR_MAPS = {
  blue: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    iconWrapper:
      "border-blue-500/20 bg-blue-900/20 shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    icon: "text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    glow: "bg-blue-500/5",
  },
  green: {
    badge: "border-green-500/20 bg-green-500/10 text-green-400",
    iconWrapper:
      "border-green-500/20 bg-green-900/20 shadow-[0_0_40px_rgba(34,197,94,0.15)]",
    icon: "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]",
    glow: "bg-green-500/5",
  },
  red: {
    badge: "border-red-500/20 bg-red-500/10 text-red-400",
    iconWrapper:
      "border-red-500/20 bg-red-900/20 shadow-[0_0_40px_rgba(239,68,68,0.15)]",
    icon: "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]",
    glow: "bg-red-500/5",
  },
  orange: {
    badge: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    iconWrapper:
      "border-orange-500/20 bg-orange-900/20 shadow-[0_0_40px_rgba(249,115,22,0.15)]",
    icon: "text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]",
    glow: "bg-orange-500/5",
  },
};

export const EmptyStateWrapper = ({
  title,
  badge,
  subtitle,
  children,
  buttonText,
  emptyTitle,
  description,
  onButtonClick,
  icon: Icon,
  buttonIcon: ButtonIcon,
  className = "",
  mainBgColor = "bg-[#050914]",
  wrapperGradient = "bg-linear-to-b from-[#0A1128]/80 to-[#050914]/90",
  glowColor,
  borderColor = "border-white/[0.04]",
  buttonClassName = "",
  colorScheme = "blue",
}: EmptyStateWrapperProps) => {
  const colors = COLOR_MAPS[colorScheme];
  const finalGlowColor = glowColor || colors.glow;

  return (
    <section
      className={`w-full px-6 mt-6 rounded-2xl py-10 sm:px-10 sm:py-12 ${mainBgColor} ${className}`}
    >
      {/* 1. Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {badge && (
              <span
                className={`rounded-full w-fit border px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md ${colors.badge}`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm font-light tracking-wide text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-2 md:mt-0">
          <ClassroomSearchInput placeholder="Cari kelas..." />
        </div>
      </div>

      {/* 2. Main Wrapper */}
      <div
        className={`relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border ${borderColor} ${wrapperGradient} shadow-2xl backdrop-blur-3xl p-6 sm:p-10`}
      >
        {/* Radial Glow Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${finalGlowColor} blur-[120px]`}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-50" />
        </div>

        {/* KONDISI DINAMIS: */}
        {children ? (
          /* JIKA ADA DATA / CHILDREN: Tampilkan card-card kamu di sini */
          <div className="relative z-10 w-full h-full">{children}</div>
        ) : (
          /* JIKA KOSONG: Tampilkan konten Empty State asli yang tadi */
          <div className="relative z-10 flex flex-col items-center text-center p-6 animate-fadeIn">
            {/* Icon Wrapper */}
            <div
              className={`mb-10 flex h-[120px] w-[120px] items-center justify-center rounded-[2rem] border backdrop-blur-xl ${colors.iconWrapper}`}
            >
              <Icon className={`h-12 w-12 ${colors.icon}`} />
            </div>

            {/* Empty Title */}
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-md">
              {emptyTitle}
            </h2>

            {/* Description */}
            <p className="mb-12 max-w-[500px] text-base leading-relaxed text-gray-400">
              {description}
            </p>

            {/* CTA Button */}
            {buttonText && (
              <button
                onClick={onButtonClick}
                className={`rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
