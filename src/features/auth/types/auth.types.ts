// USER

export interface User {
  email: string;
  id: string;
  role: "student" | "teacher" | "admin";
}

// REGISTER

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: User;
}

// LOGIN

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: User & {
    name: string;
    token: string;
  };
}
