import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  AlertCircle,
  AlignLeft,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Hash,
  ImageOff,
  Layers,
  LayoutList,
  ListPlus,
  Loader2,
  Lock,
  Plus,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useBookDetail } from "@/features/personal/hooks/useBookDetail";
import { useBookTree } from "@/features/personal/hooks/useBookTree";
import { useCreateModule } from "@/features/personal/hooks/useCreateModule";
import { BookItemCard } from "@/features/personal/components/BookItemCard";
import { rememberScroll, takeScroll } from "@/features/personal/utils/scrollMemory";
import { AddItemModal } from "@/features/personal/components/AddItemModal";
import { useBookItemStatusMap, contentRefForItem } from "@/features/personal/hooks/useBookItemStatusMap";
import type { Module } from "@/features/personal/types/personal.types";
import { resolveAssetUrl } from "@/lib/assets";

/* ------------------------------------------------------------------ */
/* Add Module Form Modal                                                */
/* ------------------------------------------------------------------ */
interface AddModuleModalProps {
  bookId: string;
  onClose: () => void;
  onCreated: (module: import("@/features/personal/types/personal.types").CreatedModule) => void;
  nextOrder: number;
}

const AddModuleModal = ({
  bookId,
  onClose,
  onCreated,
  nextOrder,
}: AddModuleModalProps) => {
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
    const order = Math.max(1, parseInt(form.orderStr) || 1);
    try {
      const created = await createModule(bookId, {
        title: form.title.trim(),
        description: form.description.trim(),
        order,
        parent_id: null,
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
        <div className="relative rounded-3xl bg-card border-border overflow-hidden">
          {/* ---- Success State ---- */}
          {resultState === "success" && (
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Modul Berhasil Dibuat!
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Modul{" "}
                  <span className="text-foreground font-semibold">
                    "{form.title}"
                  </span>{" "}
                  telah berhasil ditambahkan ke buku ini.
                </p>
              </div>
              <button
                onClick={handleSuccessClose}
                className="px-8 py-3 rounded-2xl bg-success text-success-foreground hover:bg-success/90 font-bold text-sm transition-colors active:scale-95"
              >
                Lihat Modul
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
                  Gagal Membuat Modul
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
                  <div className="w-10 h-10 rounded-2xl bg-info/15 border border-info/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-info" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    Tambah Modul
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Buat bab atau bagian baru untuk mengelompokkan .
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <FileText className="w-3.5 h-3.5" />
                    Judul Modul
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Bab 1: Muqaddimah"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-1 border border-border focus:border-primary/50 focus:outline-none text-foreground text-sm placeholder:text-muted-foreground transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <AlignLeft className="w-3.5 h-3.5" />
                    Deskripsi
                    <span className="text-muted-foreground font-normal normal-case tracking-normal">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Gambaran singkat isi modul ini..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-1 border border-border focus:border-primary/50 focus:outline-none text-foreground text-sm placeholder:text-muted-foreground transition-colors resize-none"
                  />
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
                        Buat Modul
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
/* Add Content Picker (Step 1)                                         */
/* ------------------------------------------------------------------ */
interface AddContentModalProps {
  onClose: () => void;
  onSelectModule: () => void;
  onSelectItem: () => void;
}

const AddContentModal = ({
  onClose,
  onSelectModule,
  onSelectItem,
}: AddContentModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-3xl bg-card border-border overflow-hidden">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-border">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-info/15 border border-info/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-info" />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Tambah Hafalan
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih jenis konten yang ingin ditambahkan ke buku ini.
            </p>
          </div>

          {/* Options */}
          <div className="p-6 space-y-4">
            <button
              onClick={onSelectModule}
              className="w-full group flex items-center gap-5 p-5 rounded-2xl bg-info/10 border border-info/20 hover:border-info/40 hover:bg-info/20 transition-all duration-300 text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-info/20 border border-info/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-6 h-6 text-info" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-base mb-1">
                  Tambah Modul
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kelompokkan  menjadi bab atau bagian terstruktur.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-info group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={onSelectItem}
              className="w-full group flex items-center gap-5 p-5 rounded-2xl bg-success/10 border border-success/20 hover:border-success/40 hover:bg-success/20 transition-all duration-300 text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-base mb-1">
                  Tambah Item
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tambahkan unit hafalan langsung, tanpa modul.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-success group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Module Card                                                          */
/* ------------------------------------------------------------------ */
/* Module Card - Grid Display                                           */
/* ------------------------------------------------------------------ */
const ModuleCard = ({
  module,
  onClick,
}: {
  module: Module;
  bookId: string;
  onClick: () => void;
}) => {
  const itemCount = module.items?.length ?? 0;
  const childCount = module.children?.length ?? 0;

  return (
    <button
      onClick={onClick}
      className="group relative bg-surface-1 border border-border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 flex flex-col overflow-hidden"
    >
      {/* Background Gradient/Glow */}
      <div className="absolute inset-0 bg-linear-to-b from-foreground/2 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-linear-to-br from-info/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative Icon Background */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
        <Layers className="w-40 h-40 text-foreground/5" />
      </div>

      {/* Large Order Number Watermark */}
      <div className="absolute top-2 right-4 text-6xl font-serif font-bold text-foreground/5 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none select-none">
        {module.order}
      </div>

      {/* Header */}
      <div className="relative z-10 mb-2.5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-info transition-colors duration-300 line-clamp-2 leading-snug">
              {module.title}
            </h3>
            <p className="text-muted-foreground text-[10px] font-medium tracking-widest mt-0.5">
              MODUL
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative z-10 mb-3">
        {module.description ? (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 whitespace-pre-wrap break-words">
            {module.description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/70 italic">Tidak ada deskripsi</p>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-border">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <span className="flex items-center gap-1.5 min-w-0">
            <FileText className="w-3 h-3 text-info shrink-0" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate">
              Item
            </span>
          </span>
          <span className="text-sm font-mono font-bold text-info leading-none shrink-0">
            {itemCount}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <span className="flex items-center gap-1.5 min-w-0">
            <Layers className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate">
              Sub-modul
            </span>
          </span>
          <span className="text-sm font-mono font-bold text-primary leading-none shrink-0">
            {childCount}
          </span>
        </div>
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* Book Detail Page                                                     */
/* ------------------------------------------------------------------ */
export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, loading, error, fetchBookDetail } = useBookDetail();
  const { tree, loading: treeLoading, fetchBookTree, addModuleToTree, addItemToTree } = useBookTree();
  const { statusMap, fetchStatusMap } = useBookItemStatusMap();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Konteks halaman ini selalu ruang pribadi (route /dashboard/pribadi/...),
  // jadi tombol kembali mengarahkan deterministik ke workspace pribadi.
  // Hindari history.back()/navigate(-1) agar tidak bolak-balik ke modul/item.
  const handleBack = () => navigate("/dashboard/pribadi");

  // Modal flow: null | "picker" | "module" | "item"
  const [modalStep, setModalStep] = useState<
    null | "picker" | "module" | "item"
  >(null);

  useEffect(() => {
    if (id) {
      fetchBookDetail(id);
      fetchBookTree(id, true);
      void fetchStatusMap();
    }
  }, [id, fetchBookDetail, fetchBookTree, fetchStatusMap]);

  const handleModuleCreated = (created: import("@/features/personal/types/personal.types").CreatedModule) => {
    // Optimistic update: langsung tambah ke tree tanpa refetch
    addModuleToTree(id!, {
      id: created.id,
      title: created.title,
      description: created.description,
      order: created.order,
      items: [],
      children: [],
    });
  };

  const handleItemCreated = (created: import("@/features/personal/types/personal.types").CreatedItem) => {
    // Optimistic update: langsung tambah ke tree tanpa refetch
    addItemToTree(id!, {
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
    void fetchBookTree(id!, true);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const statusConfig = {
    draft: {
      label: "Draft",
      icon: Lock,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
    pending: {
      label: "Pending Review",
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
    published: {
      label: "Published",
      icon: Globe,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
    },
  };

  const status =
    statusConfig[book?.status as keyof typeof statusConfig] ??
    statusConfig.draft;
  const StatusIcon = status.icon;

  const modules = tree?.modules ?? [];
  const items = tree?.items ?? [];
  const nextOrder = modules.length + 1;

  // Restore posisi scroll saat kembali dari modul/item. Key = pathname halaman
  // ini, disimpan via rememberScroll() sebelum user membuka detail. useEffect
  // (passive) berjalan setelah ScrollRestoration (layout effect), sehingga
  // nilai restore selalu menang.
  useEffect(() => {
    if (!treeLoading && tree) {
      const saved = takeScroll(window.location.pathname);
      if (saved != null) window.scrollTo({ top: saved });
    }
  }, [treeLoading, tree]);

  return (
    <div className="min-h-screen bg-background text-foreground font-primary selection:bg-primary/30">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top nav bar */}
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

          {/* Breadcrumb title */}
          {book && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-1 border border-border text-xs text-muted-foreground max-w-xs truncate">
              <BookOpen className="w-3.5 h-3.5 text-info shrink-0" />
              <span className="truncate font-medium text-foreground">
                {book.title}
              </span>
            </div>
          )}

          <button
            onClick={() => setModalStep("picker")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors active:scale-95"
          >
            <ListPlus className="w-4 h-4" />
            <span>Tambah Hafalan</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-info/10 border border-info/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-info animate-spin" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">
              Memuat detail buku...
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
              onClick={() => id && fetchBookDetail(id)}
              className="px-5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Book Detail Content */}
        {!loading && !error && book && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Card */}
            <div className="relative rounded-3xl overflow-hidden border border-border">
              <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-surface-1">
                {book.cover_image ? (
                  <>
                    <img
                      src={resolveAssetUrl(book.cover_image)}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-surface-1 via-surface-1/60 to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-surface-1" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
                        <ImageOff className="w-9 h-9 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-surface-1 via-transparent to-transparent" />
                  </>
                )}

                {/* Status badge */}
                <div className="absolute top-5 left-5">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} border ${status.border}`}
                  >
                    <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                    <span
                      className={`text-[11px] font-bold tracking-widest uppercase ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="absolute top-5 right-5">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-1 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-300">
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Info Body */}
              <div className="bg-card px-6 sm:px-10 py-8">
                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight mb-3">
                  {book.title}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed font-light max-w-2xl">
                  {book.description || "Tidak ada deskripsi untuk buku ini."}
                </p>
                <div className="flex flex-wrap items-center gap-5 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Dibuat {formatDate(book.created_at)}</span>
                  </div>
                  {book.published_at && (
                    <div className="flex items-center gap-2 text-sm text-success/80">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Dipublikasi {formatDate(book.published_at)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Diperbarui {formatDate(book.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Item", value: (tree?.items?.length ?? 0).toString() },
                { label: "Modul", value: modules.length.toString() },
              ].map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-xl bg-card border border-border p-5 text-center"
                >
                  <div className="text-3xl font-black text-foreground mb-1">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Modules / Content Section */}
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card">
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

              {/* Section header */}
              <div className="px-8 py-7 border-b border-border flex flex-col md:flex-row items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-primary" />
                  Modul & Konten
                  {(modules.length > 0 || items.length > 0) && (
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                      {modules.length + items.length}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setModalStep("picker")}
                  className="flex mt-2 md:mt-0 items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/40 hover:bg-primary/20 text-primary text-sm font-medium transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>

              {/* Module list */}
              {modules.length > 0 && (
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Modul ({modules.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {modules
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((mod) => (
                        <ModuleCard
                          key={mod.id}
                          module={mod}
                          bookId={id!}
                          onClick={() => {
                            rememberScroll(window.location.pathname);
                            navigate(
                              `/dashboard/pribadi/book/${id}/module/${mod.id}`,
                            );
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Items Grid Section */}
              {items.length > 0 && (
                <>
                  <div className="px-8 py-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-success" />
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                         Item ({items.length})
                      </h3>
                    </div>
                  </div>
                  <div className="p-8 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {items
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <BookItemCard
                            key={item.id}
                            item={item}
                            bookId={id!}
                            realItemId={statusMap.get(contentRefForItem(id!, item.id))?.item_id}
                            onOpen={() => rememberScroll(window.location.pathname)}
                          />
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* Empty state */}
              {modules.length === 0 && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    Buku Masih Kosong
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-8">
                    Mulai tambahkan modul pertama Anda untuk membangun kurikulum
                    yang terstruktur.
                  </p>
                  <button
                    onClick={() => setModalStep("module")}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Modul Pertama
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalStep === "picker" && (
        <AddContentModal
          onClose={() => setModalStep(null)}
          onSelectModule={() => setModalStep("module")}
          onSelectItem={() => setModalStep("item")}
        />
      )}

      {modalStep === "module" && id && (
        <AddModuleModal
          bookId={id}
          nextOrder={nextOrder}
          onClose={() => setModalStep(null)}
          onCreated={handleModuleCreated}
        />
      )}

      {modalStep === "item" && id && (
        <AddItemModal
          bookId={id}
          nextOrder={nextOrder}
          onClose={() => setModalStep(null)}
          onCreated={(item) => handleItemCreated(item as import("@/features/personal/types/personal.types").CreatedItem)}
        />
      )}
    </div>
  );
};
