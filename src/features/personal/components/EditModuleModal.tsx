import { useState } from "react";
import { X, Loader2, Layers, FileText, Hash, Save } from "lucide-react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useUpdateModule } from "../hooks/useUpdateModule";
import type { Module } from "../types/personal.types";

interface EditModuleModalProps {
  module: Module;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditModuleModal = ({ module, onClose, onSuccess }: EditModuleModalProps) => {
  const { updateModule, loading } = useUpdateModule();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: module.title,
    description: module.description,
    order: module.order,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      order: parseInt(e.target.value, 10) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("Judul modul wajib diisi");
      return;
    }

    try {
      setErrorMsg(null);
      await updateModule(module.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        order: formData.order,
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui modul");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-[550px] bg-[rgba(10,12,15,0.95)] border border-purple-500/30 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-white">Edit Modul</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col">
          {/* Title */}
          <div className="mb-6 w-full">
            <label className="block text-sm font-bold tracking-wide text-purple-400 mb-2 ml-1">
              Judul Modul <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
                <FileText className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Bab 1 - Muqadimah"
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl font-inter focus:outline-none focus:border-purple-500 focus:bg-purple-500/5 transition-colors disabled:opacity-50 box-border"
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 w-full">
            <label className="block text-sm font-bold tracking-wide text-purple-400 mb-2 ml-1">
              Deskripsi
            </label>
            <div className="relative w-full">
              <div className="absolute top-4 left-4 text-gray-500">
                <FileText className="w-5 h-5" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Opsional: Tulis deskripsi modul..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl font-inter focus:outline-none focus:border-purple-500 focus:bg-purple-500/5 transition-colors disabled:opacity-50 resize-none box-border"
                disabled={loading}
              />
            </div>
          </div>

          {/* Order */}
          <div className="mb-8 w-full">
            <label className="block text-sm font-bold tracking-wide text-purple-400 mb-2 ml-1">
              Urutan Modul
            </label>
            <div className="relative w-full">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
                <Hash className="w-5 h-5" />
              </div>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleNumberChange}
                placeholder="1"
                min="1"
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl font-inter focus:outline-none focus:border-purple-500 focus:bg-purple-500/5 transition-colors disabled:opacity-50 box-border"
                disabled={loading}
              />
            </div>
          </div>

          <ErrorMessage message={errorMsg} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="w-full py-4 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-bold tracking-wider rounded-2xl transition-all hover:shadow-[0_10px_30px_-10px_rgba(147,51,234,0.5)] flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="opacity-90">Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
