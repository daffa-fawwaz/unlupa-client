import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { LoginLoading } from "@/features/auth/login/components/LoginLoading";
import { LoginSuccess } from "@/features/auth/login/components/LoginSuccess";
import { useLogin } from "@/features/auth/login/hooks/useLogin";

export const LoginPage = () => {
  const { login, error, loading, view } = useLogin();
  return (
    <>
      <div className="bg-deep-universe min-h-screen text-white relative">
        {view === "form" && (
          <LoginForm onSubmit={login} error={error} loading={loading} />
        )}
        {view === "loading" && <LoginLoading />}
        {view === "success" && <LoginSuccess />}
      </div>
    </>
  );
};
