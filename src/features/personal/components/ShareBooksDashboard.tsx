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
    <div className="min-h-screen relative bg-[#090A0F] rounded-3xl overflow-hidden selection:bg-emerald-500/30">
      {/* --- Dynamic Background Atmosphere --- */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-emerald-900/10 via-[#090A0F] to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group cursor-pointer lg:mr-4"
            >
              <div className="p-2.5 rounded-2xl border border-white/5 group-hover:border-white/20 bg-white/5 group-hover:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-lg">
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </button>
            <NavLink
              to="/dashboard/pribadi"
              className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-bold backdrop-blur-md hover:bg-white/10 transition-colors flex items-center gap-2 decoration-transparent cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Workspace</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131824]/80 border border-emerald-500/20 text-xs text-emerald-400 font-bold backdrop-blur-xl shadow-lg shadow-emerald-500/5 select-none transition-all hover:bg-[#1A2235]">
              <BookOpen className="w-4 h-4" />
              <span>{totalBooks} Karya Pribadi</span>
            </div>
          </div>
        </div>

        {/* === HERO / HEADER SECTION === */}
        <div className="mb-14 relative flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 text-xs font-medium text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ruang Publikasi
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-5 tracking-tight drop-shadow-lg leading-tight">
              Karya Anda, <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Amal Jariyah.
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Pilih karya tulis dan kurikulum hafalan Anda untuk dibagikan ke
              seluruh umat. Berbagi ilmu tidak akan pernah menguranginya.
            </p>
          </div>
        </div>

        {/* === SECTION 1: LIBRARY GRID === */}
        <div className="mb-20 z-10 relative">
          {loading && books.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 bg-[#111620]/30 rounded-[3rem] border border-white/5">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-6" />
              <p className="text-gray-400 text-lg animate-pulse font-light tracking-wide">
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
              <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-[3rem] blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative flex flex-col items-center justify-center py-32 px-4 rounded-[3rem] border border-emerald-500/20 bg-[#0A0D14] text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative">
                  <div className="w-28 h-28 rounded-[2rem] bg-linear-to-br from-[#16211C] to-[#0F141C] flex items-center justify-center mb-8 border border-white/5 shadow-2xl mx-auto relative z-10 group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] animate-pulse" />
                    <Share2 className="w-12 h-12 text-emerald-400/80 drop-shadow-md" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  Belum Ada Karya
                </h3>
                <p className="text-gray-400 max-w-md mb-10 text-lg font-light leading-relaxed">
                  Anda memerlukan setidaknya satu kitab buatan sendiri sebelum
                  dapat membagikannya kepada orang lain.
                </p>

                <NavLink
                  to="/dashboard/pribadi"
                  className="px-8 py-4 rounded-full cursor-pointer bg-white text-black font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] decoration-transparent"
                >
                  <ArrowLeft className="w-5 h-5 text-black" />
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
          <div className="bg-[#0B1210] border border-emerald-500/30 rounded-[2rem] p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 text-emerald-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
              Sukses!
            </h3>
            <p className="text-gray-400 mb-8 font-light leading-relaxed">
              {successMsg}
            </p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ERROR MODAL Overlay */}
      {errorMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#120B0B] border border-rose-500/30 rounded-[2rem] p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(244,63,94,0.2)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6 border border-rose-500/30 text-rose-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-400 mb-8 font-light leading-relaxed">
              {errorMsg}
            </p>
            <button
              onClick={() => setErrorMsg(null)}
              className="w-full py-3.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-bold transition-colors cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
