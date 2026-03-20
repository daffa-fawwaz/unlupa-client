import { Sidebar } from "@/components/ui/Sidebar";
import { useState } from "react";
import {
  Menu,
  UserCircle,
  Files,
  BookOpen,
  Share2,
  Download,
  Plus,
  Library,
} from "lucide-react";

export const PersonalDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const totalMateri = 0; // Placeholder until integrated with real data

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[#0B0E14] rounded-3xl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="animate-fadeIn max-w-400 mx-auto">
        {/* === HEADER SECTION === */}
        <div className="mb-14 flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-start">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-all group cursor-pointer"
            >
              <div className="p-2.5 rounded-2xl border border-white/10 group-hover:border-blue-500/50 bg-white/5 group-hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm shadow-xl shadow-black/20">
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-mono tracking-[0.2em] hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
                MENU
              </span>
            </button>

            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-bold backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)] select-none">
              <Files className="w-4 h-4" />
              <span>{totalMateri} Kitab Tersimpan</span>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-white mb-4 flex items-center gap-5 tracking-tight">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full group-hover:bg-blue-400/40 transition-all duration-500" />
                <div className="relative z-10 p-3 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <UserCircle className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-blue-50 to-gray-400">
                Ruang Pribadi
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
              Kelola materi hafalan Anda sendiri, publikasikan karya Anda, dan
              unduh materi premium dari perpustakaan global untuk pengalaman
              belajar yang tak terbatas.
            </p>
          </div>
        </div>

        {/* === MAIN ACTION BUTTONS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16 relative z-10">
          {/* Action 1: Buat Materi (Primary) */}
          <button className="relative cursor-pointer overflow-hidden group p-8 rounded-[2rem] bg-linear-to-br from-[#1E2532] to-[#111620] border border-blue-500/20 hover:border-blue-400/60 transition-all duration-500 text-left flex flex-col justify-between min-h-[200px] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 group-hover:bg-blue-500 group-hover:border-blue-400 text-blue-400 group-hover:text-white transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <Plus className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight tracking-wide group-hover:text-blue-50 transition-colors">
                Buat Materi
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                Tulis manual, racik kurikulum hafalan Anda sendiri dari nol.
              </p>
            </div>
          </button>

          {/* Action 2: Bagikan Kitab */}
          <button className="relative cursor-pointer overflow-hidden group p-8 rounded-[2rem] bg-[#131922] border border-emerald-500/15 hover:border-emerald-400/50 transition-all duration-500 text-left flex flex-col justify-between min-h-[200px] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)]">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:border-emerald-400 text-emerald-400 group-hover:text-white transition-all duration-500">
              <Share2 className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight tracking-wide group-hover:text-emerald-50 transition-colors">
                Bagikan Kitab
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                Publikasikan karya Anda untuk jadi amal jariyah bagi umat.
              </p>
            </div>
          </button>

          {/* Action 3: Import Kitab */}
          <button className="relative cursor-pointer overflow-hidden group p-8 rounded-[2rem] bg-[#131922] border border-purple-500/15 hover:border-purple-400/50 transition-all duration-500 text-left flex flex-col justify-between min-h-[200px] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)]">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500 group-hover:border-purple-400 text-purple-400 group-hover:text-white transition-all duration-500">
              <Download className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight tracking-wide group-hover:text-purple-50 transition-colors">
                Import Kitab
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                Unduh materi berkualitas siap pakai dari perpustakaan global.
              </p>
            </div>
          </button>
        </div>

        {/* === SECTION 1: KARYA MANDIRI === */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4 tracking-wide">
                Materi Karya Mandiri
              </h2>
            </div>
            <div className="text-sm text-gray-500 bg-[#161D26] px-4 py-1.5 rounded-full border border-white/5 w-max">
              Koleksi Pribadi
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col items-center justify-center py-24 px-4 rounded-[2.5rem] border border-blue-500/20 bg-[#0F141C] text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] mx-auto relative z-10">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping opacity-20" />
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                Mulai Berkarya
              </h3>
              <p className="text-gray-400 max-w-md mb-8 text-lg font-light leading-relaxed">
                Tulis dan susun materi hafalan Anda sendiri secara terstruktur.
                Karya Anda bisa menjadi bekal berharga.
              </p>

              <button className="px-8 py-4 rounded-full cursor-pointer bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25 text-white font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 relative overflow-hidden group/btn border border-blue-400/30">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Buat Materi Sekarang</span>
              </button>
            </div>
          </div>
        </div>

        {/* === SECTION 2: KOLEKSI PERPUSTAKAAN DUNIA === */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white border-l-4 border-purple-500 pl-4 tracking-wide">
                Koleksi Perpustakaan Dunia
              </h2>
            </div>
            <div className="text-sm text-purple-400 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20 w-max font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Live Global
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col items-center justify-center py-24 px-4 rounded-[2.5rem] border border-purple-500/20 bg-[#0F141C] text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl mix-blend-screen" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl mix-blend-screen" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] mx-auto relative z-10">
                  <Library className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                Belum Ada Kitab Yang Diimpor
              </h3>
              <p className="text-gray-400 max-w-md mb-8 text-lg font-light leading-relaxed">
                Jelajahi berbagai materi kurikulum pilihan dari penuntut ilmu
                yang lain yang siap pakai untuk Anda pelajari.
              </p>

              <button className="px-8 py-4 rounded-full cursor-pointer bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_10px_20px_-10px_rgba(168,85,247,0.5)] text-white font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 relative overflow-hidden group/btn border border-purple-400/30">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                <Download className="w-5 h-5 relative z-10" />
                <span className="relative z-10 tracking-wide">
                  Jelajahi Perpustakaan
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
