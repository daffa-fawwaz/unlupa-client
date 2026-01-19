import { Shield } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import type { RegisterPayload } from "../types/register.types";
import type { RegisterFormProps } from "../types/register.types";

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const { loading } = useRegister();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload: RegisterPayload = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    onSubmit(payload);
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      {/* Glass Container */}
      <div className="w-full max-w-lg bg-[#0f141e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden transition-all duration-500 mx-auto">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-amber-500/50 to-transparent"></div>

        {/* Registration Form */}
        <div id="state-register" className="animate-fade-in">
          <div className="text-center mb-10">
            <Shield className="w-10 h-10 text-amber-500 mx-auto mb-4 opacity-80" />
            <h1 className="font-serif text-3xl text-white mb-3">
              Mulai Menjaga Ilmu
            </h1>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Buat akun untuk menyimpan, menjaga, dan menguatkan ilmu Anda —{" "}
              <span className="text-gray-500 italic">
                tanpa paksaan, tanpa target kaku.
              </span>
            </p>
          </div>

          <form id="registrationForm" onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-400 mb-2">
                Nama Lengkap
              </label>
              <input
                name="full_name"
                type="text"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all placeholder:text-white/20"
                placeholder="Nama Panggilan Anda"
                required
              />
            </div>

            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-400 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all placeholder:text-white/20"
                placeholder="alamat@email.com"
                required
              />
            </div>

            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-400 mb-2">
                Kata Sandi
              </label>
              <input
                name="password"
                type="password"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all placeholder:text-white/20"
                placeholder="••••••••"
                required
              />
            </div>

            {/* <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-400 mb-2">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all placeholder:text-white/20"
                placeholder="••••••••"
                required
              />
            </div> */}

            <div className="mb-8 text-center">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Dengan mendaftar, Anda setuju untuk belajar dengan jujur <br />{" "}
                dan menjaga adab dalam proses belajar.
                <a
                  href="#"
                  className="text-amber-400 hover:text-amber-300 hover:underline transition-colors ml-1"
                >
                  Terms & Values
                </a>
              </p>
            </div>

            {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-br from-amber-400 to-amber-600 rounded-xl text-black font-mono font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(245,158,11,0.4)] transition-all mt-2 cursor-pointer border-none"
            >
              {loading ? "Loading..." : "Daftarkan Akun"}
            </button>

            <p className="text-center mt-4 text-[10px] text-gray-600">
              Anda bisa berhenti kapan saja.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
