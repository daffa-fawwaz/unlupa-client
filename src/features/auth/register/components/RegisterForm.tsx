import { AlertCircle } from "lucide-react";
import type { RegisterPayload } from "@/features/auth/register/types/register.types";
import type { RegisterFormProps } from "@/features/auth/register/types/register.types";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

// ====================================== Page Section ===================================== //

export const RegisterForm = ({
  onSubmit,
  error,
  loading,
}: RegisterFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    const payload: RegisterPayload = {
      full_name: fullName.trim(),
      email: email.trim(),
      password,
    };

    if (!payload.full_name || !payload.email || !payload.password) {
      setLocalError("Semua field wajib diisi");
      return;
    }

    if (payload.password !== confirmPassword) {
      setLocalError("Password tidak sesuai");
      return;
    }

    onSubmit(payload);
  };

  return (
    <div className="grid min-h-screen bg-primary text-primary lg:grid-cols-2">
      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-12">

        <div className="flex flex-1 items-center justify-center py-12">
          <div
            id="state-login"
            className="w-full max-w-90 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex size-10 items-center justify-center rounded-xl border border-secondary bg-primary shadow-xs">
                <img
                  src="/unlupa.logo.png"
                  alt=""
                  className="size-6 object-contain"
                />
              </div>
              <h1 className="text-display-xs font-semibold tracking-tight text-primary">
                Selamat Datang!
              </h1>
              <p className="mt-3 text-md text-secondary">
                Mari mulai catat perjalanan mu!
              </p>
            </div>

            <form id="loginForm" onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nama Lengkap"
                type="text"
                value={fullName}
                onChange={setFullName}
                placeholder="Masukkan nama lengkap"
                isRequired
                size="md"
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Masukkan Email"
                isRequired
                size="md"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                isRequired
                size="md"
              />

              <Input
                label="Konfirmasi Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
                isRequired
                size="md"
              />

              {(error || localError) && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-error_subtle bg-error-primary p-4"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-error-primary" />
                  <div className="flex-1 text-left">
                    <h4 className="mb-1 text-sm font-semibold text-error-primary">
                      Kendala Terdeteksi
                    </h4>
                    <p className="text-sm leading-relaxed text-error-primary">
                      {localError || error}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                {/* <Checkbox
                  isSelected={rememberMe}
                  onChange={setRememberMe}
                  label="Remember for 30 days"
                  size="sm"
                /> */}
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-brand-secondary transition-colors hover:text-brand-secondary_hover"
                >
                  Forgot password
                </Link>
              </div>

              <Button
                isDisabled={loading}
                isLoading={loading}
                type="submit"
                size="lg"
                className="w-full"
              >
                Daftar
              </Button>

              <Button
                type="button"
                color="secondary"
                size="lg"
                className="w-full"
              >
                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285f4] shadow-xs">
                  G
                </span>
                Sign in with Google
              </Button>

              <p className="pt-2 text-center text-sm text-secondary">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-brand-secondary transition-colors hover:text-brand-secondary_hover"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>

        <p className="text-sm text-secondary">© Unlupa 2025</p>
      </section>

      <aside className="hidden min-h-screen p-3 lg:block">
        <div className="relative size-full overflow-hidden rounded-[2rem] border border-secondary bg-secondary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_17%,rgba(127,86,217,0.75),transparent_21%),radial-gradient(circle_at_28%_77%,rgba(127,86,217,0.78),transparent_24%),radial-gradient(circle_at_60%_67%,rgba(14,165,233,0.45),transparent_20%),linear-gradient(135deg,#f7f7fb_0%,#d7d8df_42%,#f4f4f8_100%)]" />
          <div className="absolute -left-28 top-8 h-72 w-[140%] rotate-[-28deg] rounded-full border-[18px] border-white/75 bg-white/10" />
          <div className="absolute -right-40 bottom-24 h-72 w-72 rounded-full border-[18px] border-white/70 bg-white/10" />
          <div className="absolute -bottom-24 left-6 h-64 w-[78%] rotate-[-18deg] rounded-full border-[16px] border-white/70 bg-white/10" />
          <div className="absolute inset-0 bg-linear-to-br from-white/45 via-transparent to-black/5" />
        </div>
      </aside>
    </div>
  );
};
