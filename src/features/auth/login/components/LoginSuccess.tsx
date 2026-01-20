import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export const LoginSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-[#0f141e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden transition-all duration-500 mx-auto">
        <div
          id="state-success"
          className="state-view text-center py-4 relative z-10"
        >
          {/* Top Glow - Emerald */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-emerald-500/50 to-transparent -mt-10"></div>

          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>

          <h1 className="font-serif text-3xl text-white mb-6">
            Selamat Datang Kembali
          </h1>

          <div className="space-y-6 mb-10">
            <p className="text-gray-300 font-light text-base leading-relaxed">
              Kunci diterima. <br />
              Ruang belajar Anda telah dibuka kembali. Silakan lanjutkan
              perjalanan ilmu Anda.
            </p>

            <div className="bg-white/5 border-l-2 border-amber-500/50 p-4 text-left rounded-r-lg">
              <p className="text-amber-100/80 text-sm italic font-serif">
                "Konsistensi adalah kunci. Sedikit demi sedikit, lama-lama
                menjadi bukit ilmu yang kokoh."
              </p>
            </div>
          </div>

          <button
            className="btn-submit w-full justify-center"
            onClick={() => navigate("/dashboard")}
          >
            Masuk ke Dashboard
          </button>

          <p className="text-center mt-4 text-[10px] text-gray-500">
            Semoga hari ini penuh dengan keberkahan ilmu.
          </p>
        </div>
      </div>
    </div>
  );
};
