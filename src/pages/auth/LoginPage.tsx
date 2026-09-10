import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { LoginLoading } from "@/features/auth/login/components/LoginLoading";
import { LoginSuccess } from "@/features/auth/login/components/LoginSuccess";
import { useLogin } from "@/features/auth/login/hooks/useLogin";

export const LoginPage = () => {
  const { login, error, loading, view, email, setEmail, password, setPassword } = useLogin();
  return (
    <>
      <div className="bg-background min-h-screen text-foreground relative">
        {view === "form" && (
          <LoginForm
            onSubmit={login}
            error={error}
            loading={loading}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        )}
        {view === "loading" && <LoginLoading />}
        {view === "success" && <LoginSuccess />}
      </div>
    </>
  );
};
