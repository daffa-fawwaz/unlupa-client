import { BookOpen, ChevronRight, GraduationCap, Plus, Sparkles, Users } from "lucide-react";

export const CreateClassButton = () => {
  return (
    <button className="group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#172231] via-[#101722] to-[#080B10] p-5 text-left font-sans text-white shadow-[0_24px_70px_-38px_rgba(0,0,0,0.95)] transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:shadow-[0_34px_90px_-42px_rgba(16,185,129,0.45)] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-blue-400" />
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-[90px] transition-opacity duration-700 group-hover:opacity-80" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-blue-400/8 blur-[90px]" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-emerald-400/25 bg-emerald-400/10 shadow-[0_20px_50px_-28px_rgba(16,185,129,0.95)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
            <Plus className="h-8 w-8 text-emerald-300" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                <Sparkles className="h-3 w-3" />
                Ruang Baru
              </span>
              <span className="text-xs font-medium text-gray-500">
                Setup kelas, materi, dan peserta dalam satu alur
              </span>
            </div>

            <h2 className="max-w-2xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
              Buat ruang belajar baru
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
              Mulai kelas dengan modul pilihan, atur kitab yang dipelajari, lalu undang siswa untuk mengikuti review bersama.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                <GraduationCap className="h-4 w-4 shrink-0 text-emerald-300" />
                <span className="truncate text-xs font-bold text-gray-300">
                  Profil kelas
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                <BookOpen className="h-4 w-4 shrink-0 text-blue-300" />
                <span className="truncate text-xs font-bold text-gray-300">
                  Modul & kitab
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/4 px-3 py-2.5">
                <Users className="h-4 w-4 shrink-0 text-amber-300" />
                <span className="truncate text-xs font-bold text-gray-300">
                  Undang siswa
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0B1018]/80 p-3 sm:justify-start lg:w-64 lg:flex-col lg:items-stretch lg:p-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Langkah awal
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-200">
              Isi detail kelas
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#06110D] transition-transform duration-500 group-hover:translate-x-1 lg:w-full lg:rounded-xl">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </button>
  );
};
