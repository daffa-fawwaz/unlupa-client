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
      console.error("Failed to deactivate Juz:", error);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={handleCancel}
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-[#1A2232] via-[#151B28] to-[#111826] shadow-[0_40px_100px_rgba(0,0,0,0.7)] p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Nonaktifkan Juz {juzIndex}
                </h3>
                <p className="text-sm text-gray-400">
                  Konfirmasi tindakan Anda
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {!isConfirming ? (
            <>
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Apakah Anda yakin ingin menonaktifkan{" "}
                  <span className="font-bold text-amber-400">
                    Juz {juzIndex}
                  </span>
                  ?
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Hafalan tidak akan muncul di dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Review harian akan dihentikan sementara</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Data hafalan tetap tersimpan dan bisa diaktifkan kembali</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClick}
                  className="px-4 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-900/20"
                >
                  Lanjutkan
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Ini adalah tindakan permanen. Ketik{" "}
                  <span className="font-mono font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
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
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-linear-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
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
    </div>
  );
};
