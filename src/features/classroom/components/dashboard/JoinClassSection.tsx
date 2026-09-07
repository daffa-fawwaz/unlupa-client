import { useState } from "react";
import { GraduationCap, Hash, Loader2, Sparkles, Users } from "lucide-react";
import { useJoinClass } from "@/features/classroom/hooks/useClassroom";

export const JoinClassSection = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    mutate: joinClass,
    isPending,
    error: mutationError,
    isSuccess,
  } = useJoinClass();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    joinClass(
      {
        code: code.trim(),
      },
      {
        onSuccess: () => {
          setSuccess("Berhasil bergabung ke kelas!");
          setCode("");
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };

  return (
    <section className="mt-8">
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/25 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary/70 to-primary/40" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] border border-primary/25 bg-primary/10">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Bergabung
                  </span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  Masuk ke Kelas
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Masukkan kode kelas yang diberikan pengajar untuk bergabung.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
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
                  className="w-full rounded-2xl border border-border bg-surface-1 py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              {success && (
                <p className="mt-2 text-sm text-success">{success}</p>
              )}

              <button
                type="submit"
                disabled={isPending || !code.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 px-5 py-4 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {isPending ? (
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

          <div className="shrink-0 rounded-2xl border border-border bg-surface-1 p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Panduan
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Minta kode</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Tanyakan kode kelas kepada pengajar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Masukkan kode
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Ketik kode pada kolom di atas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Gabung kelas
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
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
