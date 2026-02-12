import { api } from "@/lib/axios";
import type {
  CreateJuzResponse,
  GetJuzResponse,
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
};