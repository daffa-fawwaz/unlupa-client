import { api } from "@/lib/axios"
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "../types/auth.types"

export const authService = {
  register(payload: RegisterPayload) {
    return api.post<RegisterResponse>(
      "/auth/register",
      payload
    )
  },

  login(payload: LoginPayload) {
    return api.post<LoginResponse>(
      "/auth/login",
      payload
    )
  }
}   