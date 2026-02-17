import { api } from "@/services/api";
import type { TeacherRequestResponse } from "@/features/dashboard/admin/types/teacherRequest.types";

export const teacherRequestService = {
  getTeacherRequests: async (): Promise<TeacherRequestResponse> => {
    const response = await api.get("/api/v1/admin/teacher-requests");
    return response.data;
  },
};

export const teacherApproveService = {
  approveTeacherRequest: async (
    id: string,
  ): Promise<TeacherRequestResponse> => {
    const response = await api.post(
      `/api/v1/admin/teacher-requests/${id}/approve`,
    );
    return response.data;
  },
  rejectTeacherRequest: async (id: string): Promise<TeacherRequestResponse> => {
    const response = await api.post(
      `/api/v1/admin/teacher-requests/${id}/reject`,
    );
    return response.data;
  },
};
