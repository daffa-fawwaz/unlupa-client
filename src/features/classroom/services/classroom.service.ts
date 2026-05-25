import type { ClassItem } from "../types";
import { api } from "@/services/api";

export const classroomService = {
  // GET my Classes (for teacher)
  getMyClassesTeacher: async (): Promise<ClassItem[]> => {
    const response = await api.get(`/api/v1/classes`);
    return response.data.data;
  },
};
