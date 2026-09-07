import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  ImageOff,
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  Clock,
  AlignLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Calendar,
  Hash,
} from "lucide-react";
import { useAdminBookDetail } from "@/features/dashboard/admin/hooks/useAdminBookDetail";
import { useApproveBook } from "@/features/dashboard/admin/hooks/useApproveBook";
import { useRejectBook } from "@/features/dashboard/admin/hooks/useRejectBook";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { AdminBookModule, AdminBookItem } from "@/features/dashboard/admin/types/pendingBook.types";
import { resolveAssetUrl } from "@/lib/assets";

/* ------------------------------------------------------------------ */
/* Item Card (read-only)                                               */
/* ------------------------------------------------------------------ */
const ItemCard = ({ item, index }: { item: AdminBookItem; index: number }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-lg bg-success/15 border border-success/20 flex items-center justify-center text-success text-xs font-bold">
            {index + 1}
          </span>
          <h4 className="font-semibold text-foreground text-sm truncate">{item.title}</h4>
        </div>
        {item.estimated_review_seconds > 0 && (
          <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground bg-surface-1 px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3" />
            {item.estimated_review_seconds < 60
              ? `${item.estimated_review_seconds}d`
              : `${Math.round(item.estimated_review_seconds / 60)}m`}
          </span>
        )}
      </div>

      {item.content && (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlignLeft className="w-3 h-3" /> Konten
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed bg-surface-1 rounded-xl px-3 py-2.5">
            {item.content}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-warning/80 hover:text-warning transition-colors"
        >
          {showAnswer ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          Jawaban
        </button>
        {showAnswer && (
          <p className="text-sm text-warning/80 leading-relaxed bg-warning/5 border border-warning/15 rounded-xl px-3 py-2.5">
            {item.answer}
          </p>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Module Section (recursive, collapsible)                             */
/* ------------------------------------------------------------------ */
const ModuleSection = ({
  module,
  allModules,
  depth = 0,
}: {
  module: AdminBookModule;
  allModules: AdminBookModule[];
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const children = allModules.filter((m) => m.parent_id === module.id);
  const items = module.items ?? [];
  const totalContent = items.length + children.length;

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        depth === 0
          ? "border-info/20 bg-info/5"
          : "border-primary/15 bg-primary/5"
      }`}
    >
      {/* Module Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-1 rounded-2xl transition-colors"
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            depth === 0
              ? "bg-info/15 border border-info/20"
              : "bg-primary/15 border border-primary/20"
          }`}
        >
          <Layers className={`w-4 h-4 ${depth === 0 ? "text-info" : "text-primary"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">{module.title}</span>
            <span className="text-xs text-muted-foreground bg-surface-1 px-2 py-0.5 rounded-full">
              {totalContent} konten
            </span>
          </div>
          {module.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{module.description}</p>
          )}
        </div>
        <div className="shrink-0 text-muted-foreground">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Module Content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {/* Child Modules */}
          {children.map((child) => (
            <ModuleSection
              key={child.id}
              module={child}
              allModules={allModules}
              depth={depth + 1}
            />
          ))}

          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <ItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          )}

          {totalContent === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-3">
              Modul ini belum memiliki konten.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const AdminBookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, loading, error, getBookDetail } = useAdminBookDetail();
  const { approveBook, loading: approving } = useApproveBook();
  const { rejectBook, loading: rejecting } = useRejectBook();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
  }>({ isOpen: false, type: null });

  useEffect(() => {
    if (id) getBookDetail(id);
  }, [id]);

  const handleConfirm = async () => {
    if (!id || !modalState.type) return;
    if (modalState.type === "approve") {
      await approveBook(id);
    } else {
      await rejectBook(id);
    }
    setModalState({ isOpen: false, type: null });
    navigate("/dashboard/book-requests");
  };

  // Root modules = modules without parent_id
  const allModules = book?.modules ?? [];
  const rootModules = allModules.filter((m) => !m.parent_id);
  const rootItems = book?.items ?? [];

  const totalModules = allModules.length;
  const totalItems =
    rootItems.length +
    allModules.reduce((acc, m) => acc + (m.items?.length ?? 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm">Memuat detail buku...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground text-center p-6">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-foreground font-semibold">Gagal memuat buku</p>
          <p className="text-sm text-muted-foreground">{error ?? "Buku tidak ditemukan."}</p>
          <button
            onClick={() => navigate("/dashboard/book-requests")}
            className="mt-2 px-5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-foreground text-sm transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const isPending = book.status === "pending";

  return (
    <div className="relative min-h-screen bg-background text-foreground font-primary">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-10 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/book-requests")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Request
        </button>

        {/* Book Header Card */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Cover */}
            <div className="w-24 h-32 sm:w-28 sm:h-40 rounded-2xl overflow-hidden bg-surface-1 border border-border flex items-center justify-center shrink-0">
              {book.cover_image ? (
                <img
                  src={resolveAssetUrl(book.cover_image)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageOff className="w-8 h-8 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      book.status === "pending"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : book.status === "published"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {book.status.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {book.title}
                </h1>
              </div>

              {book.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{book.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Diajukan {formatDate(book.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {totalModules} modul
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {totalItems} item
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - only show for pending books */}
          {isPending && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
              <button
                onClick={() => setModalState({ isOpen: true, type: "approve" })}
                disabled={approving || rejecting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-success/10 hover:bg-success border border-success/30 hover:border-success text-success hover:text-success-foreground font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Setujui Publikasi
              </button>
              <button
                onClick={() => setModalState({ isOpen: true, type: "reject" })}
                disabled={approving || rejecting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-destructive/10 hover:bg-destructive border border-destructive/30 hover:border-destructive text-destructive hover:text-destructive-foreground font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4" />
                Tolak Publikasi
              </button>
            </div>
          )}
        </div>

        {/* Book Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Isi Buku</h2>
          </div>

          {totalModules === 0 && rootItems.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Buku ini belum memiliki konten.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Root Modules */}
              {rootModules.map((module) => (
                <ModuleSection
                  key={module.id}
                  module={module}
                  allModules={allModules}
                  depth={0}
                />
              ))}

              {/* Root Items (no module) */}
              {rootItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Item Langsung ({rootItems.length})
                    </span>
                  </div>
                  {rootItems.map((item, idx) => (
                    <ItemCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Buttons (sticky feel for long pages) */}
        {isPending && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setModalState({ isOpen: true, type: "approve" })}
              disabled={approving || rejecting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-success/10 hover:bg-success border border-success/30 hover:border-success text-success hover:text-success-foreground font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Setujui Publikasi
            </button>
            <button
              onClick={() => setModalState({ isOpen: true, type: "reject" })}
              disabled={approving || rejecting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-destructive/10 hover:bg-destructive border border-destructive/30 hover:border-destructive text-destructive hover:text-destructive-foreground font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              Tolak Publikasi
            </button>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null })}
        onConfirm={handleConfirm}
        title={
          modalState.type === "approve"
            ? "Setujui Publikasi Buku"
            : "Tolak Publikasi Buku"
        }
        message={
          modalState.type === "approve"
            ? `Apakah Anda yakin ingin menyetujui buku "${book.title}" untuk dipublikasikan?`
            : `Apakah Anda yakin ingin menolak permintaan publikasi buku "${book.title}"?`
        }
        confirmText={modalState.type === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
        cancelText="Batal"
        icon={modalState.type === "approve" ? CheckCircle : XCircle}
        variant={modalState.type === "approve" ? "success" : "danger"}
      />
    </div>
  );
};
