import { api } from "@/lib/axios";
import type {
  CreateJuzResponse,
  GetJuzResponse,
  MyItemsQuranResponse,
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

  async getMyItems(
    type: "quran" | "book" = "quran",
  ): Promise<MyItemsQuranResponse> {
    const response = await api.get(`/api/v1/my-items?type=${type}`);
    return response.data;
  },
};
