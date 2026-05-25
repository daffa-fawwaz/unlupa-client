import { Loader2 } from "lucide-react";

interface SectionLoaderProps {
  message?: string;
  className?: string;
}

export const SectionLoader = ({
  message = "Memuat data...",
  className = "",
}: SectionLoaderProps) => {
  return (
    <div
      className={`relative z-10 flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 px-6 py-12 text-center backdrop-blur-xl shadow-inner shadow-black/20 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
        <Loader2 className="h-9 w-9 animate-spin text-amber-400" />
      </div>
      <div>
        <p className="text-base font-semibold text-white">{message}</p>
        <p className="text-sm text-gray-400">
          Tunggu sebentar, kami sedang mengambil data.
        </p>
      </div>
    </div>
  );
};
