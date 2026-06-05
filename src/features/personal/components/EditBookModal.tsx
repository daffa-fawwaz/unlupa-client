import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, BookOpen, FileText, Image, Upload, Save } from "lucide-react";
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
    cover_image: book.cover_image as string | File,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const fileType = file.type;
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isValidExtension = ["jpg", "jpeg", "png"].includes(fileExtension || "");

      if (!validTypes.includes(fileType) && !isValidExtension) {
        setErrorMsg("Format file tidak didukung. Harap pilih gambar JPG, PNG, atau JPEG.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Ukuran gambar terlalu besar. Maksimal ukuran adalah 5MB.");
        return;
      }

      setErrorMsg(null);
      setFormData((prev) => ({
        ...prev,
        cover_image: file,
      }));
    }
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
        cover_image:
          formData.cover_image instanceof File
            ? formData.cover_image
            : formData.cover_image.trim() || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui kitab");
    }
  };

  const hasExistingCover = typeof book.cover_image === "string" && book.cover_image.length > 0;
  const hasNewFile = formData.cover_image instanceof File;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" style={{ zIndex: 9999 }}>
      <div className="w-full max-w-[550px] bg-[rgba(10,12,15,0.95)] border border-blue-500/30 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

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

          <div className="mb-8 w-full">
            <label className="block text-sm font-bold tracking-wide text-blue-400 mb-2 ml-1">
              Cover Image (Opsional)
            </label>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center transition hover:bg-white/8 hover:border-blue-500/30 min-h-36">
              {hasNewFile ? (
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 border border-blue-400/20">
                    <Image className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-xs">
                      {(formData.cover_image as File).name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {((formData.cover_image as File).size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        cover_image: book.cover_image,
                      }));
                    }}
                    className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              ) : hasExistingCover ? (
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="h-24 w-auto object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        cover_image: "" as string | File,
                      }));
                    }}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                  >
                    Hapus Gambar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="cover_image_upload"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-gray-400 border border-white/10">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300">
                        Pilih atau seret gambar ke sini
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, atau JPEG (Maks. 5MB)
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <ErrorMessage message={errorMsg} />

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
    </div>,
    document.body
  );
};
