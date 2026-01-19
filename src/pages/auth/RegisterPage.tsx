import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { RegisterLoading } from "@/features/auth/register/components/RegisterLoading";
import { RegisterSucces } from "@/features/auth/register/components/RegisterSucces";
import { useState } from "react";
import type {
  RegisterPayload,
  RegisterView,
} from "@/features/auth/register/types/register.types";
import { registerService } from "@/features/auth/register/services/register.service";

export const RegisterPage = () => {
  const [view, setView] = useState<RegisterView>("form");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (payload: RegisterPayload) => {
    setView("loading");
    setError(null);

    try {
      await registerService.register(payload);
      setView("success");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Terjadi kesalahan");
      setView("form");
    }
  };

  return (
    <>
      <div className="bg-deep-universe min-h-screen text-white relative">
        {view === "form" && (
          <RegisterForm onSubmit={handleRegister} error={error} />
        )}
        {view === "loading" && <RegisterLoading />}
        {view === "success" && <RegisterSucces />}
      </div>
    </>
  );
};
