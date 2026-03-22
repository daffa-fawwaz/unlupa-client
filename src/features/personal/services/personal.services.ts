import { api } from "@/lib/axios";
import type {
  CreateBookPayload,
  CreateBookResponse,
  GetBooksResponse,
  UpdateBookPayload,
  UpdateBookResponse,
  DeleteBookResponse,
} from "../types/personal.types";

export const personalService = {
  async getBooks(): Promise<GetBooksResponse> {
    const response = await api.get("/api/v1/books");
    return response.data;
  },

  async getPublishedBooks(): Promise<GetBooksResponse> {
    const response = await api.get("/api/v1/books/published");
    return response.data;
  },

  async createBook(data: CreateBookPayload): Promise<CreateBookResponse> {
    const response = await api.post("/api/v1/books", data);
    return response.data;
  },

  async updateBook(id: string, data: UpdateBookPayload): Promise<UpdateBookResponse> {
    const response = await api.put(`/api/v1/books/${id}`, data);
    return response.data;
  },

  async deleteBook(id: string): Promise<DeleteBookResponse> {
    const response = await api.delete(`/api/v1/books/${id}`);
    return response.data;
  },
};
