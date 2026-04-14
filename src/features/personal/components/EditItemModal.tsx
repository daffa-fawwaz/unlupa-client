import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, FileText, Lock, ListOrdered, Clock } from "lucide-react";
import { useUpdateItem } from "@/features/personal/hooks/useUpdateItem";
import type { BookItem, UpdateItemPayload, CreatedItem } from "@/features/personal/types/personal.types";

interface EditItemModalProps {
  isOpen: boolean;
  item: BookItem;
  onClose: () => void;
  onSuccess: (updatedItem: CreatedItem) => void;
}

export const EditItemModal = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}: EditItemModalProps) => {
  const { updateItem, loading } = useUpdateItem();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateItemPayload>({
    title: "",
    content: "",
    answer: "",
    order: 1,
    estimate_value: 1,
    estimate_unit: "minutes",
  });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        title: item.title,
        content: item.content,
        answer: item.answer,
        order: item.order,
        estimate_value: item.estimated_review_seconds ? Math.floor(item.estimated_review_seconds / 60) : 1,
        estimate_unit: "minutes",
      });
      setError(null);
    }
  }, [isOpen, item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" || name === "estimate_value" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.content.trim()) {
      setError("Pertanyaan wajib diisi");
      return;
    }

    try {
      const response = await updateItem(item.id, formData);
      onSuccess(response);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || "Gagal memperbarui item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="rounded-[2.5rem] border border-white/10 bg-[#0E1420] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-white/10 pr-14 sm:pr-8">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
              Edit Item
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Ubah data item ini
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl border border-rose-400/30 bg-rose-500/10 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5">
            {/* Content (Question) */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Pertanyaan
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 text-gray-500">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-sm sm:text-base"
                  placeholder="Masukkan pertanyaan"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Answer */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Jawaban
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-sm sm:text-base"
                  placeholder="Masukkan jawaban"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Urutan
              </label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                  placeholder="1"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Estimate Value & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Estimasi Nilai
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    name="estimate_value"
                    value={formData.estimate_value}
                    onChange={handleChange}
                    min="1"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                    placeholder="1"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Satuan Waktu
                </label>
                <select
                  name="estimate_unit"
                  value={formData.estimate_unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                  disabled={loading}
                >
                  <option value="minutes">Menit</option>
                  <option value="seconds">Detik</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer text-sm sm:text-base"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-5 py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
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
          </form>
        </div>
      </div>
    </div>
  );
};
