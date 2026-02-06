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

export interface UserListResponse {
  status: number;
  message: string;
  data: User[];
  timestamp: string;
  path: string;
}

export interface UserActionResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}
