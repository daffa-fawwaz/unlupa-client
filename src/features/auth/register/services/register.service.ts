import { api } from "@/lib/axios";
import type {
  RegisterPayload,
  RegisterResponse,
} from "../types/register.types";

export const registerService = {
  register(payload: RegisterPayload) {
    return api.post<RegisterResponse>("/api/v1/auth/register", payload);
  },
};
