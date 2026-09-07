import { Shield, AlertCircle } from "lucide-react";
import type { RegisterPayload } from "@/features/auth/register/types/register.types";
import type { RegisterFormProps } from "@/features/auth/register/types/register.types";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

export const RegisterForm = ({
  onSubmit,
  error,
  loading,
}: RegisterFormProps) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload: RegisterPayload = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const confirmPassword = formData.get("confirmPassword") as string;

    if (payload.password !== confirmPassword) {
      setLocalError("Password tidak sesuai");
      return;
    }

    onSubmit(payload);
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-10 relative overflow-hidden transition-all duration-500 mx-auto">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

        {/* Registration Form */}
        <div id="state-register" className="animate-fade-in">
          <div className="text-center mb-10">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4 opacity-80" />
            <h1 className="font-serif text-3xl text-foreground mb-3">
              Mulai Menjaga Ilmu
            </h1>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Buat akun untuk menyimpan, menjaga, dan menguatkan ilmu Anda —{" "}
              <span className="text-muted-foreground italic">
                tanpa paksaan, tanpa target kaku.
              </span>
            </p>
          </div>

          <form id="registrationForm" onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2">
                Nama Lengkap
              </label>
              <Input
                name="full_name"
                type="text"
                placeholder="Nama Panggilan Anda"
                required
              />
            </div>

            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="alamat@email.com"
                required
              />
            </div>

            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2">
                Kata Sandi
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-5 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2">
                Konfirmasi Kata Sandi
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {(error || localError) && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <h4 className="text-destructive font-medium text-xs uppercase tracking-widest mb-1 font-mono">
                    Kendala Terdeteksi
                  </h4>
                  <p className="text-destructive/90 text-xs leading-relaxed font-light">
                    {error || localError}
                  </p>
                </div>
              </div>
            )}

            <div className="mb-8 text-center">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Dengan mendaftar, Anda setuju untuk belajar dengan jujur <br />{" "}
                dan menjaga adab dalam proses belajar.
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 hover:underline transition-colors ml-1"
                >
                  Terms & Values
                </a>
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Loading..." : "Daftarkan Akun"}
            </Button>

            <p className="text-center mt-4 text-[10px] text-muted-foreground">
              Anda bisa berhenti kapan saja.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
