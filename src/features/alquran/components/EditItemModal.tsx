import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";
import { alquranService } from "@/features/alquran/services/alquran.services";
import type { UpdateItemPayload, UpdateItemResponse } from "@/features/alquran/types/quran.types";

interface EditItemModalProps {
  isOpen: boolean;
  itemId: string;
  contentRef: string;
  onClose: () => void;
  onSuccess: (updatedItem: UpdateItemResponse["data"]) => void;
}

export const EditItemModal = ({
  isOpen,
  itemId,
  contentRef,
  onClose,
  onSuccess,
}: EditItemModalProps) => {
  const [mode, setMode] = useState<"surah" | "page">("surah");
  const [contentRefValue, setContentRefValue] = useState(contentRef);
  const [estimateValue, setEstimateValue] = useState<number>(3);
  const [estimateUnit, setEstimateUnit] = useState<"minutes" | "seconds">(
    "minutes"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const parsed = parseContentRef(contentRef);
      setMode(parsed.type as "surah" | "page");
      setContentRefValue(contentRef);
      // Default estimate values
      setEstimateValue(3);
      setEstimateUnit("minutes");
      setError(null);
    }
  }, [isOpen, contentRef]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload: UpdateItemPayload = {
        mode,
        content_ref: contentRefValue,
        estimate_value: estimateValue,
        estimate_unit: estimateUnit,
      };

      const response = await alquranService.updateItem(itemId, payload);
      onSuccess(response.data);
      onClose();
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message || "Gagal mengupdate item";
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

        <div className="rounded-2xl border border-border bg-card shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-foreground mb-2">
              Edit Item Hafalan
            </h3>
            <p className="text-muted-foreground text-sm">
              Ubah konfigurasi item hafalan ini
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-destructive/90 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Tipe Hafalan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("surah")}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    mode === "surah"
                      ? "bg-success text-success-foreground"
                      : "bg-surface-1 text-muted-foreground hover:bg-surface-2"
                  }`}
                >
                  Per Surah
                </button>
                <button
                  type="button"
                  onClick={() => setMode("page")}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    mode === "page"
                      ? "bg-success text-success-foreground"
                      : "bg-surface-1 text-muted-foreground hover:bg-surface-2"
                  }`}
                >
                  Per Halaman
                </button>
              </div>
            </div>

            {/* Content Ref */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Content Reference
              </label>
              <input
                type="text"
                value={contentRefValue}
                onChange={(e) => setContentRefValue(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-1 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-success/50 focus:ring-2 focus:ring-success/20 transition-all"
                placeholder="surah:67:15-25"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: surah:{`{nomor_surah}`}:{`{ayat_mulai}`}-{`{ayat_akhir}`}
              </p>
            </div>

            {/* Estimate Value */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Estimasi Waktu
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={estimateValue}
                  onChange={(e) => setEstimateValue(Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-xl bg-surface-1 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-success/50 focus:ring-2 focus:ring-success/20 transition-all"
                  placeholder="3"
                  min="1"
                />
                <select
                  value={estimateUnit}
                  onChange={(e) =>
                    setEstimateUnit(e.target.value as "minutes" | "seconds")
                  }
                  className="px-4 py-3 rounded-xl bg-surface-1 border border-border text-foreground focus:outline-none focus:border-success/50 focus:ring-2 focus:ring-success/20 transition-all"
                >
                  <option value="minutes">Menit</option>
                  <option value="seconds">Detik</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
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
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-success hover:bg-success/90 text-success-foreground font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
