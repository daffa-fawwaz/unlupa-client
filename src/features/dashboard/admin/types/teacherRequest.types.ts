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
  created_at: string;
  id: string;
  message: string;
  user_id: string;
  updated_at: string;
  user: User;
  status: "pending" | "approved" | "rejected";
}

export interface TeacherRequestResponse {
  status: number;
  message: string;
  data: TeacherRequest[];
  timestamp: string;
  path: string;
}
