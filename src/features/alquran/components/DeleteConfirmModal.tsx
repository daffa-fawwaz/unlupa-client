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
          className="absolute top-4 right-4 p-2 rounded-full bg-surface-1 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="rounded-2xl border border-destructive/30 bg-card shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20 border border-destructive/40 mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-2xl font-black text-foreground text-center mb-2">
              Hapus Item Hafalan?
            </h3>
            <p className="text-muted-foreground text-sm text-center">
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>

          {/* Item Info */}
          <div className="mb-6 p-4 rounded-xl bg-surface-1 border border-border">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-semibold">{itemTitle}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Item ini akan dihapus secara permanen dari database
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-destructive/90 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-surface-1 border border-border text-muted-foreground font-semibold hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
