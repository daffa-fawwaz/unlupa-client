import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { RegisterLoading } from "@/features/auth/register/components/RegisterLoading";
import { RegisterSucces } from "@/features/auth/register/components/RegisterSucces";
import { useRegister } from "@/features/auth/register/hooks/useRegister";

export const RegisterPage = () => {
  const { register, error, view, loading } = useRegister();
  return (
    <>
      <div className="bg-background min-h-screen text-foreground relative">
        {view === "form" && (
          <RegisterForm onSubmit={register} error={error} loading={loading} />
        )}
        {view === "loading" && <RegisterLoading />}
        {view === "success" && <RegisterSucces />}
      </div>
    </>
  );
};
