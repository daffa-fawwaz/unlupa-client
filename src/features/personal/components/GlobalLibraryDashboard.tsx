import { Sidebar } from "@/components/ui/Sidebar";
import { useState, useEffect } from "react";
import { Menu, Library, Loader2, Globe, Search, ArrowLeft } from "lucide-react";
import { usePublishedBooks } from "../hooks/usePublishedBooks";
import { PublicBookCard } from "./PublicBookCard";
import { NavLink } from "react-router";

export const GlobalLibraryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { books, loading, fetchBooks } = usePublishedBooks();

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const totalPublished = books.length;

  return (
    <div className="min-h-screen relative bg-[#090A0F] rounded-3xl overflow-hidden selection:bg-purple-500/30">
      {/* --- Dynamic Background Atmosphere --- */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-purple-900/10 via-[#090A0F] to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

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
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131824]/80 border border-purple-500/20 text-xs text-purple-400 font-bold backdrop-blur-xl shadow-lg shadow-purple-500/5 select-none transition-all hover:bg-[#1A2235]">
              <Library className="w-4 h-4" />
              <span>{totalPublished} Karya Global</span>
            </div>
          </div>
        </div>

        {/* === HERO / HEADER SECTION === */}
        <div className="mb-14 relative flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 text-xs font-medium text-purple-400 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Live Library Repository
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-5 tracking-tight drop-shadow-lg leading-tight">
              Perpustakaan <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-fuchsia-300 to-indigo-400">
                Umat Global.
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Pelajari & unduh literatur, rangkuman, dan materi hafalan
              berkualitas tinggi dari kontributor di seluruh dunia untuk
              menunjang studi Anda.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs shrink-0">
            <div className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-500 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari perihal atau kitab..."
              className="w-full bg-[#111620]/60 border border-purple-500/20 text-white pl-14 pr-5 py-4 rounded-2xl font-inter focus:outline-none focus:border-purple-400 focus:bg-[#1A2235]/80 transition-all box-border shadow-lg backdrop-blur-md placeholder-gray-600"
            />
          </div>
        </div>

        {/* === SECTION 1: LIBRARY GRID === */}
        <div className="mb-20 z-10 relative">
          {loading && books.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 bg-[#111620]/30 rounded-[3rem] border border-white/5">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-6" />
              <p className="text-gray-400 text-lg animate-pulse font-light tracking-wide">
                Menghubungkan ke Repositori Global...
              </p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <PublicBookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500/20 to-indigo-500/20 rounded-[3rem] blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative flex flex-col items-center justify-center py-32 px-4 rounded-[3rem] border border-purple-500/20 bg-[#0A0D14] text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative">
                  <div className="w-28 h-28 rounded-[2rem] bg-linear-to-br from-[#161D29] to-[#0F141C] flex items-center justify-center mb-8 border border-white/5 shadow-2xl mx-auto relative z-10 group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-purple-500/10 rounded-[2rem] animate-pulse" />
                    <Globe className="w-12 h-12 text-purple-400/80 drop-shadow-md" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  Katalog Masih Kosong
                </h3>
                <p className="text-gray-400 max-w-md mb-10 text-lg font-light leading-relaxed">
                  Saat ini belum ada satupun kontributor yang mempublikasikan
                  karya mereka secara global kawan...
                </p>

                <NavLink
                  to="/dashboard/pribadi"
                  className="px-8 py-4 rounded-full cursor-pointer bg-white text-black font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] decoration-transparent"
                >
                  <ArrowLeft className="w-5 h-5 text-black" />
                  <span className="tracking-wide">
                    Kembali ke Workspace Pribadi
                  </span>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
