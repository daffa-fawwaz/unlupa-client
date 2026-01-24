import { useState } from "react";
import type {
  LoginPayload,
  LoginView,
} from "@/features/auth/login/types/login.types";
import { loginService } from "@/features/auth/login/services/login.services";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<LoginView>("form");
  const [error, setError] = useState<string | null>(null);

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
      return setView("success");
    } catch (error: any) {
      const message =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Terjadi kesalahan";

      setError(message);
      setLoading(false);
      setView("form");
      return false;
    }
  };

  return {
    loading,
    view,
    error,
    login,
  };
};
