import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export const RegisterSucces = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-10 shadow-sm relative overflow-hidden transition-all duration-500 mx-auto">
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
            Akun Anda Siap
          </h1>

          <div className="space-y-6 mb-10">
            <p className="text-muted-foreground font-light text-base leading-relaxed">
              Selamat datang. <br />
              Di sini, Anda tidak dituntut untuk belajar lebih cepat. Anda
              dibantu agar ilmu bertahan lebih lama.
            </p>

            <div className="bg-muted border-l-2 border-primary/50 p-4 text-left rounded-r-lg">
              <p className="text-muted-foreground text-sm italic font-serif">
                "Setiap orang memulai sebagai pembelajar. Peran lain akan
                terbuka jika dibutuhkan, dengan proses yang jelas dan
                terhormat."
              </p>
            </div>
          </div>

          <Button
            className="w-full justify-center"
            onClick={() => navigate("/login")}
          >
            Masuk ke Login Form
          </Button>

          <p className="text-center mt-4 text-[10px] text-muted-foreground">
            Anda bebas menjelajah tanpa kewajiban hari ini.
          </p>
        </div>
      </div>
    </div>
  );
};
