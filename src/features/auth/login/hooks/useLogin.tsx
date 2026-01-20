import { useState } from "react";
import type {
  LoginPayload,
  LoginView,
} from "@/features/auth/login/types/login.types";
import { loginService } from "@/features/auth/login/services/login.services";
import type { AxiosError } from "axios";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<LoginView>("form");
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setView("loading");
    setError(null);

    try {
      await loginService.login(payload);
      return setView("success");
    } catch (error: any) {
      const message =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Terjadi kesalahan";

      setError(message);
      setLoading(false);
      setView("form");
    }
  };

  return {
    loading,
    view,
    error,
    login,
  };
};
