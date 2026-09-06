import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useJuzToggle } from "@/features/alquran/hooks/useJuzToggle";

interface DeactivateJuzModalProps {
  isOpen: boolean;
  juzIndex: number;
  onClose: () => void;
  onDeactivated: () => void;
}

export const DeactivateJuzModal = ({
  isOpen,
  juzIndex,
  onClose,
  onDeactivated,
}: DeactivateJuzModalProps) => {
  const { deactivateJuz, loading } = useJuzToggle();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleDeactivate = async () => {
    try {
      await deactivateJuz(juzIndex);
      onDeactivated();
      onClose();
    } catch (error) {
      console.error("Gagal menonaktifkan Juz");
    }
  };

  const handleConfirmClick = () => {
    setIsConfirming(true);
  };

  const handleCancel = () => {
    setIsConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-warning/20 border-2 border-warning/40 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Nonaktifkan Juz {juzIndex}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Konfirmasi tindakan Anda
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-xl bg-surface-1 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {!isConfirming ? (
            <>
              <div className="mb-6 p-4 rounded-2xl bg-warning/10 border border-warning/20">
                <p className="text-foreground text-sm leading-relaxed">
                  Apakah Anda yakin ingin menonaktifkan{" "}
                  <span className="font-bold text-warning">
                    Juz {juzIndex}
                  </span>
                  ?
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span>
                    <span>Hafalan tidak akan muncul di dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span>
                    <span>Review harian akan dihentikan sementara</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span>
                    <span>
                      Data hafalan tetap tersimpan dan bisa diaktifkan kembali
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-3 rounded-xl bg-surface-1 border border-border text-muted-foreground font-semibold hover:bg-surface-2 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClick}
                  className="px-4 py-3 rounded-xl bg-warning text-warning-foreground font-semibold hover:bg-warning/90 transition-all"
                >
                  Lanjutkan
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                <p className="text-foreground text-sm leading-relaxed">
                  Ini adalah tindakan permanen. Ketik{" "}
                  <span className="font-mono font-bold text-destructive bg-destructive/20 px-2 py-0.5 rounded">
                    DEACTIVATE
                  </span>{" "}
                  untuk melanjutkan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-surface-1 border border-border text-muted-foreground font-semibold hover:bg-surface-2 transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "DEACTIVATE"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
    </div>
  );
};
