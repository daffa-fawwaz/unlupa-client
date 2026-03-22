import { useState } from "react";
import { X, Loader2, BookOpen, FileText, Image as ImageIcon, Save } from "lucide-react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useBooks } from "../hooks/useBooks";
import type { Book } from "../types/personal.types";

interface EditBookModalProps {
  book: Book;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditBookModal = ({ book, onClose, onSuccess }: EditBookModalProps) => {
  const { updateBook, loading } = useBooks();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: book.title,
    description: book.description,
    cover_image: book.cover_image,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("Judul kitab wajib diisi");
      return;
    }

    try {
      setErrorMsg(null);
      await updateBook(book.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        cover_image: formData.cover_image.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui kitab");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-[550px] bg-[rgba(10,12,15,0.95)] border border-blue-500/30 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-white">Edit Materi</h1>
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
            <label className="block text-sm font-bold tracking-wide text-blue-400 mb-2 ml-1">
              Judul Kitab <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Arabiyah Baina Yadaik"
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl font-inter focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-colors disabled:opacity-50 box-border"
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 w-full">
            <label className="block text-sm font-bold tracking-wide text-blue-400 mb-2 ml-1">
              Deskripsi Singkat
            </label>
            <div className="relative w-full">
              <div className="absolute top-4 left-4 text-gray-500">
                <FileText className="w-5 h-5" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Opsional: Tulis deskripsi kitab..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl font-inter focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-colors disabled:opacity-50 resize-none box-border"
                disabled={loading}
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="mb-8 w-full">
            <label className="block text-sm font-bold tracking-wide text-blue-400 mb-2 ml-1">
              URL Cover Image (Opsional)
            </label>
            <div className="relative w-full">
              <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
                <ImageIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl font-inter focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-colors disabled:opacity-50 box-border"
                disabled={loading}
              />
            </div>
          </div>

          <ErrorMessage message={errorMsg} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="w-full py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-bold tracking-wider rounded-2xl transition-all hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed mt-2"
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
