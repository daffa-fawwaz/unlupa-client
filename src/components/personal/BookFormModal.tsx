import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  BookOpen,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "@/components/foundations/hugeicons";
import type { Book, Language } from "../../types";
import { uploadImageToStorage } from "../../lib/imageUtils";
import { resolveAssetUrl } from "../../lib/assets";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { InlineAlert } from "@/components/base/alert/alert";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    coverUrl?: string;
    isPublic: boolean;
    category?: string;
  }) => void;
  initialData?: Partial<Book>;
  language: Language;
}

type BookFormDialogProps = Omit<BookFormModalProps, "isOpen" | "onClose">;

const BookFormDialog = ({
  onSubmit,
  initialData,
  language,
}: BookFormDialogProps) => {
  const initialCoverUrl = initialData?.coverUrl || "";
  const [form, setForm] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    coverUrl: initialData?.coverUrl || "",
    isPublic: initialData?.isPublic || false,
  }));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(
    () => resolveAssetUrl(initialData?.coverUrl) || "",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl.startsWith("blob:"))
        URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      coverUrl: form.coverUrl || undefined,
      isPublic: form.isPublic,
      category: initialData?.category || "General",
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
    setIsUploading(true);
    try {
      const storageUrl = await uploadImageToStorage(file);
      if (storageUrl.startsWith("data:") || storageUrl.startsWith("blob:")) {
        throw new Error("Cover upload did not return a persistent URL.");
      }
      setForm((current) => ({ ...current, coverUrl: storageUrl }));
    } catch (error) {
      console.error("Image upload failed", error);
      setForm((current) => ({ ...current, coverUrl: initialCoverUrl }));
      setCoverPreviewUrl(resolveAssetUrl(initialCoverUrl) || "");
      setUploadError(
        language === "en"
          ? "The cover could not be uploaded. Please try another image."
          : "Sampul gagal diunggah. Coba gunakan gambar lain.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const isEditing = Boolean(initialData?.id);

  return (
    <Modal className="max-w-xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
      <Dialog
        aria-label={
          isEditing
            ? language === "en"
              ? "Edit book"
              : "Edit kitab"
            : language === "en"
              ? "Create book"
              : "Buat kitab"
        }
      >
        {({ close }) => (
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[inherit] flex-col"
          >
            <div className="relative flex shrink-0 items-start gap-3 border-b border-secondary px-5 py-5 sm:px-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                <BookOpen className="size-5" />
              </div>
              <div className="min-w-0 pr-10">
                <h2 className="text-lg font-semibold text-primary">
                  {isEditing
                    ? language === "en"
                      ? "Edit book"
                      : "Edit kitab"
                    : language === "en"
                      ? "Create a new book"
                      : "Buat kitab baru"}
                </h2>
                <p className="mt-0.5 text-sm text-secondary">
                  {language === "en"
                    ? "Add a clear title, description, and a recognizable cover."
                    : "Tambahkan judul, deskripsi, dan sampul yang mudah dikenali."}
                </p>
              </div>
              <CloseButton
                label={
                  language === "en" ? "Close book form" : "Tutup formulir kitab"
                }
                onPress={close}
                isDisabled={isUploading}
                className="absolute right-4 top-4"
              />
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              <Input
                label={language === "en" ? "Book title" : "Judul kitab"}
                isRequired
                value={form.title}
                onChange={(value) =>
                  setForm((current) => ({ ...current, title: value }))
                }
                placeholder={
                  language === "en"
                    ? "Example: Arabic vocabulary"
                    : "Contoh: Kosakata Bahasa Arab"
                }
              />

              <TextArea
                label={language === "en" ? "Description" : "Deskripsi"}
                value={form.description}
                onChange={(value) =>
                  setForm((current) => ({ ...current, description: value }))
                }
                placeholder={
                  language === "en"
                    ? "What will you learn from this book?"
                    : "Apa yang akan dipelajari dari kitab ini?"
                }
                rows={3}
                hint={
                  language === "en"
                    ? "Optional. This appears on the book card."
                    : "Opsional. Deskripsi tampil pada kartu kitab."
                }
              />

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-secondary">
                      {language === "en" ? "Cover image" : "Gambar sampul"}
                    </p>
                    <p className="mt-0.5 text-xs text-tertiary">
                      {language === "en"
                        ? "JPG, PNG, or WebP."
                        : "JPG, PNG, atau WebP."}
                    </p>
                  </div>
                  <Button
                    color="secondary"
                    size="sm"
                    iconLeading={UploadCloud}
                    onPress={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                  >
                    {language === "en" ? "Upload" : "Unggah"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-secondary bg-secondary/30 p-3">
                  {coverPreviewUrl ? (
                    <div className="relative mx-auto aspect-[4/3] max-w-sm overflow-hidden rounded-xl bg-secondary">
                      <img
                        src={coverPreviewUrl}
                        alt={
                          language === "en"
                            ? "Book cover preview"
                            : "Pratinjau sampul kitab"
                        }
                        className="size-full object-cover"
                      />
                      <ButtonUtility
                        icon={X}
                        color="tertiary"
                        tooltip={
                          language === "en" ? "Remove cover" : "Hapus sampul"
                        }
                        onPress={() => {
                          setForm((current) => ({ ...current, coverUrl: "" }));
                          setCoverPreviewUrl("");
                        }}
                        className="absolute right-2 top-2 bg-primary/90 shadow-xs backdrop-blur-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-32 flex-col items-center justify-center text-center">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                        <ImageIcon className="size-4.5" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-primary">
                        {language === "en"
                          ? "No cover selected"
                          : "Belum ada sampul"}
                      </p>
                      <p className="mt-0.5 text-xs text-tertiary">
                        {language === "en"
                          ? "A warm gradient will be used as fallback."
                          : "Gradasi hangat akan digunakan sebagai pengganti."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {uploadError && (
                <InlineAlert
                  variant="error"
                  title={uploadError}
                  onDismiss={() => setUploadError(null)}
                />
              )}
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button
                color="secondary"
                size="md"
                onPress={close}
                isDisabled={isUploading}
                className="w-full sm:w-auto"
              >
                {language === "en" ? "Cancel" : "Batal"}
              </Button>
              <Button
                type="submit"
                size="md"
                isDisabled={!form.title.trim() || isUploading}
                className="w-full sm:w-auto"
              >
                {isEditing
                  ? language === "en"
                    ? "Save changes"
                    : "Simpan perubahan"
                  : language === "en"
                    ? "Create book"
                    : "Buat kitab"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </Modal>
  );
};

export const BookFormModal = ({
  isOpen,
  onClose,
  ...props
}: BookFormModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <BookFormDialog {...props} />
    </ModalOverlay>
  );
};
