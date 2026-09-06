import { useState } from "react";
import { AlertCircle, Moon, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import type {
  LoginFormProps,
  LoginPayload,
} from "@/features/auth/login/types/login.types";

interface ExtendedLoginFormProps extends LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const LoginForm = ({
  onSubmit,
  error,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: ExtendedLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: LoginPayload = {
      email,
      password,
    };

    onSubmit(payload);
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-10 shadow-sm relative overflow-hidden transition-all duration-500 mx-auto">
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

        {/* LOGIN FORM */}
        <div id="state-login" className="animate-fade-in text-left">
          <div className="text-center mb-10">
            <Moon className="w-8 h-8 text-primary mx-auto mb-4 opacity-80" />
            <h1 className="font-serif text-2xl text-foreground mb-3">
              Selamat Datang Kembali
            </h1>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Ruang belajar Anda tersimpan rapi. <br />
              <span className="text-muted-foreground italic">
                Segala pencapaian Anda terjaga utuh...
              </span>
            </p>
          </div>

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alamat@email.com"
                required
              />
            </div>

            <div className="mb-5 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-0">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <h4 className="text-destructive font-medium text-xs uppercase tracking-widest mb-1 font-mono">
                    Kendala Terdeteksi
                  </h4>
                  <p className="text-destructive/90 text-xs leading-relaxed font-light">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="w-full mt-2"
            >
              {loading ? "Loading..." : "Masuk ke Ruang Belajar"}
            </Button>

            <div className="flex justify-between items-center mt-6 px-1">
              <Link
                to="/forgot-password"
                className="text-[0.75rem] text-muted-foreground hover:text-primary transition-colors no-underline"
              >
                Lupa kata sandi?
              </Link>
              <Link
                to="/register"
                className="text-[0.75rem] text-muted-foreground hover:text-primary transition-colors no-underline"
              >
                Belum punya akun? Daftar
              </Link>
            </div>
          </form>

          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground font-light italic">
              "Masuklah dengan tenang. Ruang belajar Anda selalu terbuka untuk
              Anda."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
