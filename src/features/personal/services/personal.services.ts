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
  StartItemPhaseResponse,
  StartIntervalPhaseResponse,
  ActivateFsrsPhaseResponse,
  BookDailyGenerateResponse,
  BookDailyTasksResponse,
  ReviewIntervalPayload,
  ReviewIntervalResponse,
  ReviewFsrsPayload,
  ReviewFsrsResponse,
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

  async startItemPhase(
    bookId: string,
    itemId: string,
  ): Promise<StartItemPhaseResponse> {
    const response = await api.post(`/api/v1/books/${bookId}/items/${itemId}/start`);
    return response.data;
  },

  async startIntervalPhase(
    _bookId: string,
    itemId: string,
    intervalDays: number,
  ): Promise<StartIntervalPhaseResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/start-interval`, {
      interval_days: intervalDays,
    });
    return response.data;
  },

  async activateFsrsPhase(
    _bookId: string,
    itemId: string,
  ): Promise<ActivateFsrsPhaseResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/activate-fsrs`);
    return response.data;
  },

  async deactivateItem(itemId: string): Promise<ActivateFsrsPhaseResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/deactivate`);
    return response.data;
  },

  async reactivateItem(itemId: string): Promise<ActivateFsrsPhaseResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/reactivate`);
    return response.data;
  },

  // Daily Review (Books) API methods
  async generateDailyBooks(): Promise<BookDailyGenerateResponse> {
    const response = await api.post("/api/v1/daily/generate");
    return response.data;
  },

  async getDailyBooks(): Promise<BookDailyTasksResponse> {
    const response = await api.get("/api/v1/daily");
    return response.data;
  },

  async reviewIntervalBook(
    itemId: string,
    payload: ReviewIntervalPayload,
  ): Promise<ReviewIntervalResponse> {
    const response = await api.post(
      `/api/v1/items/${itemId}/review-interval`,
      payload,
    );
    return response.data;
  },

  async reviewFsrsBook(
    itemId: string,
    payload: ReviewFsrsPayload,
  ): Promise<ReviewFsrsResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/review`, payload);
    return response.data;
  },
};
