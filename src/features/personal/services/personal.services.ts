import { api } from "@/lib/axios";
import type {
  CreateBookPayload,
  CreateBookResponse,
  GetBooksResponse,
  GetBookDetailResponse,
  GetBookTreeResponse,
  CreateModulePayload,
  CreateModuleResponse,
  UpdateBookPayload,
  UpdateBookResponse,
  DeleteBookResponse,
  RequestPublishBookResponse,
  UpdateModulePayload,
  UpdateModuleResponse,
  DeleteModuleResponse,
  CreateItemPayload,
  CreateItemResponse,
  GetItemDetailResponse,
  CreateModuleItemPayload,
  CreateModuleItemResponse,
  UpdateItemPayload,
  UpdateItemResponse,
  DeleteItemResponse,
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

  async getBookById(id: string): Promise<GetBookDetailResponse> {
    const response = await api.get(`/api/v1/books/${id}`);
    return response.data;
  },

  async getBookTree(bookId: string): Promise<GetBookTreeResponse> {
    const response = await api.get(`/api/v1/books/${bookId}/tree`);
    return response.data;
  },

  async createModule(
    bookId: string,
    payload: CreateModulePayload,
  ): Promise<CreateModuleResponse> {
    const response = await api.post(`/api/v1/books/${bookId}/modules`, payload);
    return response.data;
  },

  async updateModule(
    moduleId: string,
    payload: UpdateModulePayload,
  ): Promise<UpdateModuleResponse> {
    const response = await api.put(`/api/v1/books/modules/${moduleId}`, payload);
    return response.data;
  },

  async deleteModule(moduleId: string): Promise<DeleteModuleResponse> {
    const response = await api.delete(`/api/v1/books/modules/${moduleId}`);
    return response.data;
  },

  async createItem(
    bookId: string,
    payload: CreateItemPayload,
  ): Promise<CreateItemResponse> {
    const response = await api.post(`/api/v1/books/${bookId}/items`, payload);
    return response.data;
  },

  async createModuleItem(
    moduleId: string,
    payload: CreateModuleItemPayload,
  ): Promise<CreateModuleItemResponse> {
    const response = await api.post(`/api/v1/books/modules/${moduleId}/items`, payload);
    return response.data;
  },

  async getItemDetail(itemId: string): Promise<GetItemDetailResponse> {
    const response = await api.get(`/api/v1/items/${itemId}`);
    return response.data;
  },

  async createBook(data: CreateBookPayload): Promise<CreateBookResponse> {
    const response = await api.post("/api/v1/books", data);
    return response.data;
  },

  async updateBook(
    id: string,
    data: UpdateBookPayload,
  ): Promise<UpdateBookResponse> {
    const response = await api.put(`/api/v1/books/${id}`, data);
    return response.data;
  },

  async deleteBook(id: string): Promise<DeleteBookResponse> {
    const response = await api.delete(`/api/v1/books/${id}`);
    return response.data;
  },

  async requestPublishBook(id: string): Promise<RequestPublishBookResponse> {
    const response = await api.post(`/api/v1/books/${id}/request-publish`);
    return response.data;
  },

  async updateItem(
    itemId: string,
    data: UpdateItemPayload,
  ): Promise<UpdateItemResponse> {
    const response = await api.put(`/api/v1/books/items/${itemId}`, data);
    return response.data;
  },

  async deleteItem(itemId: string): Promise<DeleteItemResponse> {
    const response = await api.delete(`/api/v1/books/items/${itemId}`);
    return response.data;
  },
};
