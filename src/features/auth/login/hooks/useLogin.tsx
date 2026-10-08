import { useState } from "react";
import { useNavigate } from "react-router";
import type { LoginPayload } from "@/features/auth/login/types/login.types";
import { loginService } from "@/features/auth/login/services/login.services";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useDashboardModeStore } from "@/features/dashboard/stores/dashboard-mode.store";
import { toast } from "sonner";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const login = async (payload: LoginPayload) => {
    if (loading) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await loginService.login(payload);

      const user = response.data.data;
      const token = response.data.data.token;
      setAuth(user, token, Boolean(payload.rememberFor30Days));

      useDashboardModeStore.getState().setActiveRole(user.role);

      setLoading(false);
      toast.success("Berhasil masuk", {
        description: `Selamat datang kembali, ${user.name}!`,
        duration: 4000,
      });
      navigate(user.role === "teacher" ? "/dashboard/kelas" : "/dashboard");

      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const status = axiosError.response?.status;
      const backendMessage = axiosError.response?.data?.message || "";
      const isCredentialError =
        status === 401 ||
        /password|email|kredensial|credential|invalid|salah|tidak terdaftar|belum terdaftar/i.test(
          backendMessage,
        );
      const isRateLimited = status === 429;
      const errorMessage = isCredentialError
        ? "Kata sandi atau email yang Anda masukkan salah"
        : isRateLimited
          ? "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi."
          : backendMessage ||
            (axiosError.request
              ? "Tidak dapat terhubung ke server. Periksa koneksi Anda."
              : "Terjadi kesalahan saat masuk.");

      setError(errorMessage);
      setLoading(false);
      if (isRateLimited) {
        toast.warning("Coba lagi nanti", {
          description: errorMessage,
          duration: 5000,
        });
      } else {
        toast.error(isCredentialError ? "Gagal masuk" : "Terjadi kendala", {
          description: errorMessage,
          duration: 5000,
        });
      }
      // Keep email and password - don't clear them
      return false;
    }
  };

  return {
    loading,
    error,
    email,
    setEmail,
    password,
    setPassword,
    login,
  };
};
