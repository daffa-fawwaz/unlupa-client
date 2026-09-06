import { useEffect, useState } from "react";
import { Search, X, Check, BookOpen, Loader2 } from "lucide-react";
import { useBooks } from "@/features/personal/hooks/useBooks";
import { useAddBookToClass } from "../../hooks/useClassroom";
import { toast } from "sonner";
import type { GetClassBook } from "../../types";
import { resolveAssetUrl } from "@/lib/assets";

interface AddBookToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
  currentClassBooks: GetClassBook[];
}

export const AddBookToClassModal = ({
  isOpen,
  onClose,
  classroomId,
  currentClassBooks,
}: AddBookToClassModalProps) => {
  const { books, loading, fetchBooks } = useBooks();
  const { mutateAsync: addBookToClass, isPending: isAdding } =
    useAddBookToClass();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Fetch teacher's books when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBooks();
      setSelectedBookId(null);
      setSearchTerm("");
    }
  }, [isOpen, fetchBooks]);

  if (!isOpen) return null;

  // Filter out books that are already in the class
  const classBookIds = new Set(currentClassBooks.map((cb) => cb.book_id));
  const availableBooks = books.filter((b) => !classBookIds.has(b.id));

  // Filter by search query
  const filteredBooks = availableBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAdd = async () => {
    if (!selectedBookId) return;

    const toastId = toast.loading("Menambahkan buku ke kelas...");
    try {
      const order = currentClassBooks.length + 1;
      await addBookToClass({
        classId: classroomId,
        bookId: selectedBookId,
        order,
      });

      toast.success("Buku berhasil ditambahkan ke kelas!", {
        id: toastId,
        duration: 3000,
      });
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menambahkan buku ke kelas.", {
        id: toastId,
        duration: 4000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-2xl max-w-xl w-full flex flex-col max-h-[85vh] relative shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground leading-tight">
                Tambahkan Buku ke Kelas
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pilih salah satu buku Anda untuk dibagikan ke seluruh siswa
                kelas ini.
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

        {/* Content Container */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 min-h-0">
          {books.length > 0 && availableBooks.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari judul buku..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-surface-1 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-primary/50 transition-all"
              />
            </div>
          )}

          {/* Book List State Management */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">
                Memuat daftar buku Anda...
              </p>
            </div>
          ) : books.length === 0 ? (
            /* Empty State: No Books owned by teacher */
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-surface-1">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                Belum Ada Buku
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Anda belum memiliki buku yang dapat ditambahkan ke kelas ini.
              </p>
            </div>
          ) : availableBooks.length === 0 ? (
            /* Empty State: All books already added to classroom */
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-surface-1">
              <Check className="h-10 w-10 text-success mx-auto mb-3 bg-success/10 p-2 rounded-full border border-success/20" />
              <p className="text-sm font-medium text-foreground">
                Semua Buku Sudah Ditambahkan
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Semua buku Anda sudah ditambahkan ke kelas ini.
              </p>
            </div>
          ) : filteredBooks.length === 0 ? (
            /* Empty State: Search matches none */
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-surface-1">
              <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                Buku Tidak Ditemukan
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Tidak ada buku dengan judul "{searchTerm}" yang tersedia untuk
                ditambahkan.
              </p>
            </div>
          ) : (
            /* Grid layout of available books */
            <div className="grid gap-3 grid-cols-1 overflow-y-auto">
              {filteredBooks.map((book) => {
                const isSelected = selectedBookId === book.id;
                return (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBookId(book.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                        : "border-border bg-surface-1 hover:bg-surface-2 hover:border-border"
                    }`}
                  >
                    {/* Cover image or fallback */}
                    <div className="h-14 w-10 rounded bg-surface-1 border border-border shrink-0 overflow-hidden flex items-center justify-center relative">
                      {book.cover_image ? (
                        <img
                          src={resolveAssetUrl(book.cover_image)}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {book.title}
                      </h5>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                        {book.description || "Tidak ada deskripsi singkat."}
                      </p>
                    </div>

                    {/* Radio/Check selector */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border group-hover:border-border"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
            type="button"
            disabled={!selectedBookId || isAdding}
            onClick={handleAdd}
            className="px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menambahkan...
              </>
            ) : (
              "Tambahkan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
