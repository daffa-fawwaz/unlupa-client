import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { RegisterLoading } from "@/features/auth/register/components/RegisterLoading";
import { RegisterSucces } from "@/features/auth/register/components/RegisterSucces";
import { useState } from "react";
import type { RegisterView } from "@/features/auth/register/types/register.types";

export const RegisterPage = () => {
  const [view, setView] = useState<RegisterView>("form");

  return (
    <>
      <div className="bg-deep-universe min-h-screen text-white relative">
        {view === "form" && <RegisterForm />}
        {view === "loading" && <RegisterLoading />}
        {view === "success" && <RegisterSucces />}
      </div>
    </>
  );
};
