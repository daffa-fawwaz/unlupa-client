import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { useLogin } from "@/features/auth/login/hooks/useLogin";

export const LoginPage = () => {
  const { login, error, loading, email, setEmail, password, setPassword } =
    useLogin();
  return (
    <>
      <div className="bg-background min-h-screen text-foreground relative">
        <LoginForm
          onSubmit={login}
          error={error}
          loading={loading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      </div>
    </>
  );
};
