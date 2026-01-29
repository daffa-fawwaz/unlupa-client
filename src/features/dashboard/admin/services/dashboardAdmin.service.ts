import { api } from "@/services/api";
import type { TeacherRequestResponse } from "../types/teacherRequest.types";

export const dashboardAdminService = {
  getTeacherRequests: async (): Promise<TeacherRequestResponse> => {
    const response = await api.get("/admin/teacher-requests");
    return response.data;
  },

  approveTeacherRequest: async (id: string) => {
    const response = await api.put(`/admin/teacher-requests/${id}/approve`);
    return response.data;
  },

  rejectTeacherRequest: async (id: string) => {
    const response = await api.put(`/admin/teacher-requests/${id}/reject`);
    return response.data;
  },
};
