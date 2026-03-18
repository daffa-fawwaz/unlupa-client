import { useState } from "react";
import { X, Loader2, AlertTriangle, Trash2, AlertCircle } from "lucide-react";
import { alquranService } from "@/features/alquran/services/alquran.services";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemId: string;
  contentRef: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  itemId,
  contentRef,
  onClose,
  onSuccess,
}: DeleteConfirmModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = parseContentRef(contentRef);
  const itemTitle = `${parsed.title} – ${parsed.subtitle}`;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await alquranService.deleteItem(itemId);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "Gagal menghapus item";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="rounded-3xl border border-rose-500/30 bg-linear-to-br from-[#1A2232] via-[#2A1515] to-[#1A1111] shadow-[0_40px_100px_rgba(0,0,0,0.7)] p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-2xl font-black text-white text-center mb-2">
              Hapus Item Hafalan?
            </h3>
            <p className="text-gray-400 text-sm text-center">
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>

          {/* Item Info */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">{itemTitle}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Item ini akan dihapus secara permanen dari database
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-rose-400/30 bg-rose-500/10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Hapus Permanen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
