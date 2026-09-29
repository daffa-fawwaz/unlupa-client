import { create } from "zustand";
import type { LoginUser } from "@/features/auth/domain/user.types";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import { queryClient } from "@/lib/queryClient";

const AUTH_STORAGE_KEY = "unlupa-auth";
const REMEMBER_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
let shouldRememberSession = true;

const authStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name) ?? window.sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;

    if (shouldRememberSession) {
      window.localStorage.setItem(name, value);
      window.sessionStorage.removeItem(name);
    } else {
      window.sessionStorage.setItem(name, value);
      window.localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
    window.sessionStorage.removeItem(name);
  },
};

interface AuthState {
  user: LoginUser | null;
  token: string | null;
  isAuthenticated: boolean;
  rememberExpiresAt: number | null;
  setAuth: (user: LoginUser, token: string, remember?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      rememberExpiresAt: null,

      setAuth: (user: LoginUser, token: string, remember = true) => {
        shouldRememberSession = remember;
        try {
          queryClient.clear();
        } catch { /* ignore */ }
        set({
          user,
          token,
          isAuthenticated: true,
          rememberExpiresAt: remember ? Date.now() + REMEMBER_DURATION_MS : null,
        });
      },

      logout: () => {
        try {
          queryClient.clear();
        } catch { /* ignore */ }
        authStorage.removeItem(AUTH_STORAGE_KEY);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          rememberExpiresAt: null,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        shouldRememberSession = Boolean(state.rememberExpiresAt);

        if (!state.rememberExpiresAt) return;

        if (Date.now() > state.rememberExpiresAt) {
          state.logout();
        }
      },
    },
  ),
);
