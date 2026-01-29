export interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  plan: string;
  plan_expired_at: string | null;
  subscription_status: string;
  last_payment_ref: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherRequest {
  id: string;
  user_id: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  user: User;
}

export interface TeacherRequestResponse {
  status: number;
  message: string;
  data: TeacherRequest[];
  timestamp: string;
  path: string;
}
