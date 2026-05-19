import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const SectionCard = ({
  title,
  description,
  action,
  children,
  className = "",
}: SectionCardProps) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#111620]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      {/* Soft Ambient Light & Structural Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/5 blur-[80px]" />

      {/* Header Section */}
      <div className="relative z-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 text-sm font-light text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Right-side Action */}
        <div className="shrink-0">
          {action !== undefined ? (
            action
          ) : (
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children ? (
          children
        ) : (
          /* Empty Slot Demo */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] py-16 px-4 transition-colors hover:bg-white/[0.04]">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Area Konten Utama {children}
            </p>
            <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-32 rounded-xl border border-dashed border-white/10 bg-white/[0.02] shadow-inner" />
              <div className="h-32 rounded-xl border border-dashed border-white/10 bg-white/[0.02] shadow-inner" />
              <div className="hidden h-32 rounded-xl border border-dashed border-white/10 bg-white/[0.02] shadow-inner lg:block" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
