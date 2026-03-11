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
    } catch (error: any) {
      const message =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Terjadi kesalahan";

      setError(message);
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
