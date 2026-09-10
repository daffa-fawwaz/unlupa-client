import { CheckCircle } from "lucide-react";

export const LoginSuccess = () => {
  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-10 relative overflow-hidden transition-all duration-500 mx-auto">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-success/30 to-transparent" />
        <div className="state-view text-center py-10 flex flex-col items-center justify-center w-full">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-300">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>

          <h3 className="font-mono text-success text-xs uppercase tracking-widest mb-4">
            Akses Diberikan
          </h3>

          <h2 className="font-serif text-2xl text-foreground mb-4">
            Selamat Datang Kembali!
          </h2>

          <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-xs mx-auto">
            Memuat dashboard Anda...
          </p>
        </div>
      </div>
    </div>
  );
};
