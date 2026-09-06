import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react";
import {
  Menu,
  Loader2,
  Share2,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { ShareBookCard } from "./ShareBookCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Book } from "../types/personal.types";
import { NavLink } from "react-router";

export const ShareBooksDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookToShare, setBookToShare] = useState<Book | null>(null);

  // Custom toast/modal states
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { books, loading, fetchBooks, requestPublish } = useBooks();

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const totalBooks = books.length;

  const handleConfirmShare = async () => {
    if (!bookToShare) return;

    try {
      await requestPublish(bookToShare.id);
      setSuccessMsg(
        `Kitab "${bookToShare.title}" berhasil diajukan untuk publikasi global!`,
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengajukan publikasi kitab.");
    } finally {
      setBookToShare(null);
    }
  };

  return (
    <div className="min-h-screen relative bg-background rounded-3xl overflow-hidden selection:bg-success/30">
      {/* --- Dynamic Background Atmosphere --- */}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn max-w-[1600px] mx-auto relative z-10">
        {/* === TOP NAVIGATION BAR === */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group cursor-pointer lg:mr-4"
            >
              <div className="p-2.5 rounded-2xl border border-border group-hover:border-border bg-surface-1 group-hover:bg-surface-2 transition-all duration-300 shadow-sm">
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </button>
            <NavLink
              to="/dashboard/pribadi"
              className="px-5 py-2.5 rounded-full bg-surface-1 border border-border text-xs text-muted-foreground font-bold hover:bg-surface-2 transition-colors flex items-center gap-2 decoration-transparent cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Workspace</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-1 border border-success/20 text-xs text-success font-bold shadow-sm select-none transition-all hover:bg-surface-2">
              <BookOpen className="w-4 h-4" />
              <span>{totalBooks} Karya Pribadi</span>
            </div>
          </div>
        </div>

        {/* === HERO / HEADER SECTION === */}
        <div className="mb-14 relative flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-6 text-xs font-medium text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Ruang Publikasi
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-5 tracking-tight leading-tight">
              Karya Anda, <br className="hidden md:block" />
              <span className="text-success">
                Amal Jariyah.
              </span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Pilih karya tulis dan kurikulum hafalan Anda untuk dibagikan ke
              seluruh umat. Berbagi ilmu tidak akan pernah menguranginya.
            </p>
          </div>
        </div>

        {/* === SECTION 1: LIBRARY GRID === */}
        <div className="mb-20 z-10 relative">
          {loading && books.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 bg-card rounded-2xl border border-border">
              <Loader2 className="w-10 h-10 text-success animate-spin mb-6" />
              <p className="text-muted-foreground text-lg animate-pulse font-light tracking-wide">
                Memuat Koleksi Anda...
              </p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <ShareBookCard
                  key={book.id}
                  book={book}
                  onShare={(b) => setBookToShare(b)}
                />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="relative flex flex-col items-center justify-center py-32 px-4 rounded-2xl border border-success/20 bg-card text-center overflow-hidden">

                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-surface-1 flex items-center justify-center mb-8 border border-border shadow-sm mx-auto relative z-10 group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-success/10 rounded-2xl animate-pulse" />
                    <Share2 className="w-12 h-12 text-success/80" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                  Belum Ada Karya
                </h3>
                <p className="text-muted-foreground max-w-md mb-10 text-lg font-light leading-relaxed">
                  Anda memerlukan setidaknya satu kitab buatan sendiri sebelum
                  dapat membagikannya kepada orang lain.
                </p>

                <NavLink
                  to="/dashboard/pribadi"
                  className="px-8 py-4 rounded-full cursor-pointer bg-primary text-primary-foreground font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-sm decoration-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="tracking-wide">Kembali Buat Materi</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!bookToShare}
        onClose={() => setBookToShare(null)}
        onConfirm={handleConfirmShare}
        title="Bagikan Karya?"
        message={`Apakah Anda yakin ingin membagikan kitab "${bookToShare?.title}" ke perpustakaan global? Karya ini akan dapat diunduh oleh para penuntut ilmu lainnya.`}
        confirmText="Ya, Publikasikan"
        cancelText="Batal"
        variant="success"
      />

      {/* SUCCESS MODAL Overlay */}
      {successMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-success/30 rounded-2xl p-8 max-w-sm w-full shadow-xl text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 border border-success/30 text-success">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 tracking-wide">
              Sukses!
            </h3>
            <p className="text-muted-foreground mb-8 font-light leading-relaxed">
              {successMsg}
            </p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="w-full py-3.5 rounded-full bg-success text-success-foreground font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ERROR MODAL Overlay */}
      {errorMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-destructive/30 rounded-2xl p-8 max-w-sm w-full shadow-xl text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6 border border-destructive/30 text-destructive">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 tracking-wide">
              Terjadi Kesalahan
            </h3>
            <p className="text-muted-foreground mb-8 font-light leading-relaxed">
              {errorMsg}
            </p>
            <button
              onClick={() => setErrorMsg(null)}
              className="w-full py-3.5 rounded-full bg-destructive text-destructive-foreground font-bold transition-colors cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
