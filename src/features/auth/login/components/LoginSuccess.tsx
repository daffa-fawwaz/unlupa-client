import { useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const REDIRECT_DELAY_MS = 1700;

export const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(
      () => navigate("/dashboard"),
      REDIRECT_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-10 relative overflow-hidden transition-all duration-500 mx-auto">
        <div
          id="state-success"
          className="state-view text-center py-4 relative z-10"
        >
          {/* Top Accent */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent -mt-10"></div>

          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-success" />
          </div>

          <h1 className="font-serif text-3xl text-foreground mb-6">
            Selamat Datang Kembali
          </h1>

          <div className="space-y-6 mb-10">
            <p className="text-muted-foreground font-light text-base leading-relaxed">
              Kunci diterima. <br />
              Ruang belajar Anda telah dibuka kembali. Silakan lanjutkan
              perjalanan ilmu Anda.
            </p>

            <div className="bg-muted border-l-2 border-primary/50 p-4 text-left rounded-r-lg">
              <p className="text-muted-foreground text-sm italic font-serif">
                "Konsistensi adalah kunci. Sedikit demi sedikit, lama-lama
                menjadi bukit ilmu yang kokoh."
              </p>
            </div>
          </div>

          <Button
            className="w-full justify-center"
            onClick={() => navigate("/dashboard")}
          >
            Masuk ke Dashboard
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground">
            <div className="w-3 h-3 border border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            <span className="animate-pulse">
              Mengalihkan Anda ke dashboard...
            </span>
          </div>

          <p className="text-center mt-4 text-[10px] text-muted-foreground">
            Semoga hari ini penuh dengan keberkahan ilmu.
          </p>
        </div>
      </div>
    </div>
  );
};
