import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
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
  ListPlus,
  Loader2,
  Lock,
  Plus,
  Sparkles,
  X,
  ChevronRight,
  Play,
  Users,
  Eye,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useBookDetail } from "@/features/personal/hooks/useBookDetail";
import { useBookTree } from "@/features/personal/hooks/useBookTree";
import { useCreateModule } from "@/features/personal/hooks/useCreateModule";
import { useBookItemStatusMap, contentRefForItem } from "@/features/personal/hooks/useBookItemStatusMap";
import { useStartItemPhase } from "@/features/personal/hooks/useStartItemPhase";
import { AddItemModal } from "@/features/personal/components/AddItemModal";
import { BookItemCard } from "@/features/personal/components/BookItemCard";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useGetClassBookStudentProgress } from "@/features/classroom/hooks/useClassroom";
import type { StudentBookProgress } from "@/features/classroom/types";
import type { Module } from "@/features/personal/types/personal.types";
import { resolveAssetUrl } from "@/lib/assets";
import type { CreatedItem, CreatedModule } from "@/features/personal/types/personal.types";
import { toast } from "sonner";

interface AddModuleModalProps {
  bookId: string;
  onClose: () => void;
  onCreated: (module: CreatedModule) => void;
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

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={resultState === "idle" ? onClose : undefined}
      />
      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
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
                className="px-8 py-3 rounded-2xl bg-success hover:bg-success/90 text-success-foreground font-bold text-sm transition-all hover:scale-105 active:scale-95"
              >
                Lihat Modul
              </button>
            </div>
          )}
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
          {resultState === "idle" && (
            <>
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
                    Tambah Modul
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Buat bab atau bagian baru untuk mengelompokkan konten.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
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
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
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
    </div>,
    document.body,
  );
};

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
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
          <div className="relative px-8 pt-8 pb-6 border-b border-border">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Tambah Hafalan
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih jenis konten yang ingin ditambahkan ke buku ini.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={onSelectModule}
              className="w-full group flex items-center gap-5 p-5 rounded-2xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-base mb-1">
                  Tambah Modul
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kelompokkan konten menjadi bab atau bagian terstruktur.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
            <button
              onClick={onSelectItem}
              className="w-full group flex items-center gap-5 p-5 rounded-2xl bg-success/5 border border-success/20 hover:border-success/40 transition-all duration-300 text-left cursor-pointer"
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
    </div>,
    document.body,
  );
};

const ModuleCard = ({
  module,
  onClick,
}: {
  module: Module;
  onClick: () => void;
}) => {
  const itemCount = module.items?.length ?? 0;
  const childCount = module.children?.length ?? 0;
  return (
    <button
      onClick={onClick}
      className="group relative bg-card border border-border rounded-2xl p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 flex flex-col overflow-hidden"
    >
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
        <Layers className="w-40 h-40 text-foreground" />
      </div>
      <div className="absolute top-2 right-4 text-7xl font-serif font-bold text-foreground/5 group-hover:text-primary/10 transition-colors duration-500 pointer-events-none select-none">
        {module.order}
      </div>
      <div className="relative z-10 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {module.title}
            </h3>
            <p className="text-muted-foreground text-xs font-medium tracking-wide">
              MODUL
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex-1 mb-4">
        {module.description ? (
          <div className="p-3 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlignLeft className="w-3 h-3 text-muted-foreground" />
              <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">
                Deskripsi
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap break-words">
              {module.description}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-surface-1 border border-dashed border-border flex items-center justify-center h-full">
            <p className="text-xs text-muted-foreground italic">Tidak ada deskripsi</p>
          </div>
        )}
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-border">
        <div className="flex flex-col p-2 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <FileText className="w-3 h-3 text-primary" />
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">
              Item
            </span>
          </div>
          <span className="text-base font-mono font-bold text-primary leading-none">
            {itemCount}
          </span>
        </div>
        <div className="flex flex-col p-2 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <Layers className="w-3 h-3 text-primary" />
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">
              Sub-modul
            </span>
          </div>
          <span className="text-base font-mono font-bold text-primary leading-none">
            {childCount}
          </span>
        </div>
      </div>
    </button>
  );
};

interface StudentProgressDetailModalProps {
  student: StudentBookProgress;
  bookTitle: string;
  onClose: () => void;
}

