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

// Admin Book Detail types
export interface AdminBookItem {
  id: string;
  book_id: string;
  module_id?: string | null;
  title: string;
  content: string;
  answer: string;
  order: number;
  estimated_review_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface AdminBookModule {
  id: string;
  book_id: string;
  parent_id?: string | null;
  title: string;
  description: string;
  order: number;
  created_at: string;
  items?: AdminBookItem[] | null;
}

export interface AdminBookDetail {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  cover_image: string;
  status: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  modules?: AdminBookModule[] | null;
  items?: AdminBookItem[] | null;
}

export interface AdminBookDetailResponse {
  status: number;
  message: string;
  data: AdminBookDetail;
  timestamp: string;
  path: string;
}
