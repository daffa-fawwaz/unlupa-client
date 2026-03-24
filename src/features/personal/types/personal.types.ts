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

export interface BookItem {
  id: string;
  book_id: string;
  title: string;
  content: string;
  answer: string;
  order: number;
  estimated_review_seconds: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  items: BookItem[] | null;
  children: Module[];
}

export interface BookTree {
  book_id: string;
  title: string;
  items: BookItem[];
  modules: Module[];
}

export interface GetBookTreeResponse {
  status: number;
  message: string;
  data: BookTree;
  timestamp: string;
  path: string;
}

export interface CreateModulePayload {
  title: string;
  description: string;
  order: number;
  parent_id: string | null;
}

export interface CreatedModule {
  id: string;
  book_id: string;
  title: string;
  description: string;
  order: number;
  created_at: string;
}

export interface CreateModuleResponse {
  status: number;
  message: string;
  data: CreatedModule;
  timestamp: string;
  path: string;
}

export interface UpdateModulePayload {
  title: string;
  description: string;
  order: number;
}

export interface UpdatedModule {
  id: string;
  book_id: string;
  title: string;
  description: string;
  order: number;
  created_at: string;
}

export interface UpdateModuleResponse {
  status: number;
  message: string;
  data: UpdatedModule;
  timestamp: string;
  path: string;
}

export interface DeleteModuleResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface CreateItemPayload {
  title: string;
  content: string;
  answer: string;
  order: number;
}

export interface CreatedItem {
  id: string;
  book_id: string;
  title: string;
  content: string;
  answer: string;
  order: number;
  estimated_review_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface CreateItemResponse {
  status: number;
  message: string;
  data: CreatedItem;
  timestamp: string;
  path: string;
}

export interface ItemDetail {
  item_id: string;
  source_type: string;
  status: string;
  content_ref: string;
  estimated_review_seconds: number;
  interval_days: number;
  interval_next_review_at: string;
  next_review_at: string;
  stability: number;
  difficulty: number;
  review_count: number;
  book_title: string;
  book_item_title: string;
  question: string;
  answer: string;
}

export interface GetItemDetailResponse {
  status: number;
  message: string;
  data: ItemDetail;
  timestamp: string;
  path: string;
}

export interface CreateModuleItemPayload {
  book_id: string;
  title: string;
  content: string;
  answer: string;
  order: number;
  estimate_value: number;
  estimate_unit: string;
}

export interface CreatedModuleItem {
  id: string;
  book_id: string;
  module_id: string;
  title: string;
  content: string;
  answer: string;
  order: number;
  estimated_review_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface CreateModuleItemResponse {
  status: number;
  message: string;
  data: CreatedModuleItem;
  timestamp: string;
  path: string;
}
