import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  AlertCircle,
  AlignLeft,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Edit2,
  FileText,
  Hash,
  Layers,
  LayoutList,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useBookTree } from "@/features/personal/hooks/useBookTree";
import { useDeleteModule } from "@/features/personal/hooks/useDeleteModule";
import { useCreateModule } from "@/features/personal/hooks/useCreateModule";
import { EditModuleModal } from "@/features/personal/components/EditModuleModal";
import { BookItemCard } from "@/features/personal/components/BookItemCard";
import { rememberScroll, takeScroll } from "@/features/personal/utils/scrollMemory";
import { AddItemModal } from "@/features/personal/components/AddItemModal";
import { invalidateBookTreeCache } from "@/features/personal/hooks/useBookTree";
import { useBookItemStatusMap, contentRefForItem } from "@/features/personal/hooks/useBookItemStatusMap";
import type { Module, BookItem } from "@/features/personal/types/personal.types";

/* ------------------------------------------------------------------ */
/* Add Item to Module Modal                                             */
/* ------------------------------------------------------------------ */
/* Add Sub Module Modal                                                 */
/* ------------------------------------------------------------------ */
interface AddSubModuleModalProps {
  bookId: string;
  parentId: string;
  onClose: () => void;
  onCreated: (module: import("@/features/personal/types/personal.types").CreatedModule) => void;
  nextOrder: number;
}

