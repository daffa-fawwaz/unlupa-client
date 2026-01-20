import { api } from "@/lib/axios";
import type { LoginPayload, LoginResponse } from "../types/login.types";

export const loginService = {
  login: (payload: LoginPayload) => {
    return api.post<LoginResponse>(`/api/v1/auth/login`, payload);
  },
};
