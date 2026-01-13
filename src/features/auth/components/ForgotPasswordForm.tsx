import { KeyRound, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const ForgotPasswordForm = () => {
  return (
    <div className="w-full flex items-center justify-center p-6">
      {/* GLASS CONTAINER */}
      <div className="w-full max-w-md bg-[#0f141e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 mx-auto">
        {/* TOP ACCENT LINE (Soft Amber) */}
        <div className="absolute top-0 left-0 w-full h-1px bg-linear-to-r from-transparent via-amber-500/30 to-transparent"></div>

        {/* FORM VIEW */}
        <div id="state-form" className="animate-fade-in">
          <div className="text-center mb-8">
            <KeyRound className="w-10 h-10 text-amber-500 mx-auto mb-4 opacity-80" />
            <h1 className="font-serif text-2xl text-white mb-3">
              Menemukan Akses Kembali
            </h1>

            <p className="text-white text-base font-medium mb-2">
              Tidak apa-apa lupa. <br />
              <span className="text-gray-400 font-light text-sm">
                Ruang belajar Anda tetap aman dan utuh.
              </span>
            </p>
            <p className="text-[11px] text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
              Kami hanya perlu alamat email Anda untuk mengirimkan jalur aman
              kembali ke ruang belajar.
            </p>
          </div>

          <form id="recoveryForm" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/40 focus:bg-amber-500/2 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all placeholder:text-white/15"
                placeholder="alamat@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-linear-to-br from-amber-400 to-amber-700 rounded-xl text-black font-mono font-bold uppercase tracking-wider text-[0.85rem] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] transition-all mt-2 cursor-pointer border-none"
            >
              Kirim Tautan Pemulihan
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-[10px] text-gray-600 mb-4 italic">
              Anda tidak perlu terburu-buru. Kami menunggu dengan tenang.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[0.8rem] text-gray-500 hover:text-amber-400 transition-colors no-underline"
            >
              <ArrowLeft className="w-3 h-3" /> Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
