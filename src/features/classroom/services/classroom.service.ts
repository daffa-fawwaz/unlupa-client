import type {
  ClassItem,
  CreateClassPayload,
  UpdateClassPayload,
} from "../types";
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

  // UPDATE CLASS (for teacher)
  updateClass: async (
    classId: string,
    payload: UpdateClassPayload,
  ): Promise<ClassItem[]> => {
    const response = await api.put(`/api/v1/classes/${classId}`, payload);
    return response.data.data;
  },
};
