import type { ElementType, ReactNode } from "react";

interface EmptyStateWrapperProps {
  // Header Section
  title: string;
  badge?: string;
  subtitle?: string;

  // Empty State Section
  emptyTitle: string;
  description: string;
  buttonText: string;
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

  children?: ReactNode;
}

export const EmptyStateWrapper = ({
  title,
  badge,
  subtitle,
  children,
  emptyTitle,
  description,
  buttonText,
  onButtonClick,
  icon: Icon,
  buttonIcon: ButtonIcon,
  className = "",
  mainBgColor = "bg-[#050914]",
  wrapperGradient = "bg-linear-to-b from-[#0A1128]/80 to-[#050914]/90",
  glowColor = "bg-blue-500/5",
  borderColor = "border-white/[0.04]",
  buttonClassName = "",
}: EmptyStateWrapperProps) => {
  return (
    <section
      className={`w-full px-6 mt-6 rounded-2xl py-10 sm:px-10 sm:py-12 ${mainBgColor} ${className}`}
    >
      {/* 1. Header Area */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {badge && (
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
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

      {/* 2. Main Wrapper */}
      <div
        className={`relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border ${borderColor} ${wrapperGradient} shadow-2xl backdrop-blur-3xl p-6 sm:p-10`}
      >
        {/* Radial Glow Background (Tetap biarkan ada agar background-nya konsisten bagus) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowColor} blur-[120px]`}
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
            <div className="mb-10 flex h-[120px] w-[120px] items-center justify-center rounded-[2rem] border border-blue-500/20 bg-blue-900/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-xl">
              <Icon className="h-12 w-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
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
            <button
              onClick={onButtonClick}
              className={`group relative flex h-14 items-center justify-center gap-3 rounded-full bg-white px-10 text-base font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] active:translate-y-0 ${buttonClassName}`}
            >
              {ButtonIcon && (
                <ButtonIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              )}
              <span>{buttonText}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
