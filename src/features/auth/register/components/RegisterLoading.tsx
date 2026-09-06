import { Loader2 } from "lucide-react";

export const RegisterLoading = () => {
  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-10 relative overflow-hidden transition-all duration-500 mx-auto">
        <div
          id="state-loading"
          className="state-view text-center py-10 flex flex-col items-center justify-center w-full"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-6" />

          <h3 className="font-mono text-primary text-xs uppercase tracking-widest mb-4 animate-pulse">
            Processing Request
          </h3>

          <h2 className="font-serif text-2xl text-foreground mb-4">
            Menyiapkan Ruang Belajar Anda...
          </h2>

          <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-xs mx-auto">
            Kami sedang menyiapkan ruang pribadi agar proses belajar Anda tetap
            tenang dan terarah.
          </p>

          <p className="text-muted-foreground/60 text-xs mt-8">
            Ini hanya memerlukan beberapa detik.
          </p>
        </div>
      </div>
    </div>
  );
};
