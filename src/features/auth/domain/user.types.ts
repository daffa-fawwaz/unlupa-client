export interface User {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

export interface LoginUser extends User {
  name: string;
}