const StudentProgressDetailModal = ({
  student,
  bookTitle,
  onClose,
}: StudentProgressDetailModalProps) => {
  const unreviewed =
    student.total_unreviewed ??
    student.start + student.menghafal + student.interval;
  const fsrsActive = student.total_fsrs_active ?? student.fsrs_active;
  const inactive = student.total_inactive ?? student.inactive;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
          <div className="relative px-8 pt-8 pb-6 border-b border-border">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-1 hover:bg-surface-2 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-foreground tracking-tight truncate">
                  Progress {student.full_name || student.email}
                </h2>
                <p className="text-xs text-muted-foreground truncate">Buku: {bookTitle}</p>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Statistik Progress
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-warning/10 border border-warning/20">
                <span className="text-sm font-medium text-warning">
                  Belum di-review
                </span>
                <span className="text-lg font-mono font-bold text-warning">
                  {unreviewed} item
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-success/10 border border-success/20">
                <span className="text-sm font-medium text-success">
                  FSRS Aktif
                </span>
                <span className="text-lg font-mono font-bold text-success">
                  {fsrsActive} item
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                <span className="text-sm font-medium text-destructive">
                  Nonaktif
                </span>
                <span className="text-lg font-mono font-bold text-destructive">
                  {inactive} item
                </span>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-foreground font-semibold text-sm transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

interface ClassroomBookStudentProgressSectionProps {
  classroomId: string;
  bookId: string;
  bookTitle: string;
}

const ClassroomBookStudentProgressSection = ({
  classroomId,
  bookId,
  bookTitle,
}: ClassroomBookStudentProgressSectionProps) => {
  const { data, isLoading, isError } = useGetClassBookStudentProgress(
    classroomId,
    bookId,
  );
  const [selectedStudent, setSelectedStudent] =
    useState<StudentBookProgress | null>(null);

  if (isLoading) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-8 flex flex-col items-center justify-center py-12 gap-3 mb-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat progress siswa...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-destructive/20 bg-card p-6 mb-8 text-center text-xs text-destructive">
        Gagal memuat progress siswa.
      </div>
    );
  }

  const students = data.students ?? [];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-card mb-8">
      <div className="absolute top-0 inset-x-0 h-px bg-primary/30" />
      <div className="px-8 py-7 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5">
            <Users className="w-5 h-5 text-primary" />
            Progress Siswa
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar siswa yang mengikuti kelas dan progress pada buku ini
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          {students.length} Siswa
        </span>
      </div>

      <div className="p-8">
        {students.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Belum ada siswa yang bergabung di kelas ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((st) => {
              const unreviewed =
                st.total_unreviewed ??
                st.start + st.menghafal + st.interval;
              const fsrsActive = st.total_fsrs_active ?? st.fsrs_active;
              const inactive = st.total_inactive ?? st.inactive;

              return (
                <div
                  key={st.user_id}
                  className="bg-surface-1 border border-border rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <h3 className="font-bold text-foreground text-base mb-3 truncate">
                      {st.full_name || st.email}
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Belum di-review</span>
                        <span className="font-mono font-semibold text-warning">
                          {unreviewed} item
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Aktif FSRS</span>
                        <span className="font-mono font-semibold text-success">
                          {fsrsActive} item
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Nonaktif</span>
                        <span className="font-mono font-semibold text-destructive">
                          {inactive} item
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(st)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-foreground font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    Lihat Progress
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedStudent && (
        <StudentProgressDetailModal
          student={selectedStudent}
          bookTitle={bookTitle}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export const ClassroomBookDetailView = () => {
  const { classroomId, bookId } = useParams<{
    classroomId: string;
    bookId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isTeacher = user?.role === "teacher";

  const { book, loading, error, fetchBookDetail } = useBookDetail();
  const { tree, fetchBookTree, addModuleToTree, addItemToTree } = useBookTree();
  const { statusMap, fetchStatusMap } = useBookItemStatusMap();
  const { startPhase, loading: startLoading } = useStartItemPhase();

  const [modalStep, setModalStep] = useState<
    null | "picker" | "module" | "item"
  >(null);

  useEffect(() => {
    if (bookId) {
      fetchBookDetail(bookId);
      fetchBookTree(bookId, true);
      void fetchStatusMap();
    }
  }, [bookId, fetchBookDetail, fetchBookTree, fetchStatusMap]);

  const handleModuleCreated = (created: CreatedModule) => {
    addModuleToTree(bookId!, {
      id: created.id,
      title: created.title,
      description: created.description,
      order: created.order,
      items: [],
      children: [],
    });
  };

  const handleItemCreated = (created: CreatedItem) => {
    addItemToTree(bookId!, {
      id: created.id,
      book_id: created.book_id,
      title: created.title,
      content: created.content,
      answer: created.answer,
      image: created.image,
      order: created.order,
      estimated_review_seconds: created.estimated_review_seconds,
      review_count: 0,
      status: "belum_mulai",
      created_at: created.created_at,
      updated_at: created.updated_at,
    });
    void fetchBookTree(bookId!, true);
  };

  const handleStartItem = async (itemId: string) => {
    if (!bookId) return;
    try {
      await startPhase(bookId, itemId);
      navigate(
        `/dashboard/pribadi/book/${bookId}/item/${itemId}`,
      );
    } catch {
      toast.error("Gagal memulai item.");
    }
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

  return (
    <div className="min-h-screen bg-background text-foreground font-primary selection:bg-primary/30">
      <Sidebar isOpen={false} onClose={() => {}} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/dashboard/kelas/${classroomId}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-1 hover:bg-surface-2 border border-border text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Kelas</span>
            </button>
          </div>

          {book && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-1 border border-border text-xs text-muted-foreground max-w-xs truncate">
              <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate font-medium text-foreground">
                {book.title}
              </span>
            </div>
          )}

          {isTeacher && (
            <button
              onClick={() => setModalStep("picker")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <ListPlus className="w-4 h-4" />
              <span>Tambah Hafalan</span>
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">
              Memuat detail buku...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive text-sm font-medium">{error}</p>
            <button
              onClick={() => bookId && fetchBookDetail(bookId)}
              className="px-5 py-2.5 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && book && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
              <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-surface-1">
                {book.cover_image ? (
                  <>
                    <img
                      src={resolveAssetUrl(book.cover_image)}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-surface-1" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center">
                        <ImageOff className="w-9 h-9 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}
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
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Total Item",
                  value: (tree?.items?.length ?? 0).toString(),
                  color: "text-primary",
                  border: "border-primary/15",
                },
                {
                  label: "Modul",
                  value: modules.length.toString(),
                  color: "text-primary",
                  border: "border-primary/15",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`relative overflow-hidden rounded-2xl bg-surface-1 border ${s.border} p-5 text-center`}
                >
                  <div className={`text-3xl font-black ${s.color} mb-1`}>
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {isTeacher && classroomId && bookId && (
              <ClassroomBookStudentProgressSection
                classroomId={classroomId}
                bookId={bookId}
                bookTitle={book.title}
              />
            )}

            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
              <div className="absolute top-0 inset-x-0 h-px bg-primary/30" />
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
                {isTeacher && (
                  <button
                    onClick={() => setModalStep("picker")}
                    className="flex mt-2 md:mt-0 items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/50 hover:bg-primary/20 text-primary text-sm font-medium transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                )}
              </div>

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
                          onClick={() =>
                            navigate(
                              `/dashboard/pribadi/book/${bookId}/module/${mod.id}`,
                            )
                          }
                        />
                      ))}
                  </div>
                </div>
              )}

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
                          <div key={item.id} className="relative">
                            <BookItemCard
                              item={item}
                              bookId={bookId!}
                              realItemId={statusMap.get(contentRefForItem(bookId!, item.id))?.item_id}
                            />
                            {!isTeacher && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleStartItem(item.id);
                                }}
                                disabled={startLoading}
                                className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-success hover:bg-success/90 text-success-foreground text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                              >
                                <Play className="w-4 h-4" />
                                {startLoading ? "Memulai..." : "Mulai"}
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

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
                    {isTeacher
                      ? "Mulai tambahkan modul pertama Anda untuk membangun kurikulum yang terstruktur."
                      : "Belum ada konten yang tersedia di buku ini."}
                  </p>
                  {isTeacher && (
                    <button
                      onClick={() => setModalStep("module")}
                      className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Modul Pertama
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {modalStep === "picker" && (
          <AddContentModal
            onClose={() => setModalStep(null)}
            onSelectModule={() => setModalStep("module")}
            onSelectItem={() => setModalStep("item")}
          />
        )}

        {modalStep === "module" && bookId && (
          <AddModuleModal
            bookId={bookId}
            nextOrder={nextOrder}
            onClose={() => setModalStep(null)}
            onCreated={handleModuleCreated}
          />
        )}

        {modalStep === "item" && bookId && (
          <AddItemModal
            bookId={bookId}
            nextOrder={nextOrder}
            onClose={() => setModalStep(null)}
            onCreated={(item) =>
              handleItemCreated(item as CreatedItem)
            }
          />
        )}
      </div>
    </div>
  );
};
