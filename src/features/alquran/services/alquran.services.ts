import { api } from "@/lib/axios";
import type { CreateJuzResponse } from "@/features/alquran/types/quran.types";

export const alquranService = {
  createJuz(juzIndex: number): Promise<CreateJuzResponse> {
    return api.post(`/api/v1/juz/${juzIndex}`);
  },
};
