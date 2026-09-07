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
  borderColor?: string;
  buttonClassName?: string;
  colorScheme?: "blue" | "green" | "red" | "orange";

  children?: ReactNode;
}

const COLOR_MAPS = {
  blue: {
    badge: "border-info/20 bg-info/10 text-info",
    iconWrapper: "border-info/30 bg-info/10",
    icon: "text-info",
    glow: "bg-info/5",
  },
  green: {
    badge: "border-success/20 bg-success/10 text-success",
    iconWrapper: "border-success/30 bg-success/10",
    icon: "text-success",
    glow: "bg-success/5",
  },
  red: {
    badge: "border-destructive/20 bg-destructive/10 text-destructive",
    iconWrapper: "border-destructive/30 bg-destructive/10",
    icon: "text-destructive",
    glow: "bg-destructive/5",
  },
  orange: {
    badge: "border-warning/20 bg-warning/10 text-warning",
    iconWrapper: "border-warning/30 bg-warning/10",
    icon: "text-warning",
    glow: "bg-warning/5",
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
  mainBgColor = "bg-background",
  wrapperGradient = "bg-card",
  borderColor = "border-border",
  buttonClassName = "",
  colorScheme = "blue",
}: EmptyStateWrapperProps) => {
  const colors = COLOR_MAPS[colorScheme];

  return (
    <section
      className={`w-full px-6 mt-6 rounded-2xl py-10 sm:px-10 sm:py-12 ${mainBgColor} ${className}`}
    >
      {/* 1. Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {badge && (
              <span
                className={`rounded-full w-fit border px-3 py-1 text-xs font-bold uppercase tracking-widest ${colors.badge}`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm font-light tracking-wide text-muted-foreground">
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
        className={`relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border ${borderColor} ${wrapperGradient} p-6 sm:p-10`}
      >
        {/* Top Border */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent opacity-50" />
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
              className={`mb-10 flex h-[120px] w-[120px] items-center justify-center rounded-xl border ${colors.iconWrapper}`}
            >
              <Icon className={`h-12 w-12 ${colors.icon}`} />
            </div>

            {/* Empty Title */}
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {emptyTitle}
            </h2>

            {/* Description */}
            <p className="mb-12 max-w-[500px] text-base leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* CTA Button */}
            {buttonText && (
              <button
                onClick={onButtonClick}
                className={`rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center gap-2 ${buttonClassName}`}
              >
                {ButtonIcon && <ButtonIcon className="h-4 w-4" />}
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
