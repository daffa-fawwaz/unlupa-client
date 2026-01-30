import { api } from "@/services/api";
import type { TeacherRequestResponse } from "../types/teacherRequest.types";

export const teacherRequestService = {
  getTeacherRequests: async (): Promise<TeacherRequestResponse> => {
    const response = await api.get("/api/v1/admin/teacher-requests");
    return response.data;
  },
};
