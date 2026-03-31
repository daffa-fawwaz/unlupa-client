import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react";
import {
  Menu,
  Files,
  BookOpen,
  Share2,
  Download,
  Plus,
  Library,
  Loader2,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { Link, useNavigate } from "react-router";
import { BookCard } from "./BookCard";
import { CreateBookModal } from "./CreateBookModal";
import { EditBookModal } from "./EditBookModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BookDailyReviewSection } from "./BookDailyReviewSection";
import type { Book } from "../types/personal.types";

export const PersonalDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const { books, loading, fetchBooks, deleteBook } = useBooks();

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const totalMateri = books.length;

  return (
    <div className="min-h-screen relative bg-[#090A0F] rounded-3xl overflow-hidden selection:bg-blue-500/30">
      {/* --- Dynamic Background Atmosphere --- */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-blue-900/10 via-[#090A0F] to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn max-w-[1600px] mx-auto relative z-10">
        {/* === TOP NAVIGATION BAR === */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group cursor-pointer"
          >
            <div className="p-2.5 rounded-2xl border border-white/5 group-hover:border-white/20 bg-white/5 group-hover:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-lg">
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-mono tracking-[0.2em] font-semibold hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
              MENU
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131824]/80 border border-blue-500/20 text-xs text-blue-400 font-bold backdrop-blur-xl shadow-lg shadow-blue-500/5 select-none transition-all hover:bg-[#1A2235]">
              <Files className="w-4 h-4" />
              <span>{totalMateri} Kitab Disimpan</span>
            </div>
          </div>
        </div>

        {/* === HERO / HEADER SECTION === */}
        <div className="mb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-xs font-medium text-gray-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Personal Workspace
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-5 tracking-tight drop-shadow-lg leading-tight">
            Ruang{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-cyan-300 to-emerald-400">
              Pribadi.
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Bangun kurikulum hafalan Anda sendiri, kelola materi secara mandiri,
            dan eksplorasi ribuan perpustakaan global untuk pengalaman belajar
            maksimal.
          </p>

          {/* Quick Stats Strip */}
          <div className="flex flex-wrap items-center gap-4 md:gap-8 p-6 rounded-[2rem] bg-[#111620]/60 border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">0</div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  Aktivitas Hari Ini
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/10" />

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  0<span className="text-base text-gray-500 ml-1">menit</span>
                </div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  Waktu Belajar
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-12 bg-white/10" />

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">Pemula</div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  Level Saat Ini
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === DAILY REVIEW SECTION (BOOKS ONLY) === */}
        <BookDailyReviewSection />

        {/* === MAIN ACTION BUTTONS (Bento Grid Style) === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 relative z-10">
          {/* Action 1: Buat Materi */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-linear-to-b from-[#161D29] to-[#0D121A] border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 p-8 text-left min-h-[220px] flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />

            <div className="flex justify-between items-start relative z-10 w-full mb-6">
              <div className="w-14 h-14 rounded-[1.5rem] bg-linear-to-br from-blue-500 to-cyan-500 p-px shadow-lg group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.4rem] bg-[#111824] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <Plus className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-blue-50 transition-colors">
                Buat Materi LKS
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                Tulis dan racik kurikulum sistematis dari nol untuk target
                hafalan pribadi.
              </p>
            </div>
          </button>

          {/* Action 2: Bagikan Kitab */}
          <Link
            to="/dashboard/pribadi/share"
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-linear-to-b from-[#161D29] to-[#0D121A] border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-500 p-8 text-left min-h-[220px] flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:-translate-y-1 decoration-transparent"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-2xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />

            <div className="flex justify-between items-start relative z-10 w-full mb-6">
              <div className="w-14 h-14 rounded-[1.5rem] bg-linear-to-br from-emerald-500 to-teal-500 p-px shadow-lg group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.4rem] bg-[#111824] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <Share2 className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-emerald-50 transition-colors">
                Bagikan Karya
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                Jadikan karya Anda amal jariyah dengan mempublikasikannya ke
                seluruh umat.
              </p>
            </div>
          </Link>

          {/* Action 3: Import Kitab */}
          <Link
            to="/dashboard/pribadi/explore"
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-linear-to-b from-[#161D29] to-[#0D121A] border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 p-8 text-left min-h-[220px] flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] hover:-translate-y-1 decoration-transparent"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />

            <div className="flex justify-between items-start relative z-10 w-full mb-6">
              <div className="w-14 h-14 rounded-[1.5rem] bg-linear-to-br from-purple-500 to-pink-500 p-px shadow-lg group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.4rem] bg-[#111824] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <Download className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-purple-50 transition-colors">
                Impor dari Katalog
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                Salin paket materi siap saji milik para guru & kontributor dari
                perpustakaan.
              </p>
            </div>
          </Link>
        </div>

        {/* === SECTION 1: KARYA MANDIRI === */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
                  Karya Mandiri
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 align-middle">
                    Manajemen
                  </span>
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Buku, kitab, atau kurikulum hafalan yang Anda buat sendiri.
              </p>
            </div>
          </div>

          {loading && books.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20 bg-[#111620]/30 rounded-[2.5rem] border border-white/5">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 text-sm animate-pulse">
                Memuat koleksi...
              </p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => navigate(`/dashboard/pribadi/book/${book.id}`)}
                  onEdit={(b) => setEditingBook(b)}
                  onDelete={(b) => setBookToDelete(b)}
                />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative flex flex-col items-center justify-center py-28 px-4 rounded-[3rem] border border-blue-500/20 bg-[#0F141C] text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative">
                  <div className="w-24 h-24 rounded-[2rem] bg-[#161D29] flex items-center justify-center mb-8 border border-white/10 shadow-2xl mx-auto relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] animate-pulse" />
                    <BookOpen className="w-10 h-10 text-blue-400" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                  Kanvas Anda Masih Kosong
                </h3>
                <p className="text-gray-400 max-w-md mb-10 text-lg font-light leading-relaxed">
                  Langkah terbaik dimulai dari huruf pertama. Tulis panduan
                  hafalan Anda sendiri dan rasakan progres belajarnya.
                </p>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-8 py-4 rounded-full cursor-pointer bg-white text-black font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                  <Plus className="w-5 h-5" />
                  <span>Mulai Berkarya</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* === SECTION 2: KOLEKSI PERPUSTAKAAN DUNIA === */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
                  Perpustakaan Global
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 align-middle flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    Live
                  </span>
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Download karya pengguna lain ke dalam workspace Anda.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-[3rem] blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative flex flex-col items-center justify-center py-28 px-4 rounded-[3rem] border border-white/5 bg-[#0F141C] text-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-linear-to-br from-[#1A1A2E] to-[#16213E] flex items-center justify-center mb-8 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] mx-auto relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                  <Library className="w-10 h-10 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                Area Unduhan Kosong
              </h3>
              <p className="text-gray-400 max-w-md mb-10 text-lg font-light leading-relaxed">
                Jelajahi berbagai materi kurikulum pilihan dari penuntut ilmu
                yang lain yang siap pakai untuk Anda pelajari sekarang.
              </p>

              <Link
                to="/dashboard/pribadi/explore"
                className="w-max px-8 py-4 rounded-full cursor-pointer bg-[#1A1A2E] border border-purple-500/30 hover:border-purple-400 hover:bg-[#202035] shadow-[0_10px_30px_rgba(168,85,247,0.15)] hover:shadow-[0_10px_40px_rgba(168,85,247,0.3)] text-white font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 decoration-transparent"
              >
                <Download className="w-5 h-5 text-purple-400" />
                <span className="tracking-wide">Jelajahi Perpustakaan</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Create Book Modal */}
      {isCreateModalOpen && (
        <CreateBookModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => fetchBooks()}
        />
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSuccess={() => fetchBooks()}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={async () => {
          if (bookToDelete) {
            await deleteBook(bookToDelete.id);
            setBookToDelete(null);
          }
        }}
        title="Hapus Kitab?"
        message={`Apakah Anda yakin ingin menghapus kitab "${bookToDelete?.title}" secara permanen? Semua data di dalamnya akan hilang.`}
        confirmText="Hapus Permanen"
        variant="danger"
      />
    </div>
  );
};
