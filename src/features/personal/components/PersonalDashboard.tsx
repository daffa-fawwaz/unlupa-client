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
} from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { useMyCollection } from "../hooks/useMyCollection";
import { Link, useNavigate } from "react-router";
import { BookCard } from "./BookCard";
import { CreateBookModal } from "./CreateBookModal";
import { EditBookModal } from "./EditBookModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Book } from "../types/personal.types";
import { BookDailyReviewSection } from "./BookDailyReviewSection";

export const PersonalDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const { books, loading, fetchBooks, deleteBook } = useBooks();
  const { collection, loadingCollection, fetchCollection } = useMyCollection();

  useEffect(() => {
    void fetchBooks();
    void fetchCollection();
  }, [fetchBooks, fetchCollection]);

  const totalMateri = books.length;

  return (
    <>
      <div className="min-h-screen relative bg-background rounded-3xl overflow-hidden selection:bg-primary/30">
        {/* --- Dynamic Background Atmosphere --- */}

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

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
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group cursor-pointer"
            >
              <div className="p-2.5 rounded-2xl border border-border group-hover:border-border bg-surface-1 group-hover:bg-surface-2 transition-all duration-300 shadow-sm">
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-mono tracking-[0.2em] font-semibold hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
                MENU
              </span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-1 border border-primary/20 text-xs text-primary font-bold shadow-sm select-none transition-all hover:bg-surface-2">
                <Files className="w-4 h-4" />
                <span>{totalMateri} Kitab Disimpan</span>
              </div>
            </div>
          </div>

          {/* === HERO / HEADER SECTION === */}
          <div className="mb-12 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-border mb-6 text-xs font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Personal Workspace
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-5 tracking-tight leading-tight">
              Ruang{" "}
              <span className="text-primary">Pribadi</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-light mb-8">
              Bangun kurikulum hafalan Anda sendiri, kelola materi secara
              mandiri, dan eksplorasi ribuan perpustakaan global untuk
              pengalaman belajar maksimal.
            </p>

            {/* Quick Action Strip */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-stretch sm:gap-0 p-2 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden">

              {/* Buat Materi */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="group flex flex-col sm:flex-row items-center sm:gap-4 gap-2 sm:flex-1 px-2 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-primary/10 transition-all duration-300 text-center sm:text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all shrink-0">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-base font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                    Buat Materi
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors">
                    Buat buku baru dari nol
                  </div>
                </div>
              </button>

              <div className="hidden md:block w-px my-3 bg-border" />

              {/* Bagikan Karya */}
              <Link
                to="/dashboard/pribadi/share"
                className="group flex flex-col sm:flex-row items-center sm:gap-4 gap-2 sm:flex-1 px-2 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-success/10 transition-all duration-300 decoration-transparent text-center sm:text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-success/10 flex items-center justify-center border border-success/20 text-success group-hover:scale-110 group-hover:bg-success/20 transition-all shrink-0">
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-base font-black text-foreground group-hover:text-success transition-colors leading-tight">
                    Bagikan Karya
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors">
                    Publikasikan ke komunitas
                  </div>
                </div>
              </Link>

              <div className="hidden lg:block w-px my-3 bg-border" />

              {/* Import Katalog */}
              <Link
                to="/dashboard/pribadi/explore"
                className="group flex flex-col sm:flex-row items-center sm:gap-4 gap-2 sm:flex-1 px-2 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-primary/10 transition-all duration-300 decoration-transparent text-center sm:text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all shrink-0">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-base font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                    Impor Katalog
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors">
                    Salin materi dari perpustakaan
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* === QUICK NAVIGATION === */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <a
              href="#karya-mandiri"
              className="group flex flex-col md:flex-row items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-1 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Files className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-foreground text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                  Karya Mandiri
                </p>
                <p className="text-muted-foreground text-xs mt-0.5 truncate hidden md:block">
                  Buku buatan kamu
                </p>
              </div>
            </a>

            <a
              href="#perpustakaan-global"
              className="group flex flex-col md:flex-row items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-1 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Library className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-foreground text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                  Katalog Impor
                </p>
                <p className="text-muted-foreground text-xs mt-0.5 truncate hidden md:block">
                  Koleksi dari komunitas
                </p>
              </div>
            </a>
          </div>

          {/* === DAILY REVIEW SECTION (BOOKS ONLY) === */}
          <BookDailyReviewSection />

          {/* === SECTION 1: KARYA MANDIRI === */}
          <div className="mb-20" id="karya-mandiri">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-serif font-bold text-foreground tracking-wide flex items-center gap-3">
                    Karya Mandiri
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary border border-primary/20 align-middle">
                      Manajemen
                    </span>
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  Buku, kitab, atau kurikulum hafalan yang Anda buat sendiri.
                </p>
              </div>
            </div>

            {loading && books.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20 bg-card rounded-2xl border border-border">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground text-sm animate-pulse">
                  Memuat koleksi...
                </p>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() =>
                      navigate(`/dashboard/pribadi/book/${book.id}`)
                    }
                    onEdit={(b) => setEditingBook(b)}
                    onDelete={(b) => setBookToDelete(b)}
                  />
                ))}
              </div>
            ) : (
              <div className="relative group">
                <div className="relative flex flex-col items-center justify-center py-28 px-4 rounded-2xl border border-border bg-card text-center overflow-hidden">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-surface-1 flex items-center justify-center mb-8 border border-border shadow-sm mx-auto relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700">
                      <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                    Kanvas Anda Masih Kosong
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-10 text-lg font-light leading-relaxed">
                    Langkah terbaik dimulai dari huruf pertama. Tulis panduan
                    hafalan Anda sendiri dan rasakan progres belajarnya.
                  </p>

                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-8 py-4 rounded-full cursor-pointer bg-primary text-primary-foreground font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Mulai Berkarya</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* === SECTION 2: KOLEKSI PERPUSTAKAAN DUNIA === */}
          <div className="mb-10" id="perpustakaan-global">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-serif font-bold text-foreground tracking-wide flex items-center gap-3">
                    Katalog Impor
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary border border-primary/20 align-middle flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Live
                    </span>
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  Karya pengguna lain yang Anda unduh ke workspace Anda.
                </p>
              </div>
              <div className="flex shrink-0">
                <Link
                  to="/dashboard/pribadi/explore"
                  className="px-6 py-2.5 rounded-full cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all flex items-center gap-2 border border-primary/20 shadow-sm decoration-transparent"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Jelajahi Perpustakaan</span>
                </Link>
              </div>
            </div>

            {loadingCollection && collection.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20 bg-card rounded-2xl border border-border">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground text-sm animate-pulse">
                  Memuat koleksi impor...
                </p>
              </div>
            ) : collection.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {collection.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() =>
                      navigate(`/dashboard/pribadi/book/${book.id}`)
                    }
                    // onEdit and onDelete not provided to disable editing/deleting global library items
                  />
                ))}
              </div>
            ) : (
              <div className="relative group">
                <div className="relative flex flex-col items-center justify-center py-28 px-4 rounded-2xl border border-border bg-card text-center overflow-hidden">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-surface-1 flex items-center justify-center mb-8 border border-primary/20 shadow-sm mx-auto relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                      <Library className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                    Area Unduhan Kosong
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-10 text-lg font-light leading-relaxed">
                    Jelajahi berbagai materi kurikulum pilihan dari penuntut ilmu
                    yang lain yang siap pakai untuk Anda pelajari sekarang.
                  </p>

                  <Link
                    to="/dashboard/pribadi/explore"
                    className="w-max px-8 py-4 rounded-full cursor-pointer bg-surface-1 border border-primary/30 hover:border-primary hover:bg-surface-2 shadow-sm text-foreground font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 decoration-transparent"
                  >
                    <Download className="w-5 h-5 text-primary" />
                    <span className="tracking-wide">Jelajahi Perpustakaan</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals — outside overflow-hidden div so they render full-screen */}
      {isCreateModalOpen && (
        <CreateBookModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => fetchBooks()}
        />
      )}

      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSuccess={() => fetchBooks()}
        />
      )}

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
    </>
  );
};
