export interface User {
  email: string;
  id: string;
  role: "student" | "teacher" | "admin";
}

export interface LoginUser extends User {
  name: string;
  token: string;
}
