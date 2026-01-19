import { api } from "@/lib/axios";
import type {
  RegisterPayload,
  RegisterResponse,
} from "@/features/auth/register/types/register.types";

export const registerService = {
  register(payload: RegisterPayload) {
    return api.post<RegisterResponse>("/api/v1/auth/register", payload);
  },
};
