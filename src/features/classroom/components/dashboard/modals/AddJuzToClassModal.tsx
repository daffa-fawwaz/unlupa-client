import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, ChevronDown, Loader2, PlusCircle, X } from "lucide-react";

interface AddJuzToClassModalProps {
  isOpen: boolean;
  classId: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (juzIndex: number) => void | Promise<void>;
}

export const AddJuzToClassModal = ({
  isOpen,
  classId,
  isLoading = false,
  errorMessage,
  onClose,
  onSubmit,
}: AddJuzToClassModalProps) => {
  const [selectedJuz, setSelectedJuz] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedJuz("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedJuz) return;
    void onSubmit(Number(selectedJuz));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground transition hover:bg-surface-2 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <div className="mb-8 rounded-2xl border border-border bg-surface-1 p-6">
            <div className="flex items-center gap-3 text-primary">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Kelas Quran
                </p>
                <h2 className="text-2xl font-black text-foreground">
                  Tambahkan Juz
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Pilih juz yang akan ditambahkan ke kelas ini. Juz akan dibuat
              dengan scope kelas saat ini.
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Class ID: {classId}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Pilih Juz
            </label>
            <div className="relative">
              <select
                value={selectedJuz}
                onChange={(e) => setSelectedJuz(e.target.value)}
                disabled={isLoading}
                className="w-full appearance-none rounded-2xl border border-border bg-surface-1 py-4 pl-4 pr-10 text-foreground outline-none transition focus:border-primary focus:bg-surface-2 disabled:opacity-50"
              >
                <option value="">-- Pilih Juz --</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                  <option key={juz} value={juz.toString()}>
                    Juz {juz}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedJuz}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-warning hover:bg-warning/90 px-4 py-4 font-bold uppercase tracking-wider text-warning-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                Tambahkan Juz
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
