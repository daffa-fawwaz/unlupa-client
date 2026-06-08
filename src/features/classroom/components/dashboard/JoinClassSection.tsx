import { useState } from "react";
import { GraduationCap, Hash, Loader2, Sparkles, Users } from "lucide-react";

type JoinClassSectionProps = {
  onJoin?: (classCode: string) => void;
};

export const JoinClassSection = ({ onJoin }: JoinClassSectionProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Masukkan kode kelas yang valid");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onJoin?.(code.trim());
      setSuccess("Berhasil bergabung ke kelas!");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal bergabung ke kelas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#172231] via-[#101722] to-[#080B10] p-6 shadow-[0_24px_70px_-38px_rgba(0,0,0,0.95)] transition-all duration-500 hover:border-indigo-400/25 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-blue-400 to-cyan-400" />
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-400/10 blur-[90px] transition-opacity duration-700 group-hover:opacity-80" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-blue-400/8 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] border border-indigo-400/25 bg-indigo-400/10 shadow-[0_20px_50px_-28px_rgba(99,102,241,0.95)]">
                <GraduationCap className="h-7 w-7 text-indigo-300" />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Bergabung
                  </span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  Masuk ke Kelas
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">
                  Masukkan kode kelas yang diberikan pengajar untuk bergabung.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <Hash className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Contoh: ABC123"
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-indigo-400 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
              {success && <p className="mt-2 text-sm text-emerald-400">{success}</p>}

              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-blue-500 hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Gabung Kelas</span>
                )}
              </button>
            </form>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/5 bg-white/4 p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Panduan
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-200">Minta kode</p>
                  <p className="text-[11px] leading-relaxed text-gray-500">
                    Tanyakan kode kelas kepada pengajar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-200">Masukkan kode</p>
                  <p className="text-[11px] leading-relaxed text-gray-500">
                    Ketik kode pada kolom di atas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-200">Gabung kelas</p>
                  <p className="text-[11px] leading-relaxed text-gray-500">
                    Klik gabung dan mulai mengakses materi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinClassSection;
