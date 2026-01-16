import { useState } from "react";
import type { RegisterPayload } from "@/features/auth/register/types/register.types";
import { RegisterService } from "@/features/auth/register/services/register.service";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);

    try {
      await RegisterService.register(payload);
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan, silakan coba lagi.";

      setError(message);
    } finally {
      setLoading(false);
    }

    return { register, loading, error };
  };
} ;
