import { api } from "@/lib/axios";
import type {
  CreateJuzItemPayload,
  CreateJuzItemResponse,
  CreateJuzResponse,
  DailyTasksResponse,
  DailyGenerateResponse,
  GetJuzResponse,
  MyItemsQuranResponse,
  ReviewIntervalPayload,
  ReviewIntervalResponse,
  StartIntervalPayload,
  StartIntervalResponse,
} from "@/features/alquran/types/quran.types";

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
};
