import { Moon } from "lucide-react";
import { Link } from "react-router";
import type {
  LoginFormProps,
  LoginPayload,
} from "@/features/auth/login/types/login.types";

export const LoginForm = ({ onSubmit, error, loading }: LoginFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload: LoginPayload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    onSubmit(payload);
  };
  return (
    <div className="w-full flex items-center justify-center p-6">
      {/* GLASS CONTAINER */}
      <div className="w-full max-w-md bg-[#0f141e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 mx-auto">
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent"></div>

        {/* LOGIN FORM */}
        <div id="state-login" className="animate-fade-in text-left">
          <div className="text-center mb-10">
            <Moon className="w-8 h-8 text-amber-500 mx-auto mb-4 opacity-80" />
            <h1 className="font-serif text-2xl text-white mb-3">
              Selamat Datang Kembali
            </h1>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Ruang belajar Anda tersimpan rapi. <br />
              <span className="text-amber-100/60 italic">
                Segala pencapaian Anda terjaga utuh...
              </span>
            </p>
          </div>

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-500 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/40 focus:bg-amber-500/2 transition-all placeholder:text-white/15"
                placeholder="alamat@email.com"
                required
              />
            </div>

            <div className="mb-5 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-gray-500 mb-0">
                  Kata Sandi
                </label>
              </div>
              <input
                name="password"
                type="password"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sans text-[0.95rem] focus:outline-none focus:border-amber-500/40 focus:bg-amber-500/2 transition-all placeholder:text-white/15"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="w-1/2 bg-[#0f141e]/60 backdrop-blur-xl border border-white/10 rounded-xl py-4 mb-4 shadow-2xl flex justify-center items-center mx-auto">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-linear-to-br from-amber-400 to-amber-700 rounded-xl text-black font-mono font-bold uppercase tracking-wider text-[0.85rem] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] transition-all mt-2 cursor-pointer border-none"
            >
              {loading ? "Loading..." : "Masuk ke Ruang Belajar"}
            </button>

            <div className="flex justify-between items-center mt-6 px-1">
              <Link
                to="/forgot-password"
                className="text-[0.75rem] text-zinc-400 hover:text-amber-400 transition-colors no-underline"
              >
                Lupa kata sandi?
              </Link>
              <Link
                to="/register"
                className="text-[0.75rem] text-zinc-400 hover:text-amber-400 transition-colors no-underline"
              >
                Belum punya akun? Daftar
              </Link>
            </div>
          </form>

          <div className="mt-12 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-light italic">
              "Masuklah dengan tenang. Ruang belajar Anda selalu terbuka untuk
              Anda."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
