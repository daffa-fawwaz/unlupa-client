import type { User } from "@/features/auth/domain/user.types";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: User;
} 

export type RegisterView = "form" | "loading" | "success";