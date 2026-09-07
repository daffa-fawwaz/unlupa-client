import { BookOpen, GraduationCap, Plus, Sparkles, Users } from "lucide-react";
import type { CreateClassButtonProps } from "../../types";

export const CreateClassButton = ({ onClick }: CreateClassButtonProps) => {
  return (
    <button className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-5 text-left font-sans text-foreground transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/25 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary/70 to-primary/40" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-primary/25 bg-primary/10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
            <Plus className="h-8 w-8 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" />
                Kelas Baru
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Setup kelas, materi, dan peserta dalam satu alur
              </span>
            </div>

            <h2 className="max-w-2xl text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl">
              Buat ruang belajar baru
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Mulai kelas dengan modul pilihan, atur kitab yang dipelajari, lalu
              undang siswa untuk mengikuti review bersama.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-xs font-bold text-muted-foreground">
                  Profil kelas
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                <BookOpen className="h-4 w-4 shrink-0 text-info" />
                <span className="truncate text-xs font-bold text-muted-foreground">
                  Modul & kitab
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                <Users className="h-4 w-4 shrink-0 text-warning" />
                <span className="truncate text-xs font-bold text-muted-foreground">
                  Undang siswa
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-border bg-surface-1 p-3 sm:justify-start lg:w-64 lg:flex-col lg:items-stretch lg:p-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Langkah awal
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Isi detail kelas
            </p>
          </div>
          <button
            className="flex hover:scale-105 hover:rotate-2 hover:cursor-pointer h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground transition-transform duration-500 group-hover:translate-x-1 lg:w-full lg:rounded-xl"
            onClick={onClick}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </button>
  );
};
