import type { LoginUser } from "@/features/auth/domain/user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: LoginUser;
}

export interface LoginSuccessResponse {
  
}
  
export interface LoginFormProps {
  onSubmit: (payload: LoginPayload) => void;
  error?: string | null;
  loading?: boolean;
}

export type LoginView = "form" | "loading" | "success";
