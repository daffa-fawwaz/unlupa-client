import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  ImageOff,
  Layers,
  ListPlus,
  Plus,
  X,
  FileText,
  LayoutList,
  Loader2,
  AlertCircle,
  Globe,
  Lock,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useBookDetail } from "@/features/personal/hooks/useBookDetail";

/* ------------------------------------------------------------------ */
/* Add-Content Picker Modal                                             */
/* ------------------------------------------------------------------ */
const AddContentModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        {/* Glow ring */}
        <div className="absolute -inset-px rounded-[2.5rem] bg-linear-to-br from-blue-500/30 via-purple-500/20 to-transparent blur-sm pointer-events-none" />

        <div className="relative rounded-[2.5rem] bg-[#0E1420] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Tambah Hafalan
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-13">
              Pilih jenis konten yang ingin ditambahkan ke buku ini.
            </p>
          </div>

          {/* Options */}
          <div className="p-6 space-y-4">
            {/* Option 1: Tambah Modul */}
            <button className="w-full group flex items-center gap-5 p-5 rounded-2xl bg-linear-to-r from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-400/60 hover:from-blue-500/20 transition-all duration-300 text-left cursor-not-allowed opacity-60">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-base">
                    Tambah Modul
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold tracking-widest uppercase">
                    Soon
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Kelompokkan item hafalan menjadi bab atau bagian terstruktur.
                </p>
              </div>
            </button>

            {/* Option 2: Tambah Item */}
            <button className="w-full group flex items-center gap-5 p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-400/60 hover:from-emerald-500/20 transition-all duration-300 text-left cursor-not-allowed opacity-60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-base">
                    Tambah Item
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold tracking-widest uppercase">
                    Soon
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tambahkan unit hafalan seperti ayat, kosakata, atau teks
                  spesifik.
                </p>
              </div>
            </button>
          </div>

          {/* Footer hint */}
          <div className="px-8 pb-7 text-center">
            <p className="text-xs text-gray-600">
              Fitur modul dan item akan segera tersedia dalam pembaruan
              berikutnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Book Detail Page                                                     */
/* ------------------------------------------------------------------ */
export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, loading, error, fetchBookDetail } = useBookDetail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchBookDetail(id);
  }, [id, fetchBookDetail]);

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
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    pending: {
      label: "Pending Review",
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    published: {
      label: "Published",
      icon: Globe,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  };

  const status = statusConfig[book?.status as keyof typeof statusConfig] ?? statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#090A0F] text-white font-primary selection:bg-blue-500/30">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
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
              className="p-2.5 rounded-2xl border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-lg text-gray-400 hover:text-white"
            >
              <LayoutList className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </div>

          {/* Book title in header (breadcrumb style) */}
          {book && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400 max-w-xs truncate">
              <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate font-medium text-white">
                {book.title}
              </span>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          >
            <ListPlus className="w-4 h-4" />
            <span>Tambah Hafalan</span>
          </button>
        </div>

        {/* ---- Loading State ---- */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl animate-pulse" />
            </div>
            <p className="text-gray-500 text-sm animate-pulse">
              Memuat detail buku...
            </p>
          </div>
        )}

        {/* ---- Error State ---- */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <p className="text-rose-400 text-sm font-medium">{error}</p>
            <button
              onClick={() => id && fetchBookDetail(id)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-gray-300 hover:text-white transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ---- Book Detail ---- */}
        {!loading && !error && book && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Card */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
              {/* Cover / gradient bg */}
              <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-[#0D1117]">
                {book.cover_image ? (
                  <>
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0D1117] via-[#0D1117]/60 to-transparent" />
                  </>
                ) : (
                  <>
                    {/* Abstract generative bg */}
                    <div className="absolute inset-0 bg-linear-to-br from-[#0D1117] via-[#111827] to-[#0F0A1A]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[80px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[60px] rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl">
                        <ImageOff className="w-9 h-9 text-gray-600" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-[#0D1117] via-transparent to-transparent" />
                  </>
                )}

                {/* Floating status badge */}
                <div className="absolute top-5 left-5">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} border ${status.border} backdrop-blur-xl shadow-lg`}
                  >
                    <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                    <span
                      className={`text-[11px] font-bold tracking-widest uppercase ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Edit button */}
                <div className="absolute top-5 right-5">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Info Body */}
              <div className="bg-[#0E1420] px-6 sm:px-10 py-8">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                  {book.title}
                </h1>
                <p className="text-gray-400 text-base leading-relaxed font-light max-w-2xl">
                  {book.description ||
                    "Tidak ada deskripsi untuk buku ini."}
                </p>

                {/* Meta info strip */}
                <div className="flex flex-wrap items-center gap-5 mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>Dibuat {formatDate(book.created_at)}</span>
                  </div>
                  {book.published_at && (
                    <div className="flex items-center gap-2 text-sm text-emerald-500/80">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Dipublikasi {formatDate(book.published_at)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>Diperbarui {formatDate(book.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Total Item",
                  value: "0",
                  color: "text-blue-400",
                  bg: "from-blue-500/10",
                  border: "border-blue-500/15",
                },
                {
                  label: "Modul",
                  value: "0",
                  color: "text-purple-400",
                  bg: "from-purple-500/10",
                  border: "border-purple-500/15",
                },
                {
                  label: "Selesai",
                  value: "0%",
                  color: "text-emerald-400",
                  bg: "from-emerald-500/10",
                  border: "border-emerald-500/15",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${s.bg} to-transparent border ${s.border} p-5 text-center`}
                >
                  <div className={`text-3xl font-black ${s.color} mb-1`}>
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Content area — empty state */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0E1420]">
              {/* Decorative top border */}
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

              <div className="px-8 py-7 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Konten Buku
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/20 text-blue-400 text-sm font-medium transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>

              {/* Empty content state */}
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#161D29] border border-white/10 flex items-center justify-center shadow-2xl">
                    <BookOpen className="w-10 h-10 text-gray-600" />
                  </div>
                  <div className="absolute -inset-3 bg-blue-500/5 rounded-[2.5rem] blur-2xl pointer-events-none" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Buku Masih Kosong
                </h3>
                <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">
                  Mulai tambahkan modul atau item hafalan pertama Anda untuk
                  membangun kurikulum yang terstruktur.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-black font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Hafalan Pertama
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Content Modal */}
      {isAddModalOpen && (
        <AddContentModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
