export interface User {
  email: string;
  id: string;
  is_premium?: boolean;
  role: "student" | "teacher" | "admin";
}

export interface LoginUser extends User {
  name: string;
  token: string;
}
