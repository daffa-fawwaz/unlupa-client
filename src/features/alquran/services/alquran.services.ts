import { api } from "@/lib/axios";
import type {
  ActivateFsrsResponse,
  CreateJuzItemPayload,
  CreateJuzItemResponse,
  CreateJuzResponse,
  DailyTasksResponse,
  DailyGenerateResponse,
  GetJuzResponse,
  MyItemsQuranResponse,
  ReviewIntervalPayload,
  ReviewIntervalResponse,
  ReviewFsrsPayload,
  ReviewFsrsResponse,
  StartIntervalPayload,
  StartIntervalResponse,
  ItemsByStatusResponse,
  RawItemByStatus,
  JuzToggleActiveResponse,
  UpdateItemPayload,
  UpdateItemResponse,
  DeleteItemResponse,
  EditIntervalDaysPayload,
  EditIntervalDaysResponse,
} from "@/features/alquran/types/quran.types";

export interface UserProgressResponse {
  status: number;
  message: string;
  data: {
    completed_juz: number[];
  };
  timestamp: string;
  path: string;
}

export interface SaveUserProgressPayload {
  completed_juz: number[];
}

export interface SaveUserProgressResponse {
  status: number;
  message: string;
  data: {
    completed_juz: number[];
  };
  timestamp: string;
  path: string;
}

export const alquranService = {
  async createJuz(juzIndex: number): Promise<CreateJuzResponse> {
    const response = await api.post(`/api/v1/juz/${juzIndex}`);
    return response.data;
  },

  async getJuz(): Promise<GetJuzResponse> {
    const response = await api.get("/api/v1/juz");
    return response.data;
  },

  async createJuzItem(
    juzId: string,
    data: CreateJuzItemPayload,
  ): Promise<CreateJuzItemResponse> {
    const response = await api.post(`/api/v1/juz/${juzId}/items`, data);
    return response.data;
  },

  async getMyItems(
    type: "quran" | "book" = "quran",
  ): Promise<MyItemsQuranResponse> {
    const response = await api.get(`/api/v1/my-items?type=${type}`);
    return response.data;
  },

  async generateDaily(): Promise<DailyGenerateResponse> {
    const response = await api.post("/api/v1/daily/generate");
    return response.data;
  },

  async getDaily(): Promise<DailyTasksResponse> {
    const response = await api.get("/api/v1/daily");
    return response.data;
  },

  async reviewInterval(
    itemId: string,
    payload: ReviewIntervalPayload,
  ): Promise<ReviewIntervalResponse> {
    const response = await api.post(
      `/api/v1/items/${itemId}/review-interval`,
      payload,
    );
    return response.data;
  },

  // INTERVAL

  async startInterval(
    itemId: string,
    payload: StartIntervalPayload,
  ): Promise<StartIntervalResponse> {
    const response = await api.post(
      `/api/v1/items/${itemId}/start-interval`,
      payload,
    );
    return response.data;
  },

  async activateFsrs(itemId: string): Promise<ActivateFsrsResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/activate-fsrs`);
    return response.data;
  },

  async reviewFsrs(
    itemId: string,
    payload: ReviewFsrsPayload,
  ): Promise<ReviewFsrsResponse> {
    const response = await api.post(`/api/v1/items/${itemId}/review`, payload);
    return response.data;
  },

  async getItemsByStatus(status: string): Promise<ItemsByStatusResponse> {
    const response = await api.get(`/api/v1/items?status=${status}`);
    const raw = response.data;

    return {
      ...raw,
      data: raw.data.map((item: RawItemByStatus) => ({
        item_id: item.ID,
        content_ref: item.ContentRef,
        status: item.Status,
        review_count: item.ReviewCount,
        created_at: item.CreatedAt,
        next_review_at: item.NextReviewAt ?? undefined,
        last_review_at: item.LastReviewAt ?? undefined,
        interval_next_review_at: item.IntervalNextReviewAt ?? undefined,
        interval_days: item.IntervalDays,
        stability: item.Stability,
        difficulty: item.Difficulty,
        estimatedReviewSeconds: item.EstimatedReviewSeconds ?? 0,
      })),
    };
  },

  async activateJuz(juzIndex: number): Promise<JuzToggleActiveResponse> {
    const response = await api.post(`/api/v1/juz/${juzIndex}/activate`);
    return response.data;
  },

  async deactivateJuz(juzIndex: number): Promise<JuzToggleActiveResponse> {
    const response = await api.post(`/api/v1/juz/${juzIndex}/deactivate`);
    return response.data;
  },

  // User Progress (Completed Juz per User)
  async getUserProgress(): Promise<UserProgressResponse> {
    const response = await api.get("/api/v1/user/progress");
    return response.data;
  },

  async saveUserProgress(
    payload: SaveUserProgressPayload,
  ): Promise<SaveUserProgressResponse> {
    const response = await api.post("/api/v1/user/progress", payload);
    return response.data;
  },

  // Item Management
  async updateItem(
    itemId: string,
    payload: UpdateItemPayload,
  ): Promise<UpdateItemResponse> {
    const response = await api.put(`/api/v1/juz/items/${itemId}`, payload);
    return response.data;
  },

  async deleteItem(itemId: string): Promise<DeleteItemResponse> {
    const response = await api.delete(`/api/v1/juz/items/${itemId}`);
    return response.data;
  },

  async editIntervalDays(
    itemId: string,
    payload: EditIntervalDaysPayload,
  ): Promise<EditIntervalDaysResponse> {
    const response = await api.put(
      `/api/v1/items/${itemId}/interval-days`,
      payload,
    );
    return response.data;
  },
};
