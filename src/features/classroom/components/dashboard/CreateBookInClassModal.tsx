import { useState, useRef } from "react";
import { X, BookOpen, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useCreateBookInClass } from "../../hooks/useClassroom";
import { toast } from "sonner";

interface CreateBookInClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
  nextOrder: number;
}

export const CreateBookInClassModal = ({
  isOpen,
  onClose,
  classroomId,
  nextOrder,
}: CreateBookInClassModalProps) => {
  const { mutateAsync: createBookInClass, isPending } = useCreateBookInClass();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const toastId = toast.loading("Membuat buku baru di kelas...");
    try {
      await createBookInClass({
        classId: classroomId,
        title: title.trim(),
        description: description.trim(),
        order: nextOrder,
        cover_image: coverImage || undefined,
      });

      toast.success("Buku baru berhasil dibuat dan ditambahkan ke kelas!", {
        id: toastId,
        duration: 3000,
      });

      // Reset form
      setTitle("");
      setDescription("");
      handleRemoveImage();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Gagal membuat buku di kelas.", {
        id: toastId,
        duration: 4000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-2xl max-w-xl w-full flex flex-col max-h-[90vh] relative shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-xl border border-success/20 text-success">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground leading-tight">
                Buat Buku Baru di Kelas
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Buku ini akan otomatis dikaitkan dengan kelas ini sehingga semua siswa dapat mengabdi padanya.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Judul Buku <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="cth. Kitab Matan Al-Ajurrumiyyah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-1 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-success/50 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Deskripsi Buku <span className="text-muted-foreground font-normal lowercase">(opsional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Gambaran singkat atau pengantar mengenai buku ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-1 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-success/50 transition-all resize-none"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Gambar Sampul / Cover <span className="text-muted-foreground font-normal lowercase">(opsional)</span>
              </label>

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-border group max-h-48 bg-surface-1 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview cover"
                    className="h-44 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-destructive text-foreground rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-border hover:border-success/40 rounded-xl p-6 text-center cursor-pointer bg-surface-1 hover:bg-surface-2 transition-all group"
                >
                  <div className="h-10 w-10 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Klik untuk unggah gambar sampul
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    PNG, JPG, JPEG, WEBP (Maksimal 3MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-surface-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isPending}
              className="px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-success hover:bg-success/90 text-success-foreground font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Membuat Buku...
                </>
              ) : (
                "Buat & Tambahkan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
