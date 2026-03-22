export interface PendingBook {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  cover_image: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface PendingBooksResponse {
  status: number;
  message: string;
  data: PendingBook[];
  timestamp: string;
  path: string;
}

export interface BookActionResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}
