import { useState } from "react";
import { AxiosError } from "axios";
import type {
  RegisterPayload,
  RegisterView,
} from "@/features/auth/register/types/register.types";
import { registerService } from "@/features/auth/register/services/register.service";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<RegisterView>("form");
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setView("loading");
    setError(null);

    try {
      await registerService.register(payload);
      setView("success");
    } catch (err) {
      console.log("ERROR FULL:", err as Error);

      const message =
        (err as AxiosError<{ message: string }>).response?.data?.message ||
        "Terjadi kesalahan";

      setError(message);
      setLoading(false);
      setView("form");
    }
  };

  return { register, loading, error, view };
};
