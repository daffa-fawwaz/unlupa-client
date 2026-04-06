import { api } from "@/services/api";
import type {
  PendingBooksResponse,
  BookActionResponse,
  AdminBookDetailResponse,
} from "@/features/dashboard/admin/types/pendingBook.types";

export const pendingBookService = {
  getPendingBooks: async (): Promise<PendingBooksResponse> => {
    const response = await api.get("/api/v1/admin/books/pending");
    return response.data;
  },
  getBookDetail: async (id: string): Promise<AdminBookDetailResponse> => {
    const response = await api.get(`/api/v1/admin/books/${id}`);
    return response.data;
  },
};

export const bookActionService = {
  approveBook: async (id: string): Promise<BookActionResponse> => {
    const response = await api.post(`/api/v1/admin/books/${id}/approve`);
    return response.data;
  },
  rejectBook: async (id: string): Promise<BookActionResponse> => {
    const response = await api.post(`/api/v1/admin/books/${id}/reject`);
    return response.data;
  },
};
