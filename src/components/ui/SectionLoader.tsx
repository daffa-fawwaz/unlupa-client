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
      className={`relative z-10 flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-1 border border-border">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">
          Tunggu sebentar, kami sedang mengambil data.
        </p>
      </div>
    </div>
  );
};
