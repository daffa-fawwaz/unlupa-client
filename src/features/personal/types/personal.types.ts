export interface Book {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  cover_image: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetBooksResponse {
  status: number;
  message: string;
  data: Book[];
  timestamp: string;
  path: string;
}

export interface CreateBookPayload {
  title: string;
  description: string;
  cover_image: string;
}

export interface CreateBookResponse {
  status: number;
  message: string;
  data: Book;
  timestamp: string;
  path: string;
}

export interface UpdateBookPayload {
  title: string;
  description: string;
  cover_image: string;
}

export interface UpdateBookResponse {
  status: number;
  message: string;
  data: Book;
  timestamp: string;
  path: string;
}

export interface DeleteBookResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface RequestPublishBookResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface GetBookDetailResponse {
  status: number;
  message: string;
  data: Book;
  timestamp: string;
  path: string;
}
