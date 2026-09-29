import { api } from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "@/features/auth/login/types/login.types";

export const loginService = {
  login: (payload: LoginPayload) => {
    const { rememberFor30Days, ...credentials } = payload;
    void rememberFor30Days;
    return api.post<LoginResponse>(`/api/v1/auth/login`, credentials);
  },
};