const AddSubModuleModal = ({
  bookId,
  parentId,
  onClose,
  onCreated,
  nextOrder,
}: AddSubModuleModalProps) => {
  const { createModule, loading } = useCreateModule();
  const [form, setForm] = useState({
    title: "",
    description: "",
    orderStr: String(nextOrder),
  });
  const [resultState, setResultState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrorMsg("Judul sub-modul wajib diisi.");
      setResultState("error");
      return;
    }
    const order = Math.max(1, parseInt(form.orderStr) || 1);
    try {
      const created = await createModule(bookId, {
        title: form.title.trim(),
        description: form.description.trim(),
        order,
        parent_id: parentId,
      });
      onCreated(created);
      setResultState("success");
    } catch (err: unknown) {
      setErrorMsg((err as Error).message ?? "Terjadi kesalahan.");
      setResultState("error");
    }
  };

  const handleSuccessClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={resultState === "idle" ? onClose : undefined}
      />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-3xl bg-card border-border shadow-none overflow-hidden">
          {/* ---- Success State ---- */}
          {resultState === "success" && (
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Sub-Modul Berhasil Dibuat!
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sub-modul{" "}
                  <span className="text-foreground font-semibold">
                    "{form.title}"
                  </span>{" "}
                  telah berhasil ditambahkan.
                </p>
              </div>
              <button
                onClick={handleSuccessClose}
                className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-colors active:scale-95"
              >
                Lihat Sub-Modul
              </button>
            </div>
          )}

          {/* ---- Error State ---- */}
          {resultState === "error" && (
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Gagal Membuat Sub-Modul
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setResultState("idle")}
                  className="px-6 py-3 rounded-2xl bg-surface-1 hover:bg-surface-2 border border-border text-foreground font-medium text-sm transition"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive font-medium text-sm transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* ---- Form State ---- */}
          {resultState === "idle" && (
            <>
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 border-b border-border">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    Tambah Sub-Modul
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Buat sub-modul di dalam modul ini.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <FileText className="w-3.5 h-3.5" />
                    Judul Sub-Modul
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Sub Bab 1: Pendahuluan"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-1 border border-border focus:border-primary/50 focus:outline-none text-foreground text-sm placeholder:text-muted-foreground transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <AlignLeft className="w-3.5 h-3.5" />
                    Deskripsi
                    <span className="text-muted-foreground font-normal normal-case tracking-normal">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Gambaran singkat isi sub-modul ini..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-1 border border-border focus:border-primary/50 focus:outline-none text-foreground text-sm placeholder:text-muted-foreground transition-colors resize-none"
                  />
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <Hash className="w-3.5 h-3.5" />
                    Urutan
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.orderStr}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        orderStr: e.target.value,
                      }))
                    }
                    className="w-32 px-4 py-3 rounded-xl bg-surface-1 border border-border focus:border-primary/50 focus:outline-none text-foreground text-sm transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-muted-foreground hover:text-foreground text-sm font-medium transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !form.title.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Buat Sub-Modul
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Module Detail Page                                                   */
/* ------------------------------------------------------------------ */
export const ModuleDetailPage = () => {
  const { bookId, moduleId } = useParams<{
    bookId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();
  const { tree, loading, error, fetchBookTree, addItemToModule, addChildModuleToTree } = useBookTree();
  const { statusMap, fetchStatusMap } = useBookItemStatusMap();
  const { deleteModule } = useDeleteModule();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddSubModuleModalOpen, setIsAddSubModuleModalOpen] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchBookTree(bookId, true);
      void fetchStatusMap();
    }
  }, [bookId, fetchBookTree, fetchStatusMap]);

  // Find the module from tree
  const findModule = (modules: Module[], id: string): Module | null => {
    for (const mod of modules) {
      if (mod.id === id) return mod;
      if (mod.children?.length) {
        const found = findModule(mod.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const module = tree && moduleId ? findModule(tree.modules, moduleId) : null;
  const items = module?.items ?? [];

  // Cari modul induk (modul yang memiliki moduleId sebagai children) — untuk
  // kembali kontekstual: sub-modul kembali ke induknya, modul level-1 ke buku.
  const findParentModule = (
    modules: Module[],
    childId: string,
  ): Module | null => {
    for (const mod of modules) {
      if (mod.children?.some((c) => c.id === childId)) return mod;
      if (mod.children?.length) {
        const found = findParentModule(mod.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  const parentModule = tree && moduleId
    ? findParentModule(tree.modules, moduleId)
    : null;

  // Arah kembali = modul induk (bila modul ini bersarang) else halaman buku.
  const handleBack = () => {
    const target = parentModule
      ? `/dashboard/pribadi/book/${bookId}/module/${parentModule.id}`
      : `/dashboard/pribadi/book/${bookId}`;
    navigate(target);
  };

  // Restore posisi scroll saat kembali dari item/sub-modul. Key = pathname
  // halaman ini, disimpan via rememberScroll() sebelum user membuka detail.
  // useEffect (passive) berjalan setelah ScrollRestoration (layout effect),
  // sehingga nilai restore selalu menang.
  useEffect(() => {
    if (!loading && module) {
      const saved = takeScroll(window.location.pathname);
      if (saved != null) window.scrollTo({ top: saved });
    }
  }, [loading, module]);

  const handleEditSuccess = () => {
    if (bookId) fetchBookTree(bookId, true); // force refresh setelah edit
  };

  const handleAddItemSuccess = (created: import("@/features/personal/types/personal.types").CreatedModuleItem) => {
    addItemToModule(bookId!, moduleId!, {
      id: created.id,
      book_id: created.book_id,
      title: created.title,
      content: created.content,
      answer: created.answer,
      image: created.image,
      order: created.order,
      estimated_review_seconds: created.estimated_review_seconds,
      review_count: 0,
      status: 'belum_mulai',
      created_at: created.created_at,
      updated_at: created.updated_at,
    });
    void fetchBookTree(bookId!, true);
  };

  const handleAddSubModuleSuccess = (created: import("@/features/personal/types/personal.types").CreatedModule) => {
    addChildModuleToTree(bookId!, moduleId!, {
      id: created.id,
      title: created.title,
      description: created.description,
      order: created.order,
      items: [],
      children: [],
    });
  };

  const handleDelete = async () => {
    if (!moduleId) return;
    try {
      await deleteModule(moduleId);
      setIsDeleteModalOpen(false);
      // Invalidate tree cache so BookDetailPage shows updated modules
      if (bookId) invalidateBookTreeCache(bookId);
      navigate(`/dashboard/pribadi/book/${bookId}`);
    } catch {
      // Error is handled by the hook and will be shown via toast/notification
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-primary selection:bg-primary/30">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-2xl border border-border hover:border-border bg-surface-1 hover:bg-surface-2 transition-all duration-300 text-muted-foreground hover:text-foreground"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-1 hover:bg-surface-2 border border-border hover:border-border text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </div>

          {/* Breadcrumb */}
          {tree && module && (
            <div className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-1 border border-border text-xs text-muted-foreground max-w-sm">
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span
                className="text-muted-foreground hover:text-foreground truncate cursor-pointer transition-colors max-w-[100px]"
                onClick={() => navigate(`/dashboard/pribadi/book/${bookId}`)}
              >
                {tree.title}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="font-medium text-foreground truncate max-w-[120px]">
                {module.title}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border hover:border-border text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-1 hover:bg-destructive/10 border border-border hover:border-destructive/30 text-muted-foreground hover:text-destructive text-sm font-medium transition-colors"
              >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">
              Memuat detail modul...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive text-sm font-medium">{error}</p>
            <button
              onClick={() => bookId && fetchBookTree(bookId)}
              className="px-5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Not found */}
        {!loading && !error && tree && !module && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <Layers className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground text-sm">Modul tidak ditemukan.</p>
            <button
              onClick={() => navigate(`/dashboard/pribadi/book/${bookId}`)}
              className="px-5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Kembali
            </button>
          </div>
        )}

        {/* Module Detail */}
        {!loading && !error && module && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Module Hero */}
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card">
              {/* Decorative gradient top */}
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

              <div className="relative px-8 sm:px-10 py-10">
                {/* Order & type badge */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-primary">
                      Modul
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-border">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-bold tracking-widest text-muted-foreground">
                      Urutan {module.order}
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight mb-4">
                  {module.title}
                </h1>

                {module.description ? (
                  <p className="text-muted-foreground text-base leading-relaxed font-light max-w-2xl whitespace-pre-wrap break-words">
                    {module.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    Tidak ada deskripsi.
                  </p>
                )}

                {/* Stats strip */}
                <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <span className="text-foreground font-semibold">
                        {items.length}
                      </span>{" "}
                      item hafalan
                    </span>
                  </div>
                  {module.children?.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <span className="text-foreground font-semibold">
                          {module.children.length}
                        </span>{" "}
                        sub-modul
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-modules (if any) */}
            {module.children && module.children.length > 0 && (
              <div className="relative rounded-3xl overflow-hidden border border-border bg-card">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                <div className="px-8 py-6 border-b border-border flex flex-col md:flex-row items-center justify-between">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-primary" />
                    Sub-Modul
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                      {module.children.length}
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsAddSubModuleModalOpen(true)}
                    className="flex mt-2 md:mt-0 items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Sub-Modul
                  </button>
                </div>
                <div className="p-6 space-y-3">
                  {module.children
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          rememberScroll(window.location.pathname);
                          navigate(
                            `/dashboard/pribadi/book/${bookId}/module/${child.id}`,
                          );
                        }}
                        className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-surface-1 hover:bg-surface-2 border border-border hover:border-border transition-all duration-300 text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <span className="text-sm font-black text-primary">
                            {child.order}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                            {child.title}
                          </p>
                          {child.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {child.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* No sub-modules - show add button */}
            {(!module.children || module.children.length === 0) && (
              <div className="relative rounded-3xl overflow-hidden border border-border bg-card">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-primary" />
                    Sub-Modul
                  </h2>
                </div>
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-border flex items-center justify-center">
                      <Layers className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    Belum Ada Sub-Modul
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
                    Buat sub-modul untuk mengorganisir konten secara hierarkis.
                  </p>
                  <button
                    onClick={() => setIsAddSubModuleModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Sub-Modul Pertama
                  </button>
                </div>
              </div>
            )}

            {/* Items Section */}
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card">
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

              <div className="px-8 py-6 border-b border-border flex flex-col md:flex-row items-center justify-between">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-primary" />
                  Item Hafalan
                  {items.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                      {items.length}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="flex mt-2 md:mt-0 items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Item
                </button>
              </div>

              {items.length > 0 ? (
                <div className="p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {items.map((item: BookItem) => (
                    <BookItemCard
                      key={item.id}
                      item={item}
                      bookId={bookId!}
                      realItemId={statusMap.get(contentRefForItem(bookId!, item.id))?.item_id}
                      onOpen={() => rememberScroll(window.location.pathname)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-border flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    Belum Ada Item
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
                    Mulai tambahkan item hafalan ke dalam modul ini.
                  </p>
                  <button
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Item Pertama
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Module Modal */}
      {isEditModalOpen && module && (
        <EditModuleModal
          module={module}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Add Item to Module Modal */}
      {isAddItemModalOpen && module && (
        <AddItemModal
          bookId={bookId!}
          moduleId={moduleId!}
          onClose={() => setIsAddItemModalOpen(false)}
          onCreated={(item) => handleAddItemSuccess(item as import("@/features/personal/types/personal.types").CreatedModuleItem)}
          nextOrder={(items?.length ?? 0) + 1}
        />
      )}

      {/* Add Sub Module Modal */}
      {isAddSubModuleModalOpen && module && (
        <AddSubModuleModal
          bookId={bookId!}
          parentId={moduleId!}
          onClose={() => setIsAddSubModuleModalOpen(false)}
          onCreated={handleAddSubModuleSuccess}
          nextOrder={(module.children?.length ?? 0) + 1}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Modul"
        message={`Apakah Anda yakin ingin menghapus modul "${module?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        icon={Trash2}
        variant="danger"
      />
    </div>
  );
};
