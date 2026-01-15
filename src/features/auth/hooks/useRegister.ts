import { useState } from "react";
import type { RegisterPayload } from "../types/auth.types";
import { authService } from "../services/auth.service";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(payload);
      return true;
    } catch (error) {
      setError(error as string);
      return false;
    } finally {
      setLoading(false);
    }

    return { register, loading, error };
  };
};
