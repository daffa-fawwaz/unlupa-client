import { Flame, BookOpen, Inbox } from "lucide-react";

export const DailyReviewSection = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1220]/80 shadow-2xl shadow-slate-900/20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-blue-500 to-violet-400" />

      <div className="relative p-5 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] text-cyan-300">
              <Flame className="h-3.5 w-3.5 text-cyan-300" />
              Daily Review
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Daily Review
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
              Ringkasan semua target review harian dalam satu tampilan.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-4xl border border-white/10 bg-[#0F1624]/80 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Wadah Review</p>
              <p className="text-xs text-slate-500">
                Tampilan grup item yang perlu direview.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-300">
              Review Items
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-3xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 to-transparent bg-white/5 p-4 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.7)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-blue-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Buku Pelajaran
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    1 wadah review tersedia
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-white/10 bg-[#111827]/70 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-slate-500">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-white">
                Belum ada item yang harus di review
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Jika tidak ada wadah review, tampilan ini akan berubah menjadi
                placeholder kosong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
