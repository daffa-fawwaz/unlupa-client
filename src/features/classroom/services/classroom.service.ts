import type { ClassItem, CreateClassPayload } from "../types";
import { api } from "@/services/api";

export const classroomService = {
  // GET my Classes (for teacher)
  getMyClassesTeacher: async (): Promise<ClassItem[]> => {
    const response = await api.get(`/api/v1/classes`);
    return response.data.data;
  },

  // CREATE CLASS (for teacher)
  createClass: async (payload: CreateClassPayload): Promise<ClassItem> => {
    const response = await api.post(`/api/v1/classes`, payload);
    return response.data.data;
  },
};
