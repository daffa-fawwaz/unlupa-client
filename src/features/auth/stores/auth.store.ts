import { create } from "zustand";
import type { LoginUser } from "@/features/auth/domain/user.types";
import { persist } from "zustand/middleware";

interface AuthState {
  user: LoginUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: LoginUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: LoginUser, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "unlupa-auth",
    },
  ),
);
