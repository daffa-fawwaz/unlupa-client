import { useState } from "react";
import type {
  LoginPayload,
  LoginView,
} from "@/features/auth/login/types/login.types";
import { loginService } from "@/features/auth/login/services/login.services";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDashboardModeStore } from "@/features/dashboard/stores/dashboard-mode.store";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<LoginView>("form");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setView("loading");
    setError(null);

    try {
      const response = await loginService.login(payload);

      const user = response.data.data;
      const token = response.data.data.token;
      setAuth(user, token);

      useDashboardModeStore.getState().setActiveRole(user.role)

      return setView("success");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const backendMessage = axiosError.response?.data?.message || "";
      const isCredentialError =
        status === 401 ||
        /password|email|kredensial|credential|invalid|salah|tidak terdaftar|belum terdaftar/i.test(
          backendMessage,
        );

      setError(
        isCredentialError
          ? "Kata sandi atau email yang Anda masukkan salah"
          : backendMessage || "Terjadi kesalahan",
      );
      setLoading(false);
      setView("form");
      // Keep email and password - don't clear them
      return false;
    }
  };

  return {
    loading,
    view,
    error,
    email,
    setEmail,
    password,
    setPassword,
    login,
  };
};
