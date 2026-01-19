import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { RegisterLoading } from "@/features/auth/register/components/RegisterLoading";
import { RegisterSucces } from "@/features/auth/register/components/RegisterSucces";
import { useRegister } from "@/features/auth/register/hooks/useRegister";

export const RegisterPage = () => {
  const { register, error, view, loading } = useRegister();
  return (
    <>
      <div className="bg-deep-universe min-h-screen text-white relative">
        {view === "form" && (
          <RegisterForm onSubmit={register} error={error} loading={loading} />
        )}
        {view === "loading" && <RegisterLoading />}
        {view === "success" && <RegisterSucces />}
      </div>
    </>
  );
};
