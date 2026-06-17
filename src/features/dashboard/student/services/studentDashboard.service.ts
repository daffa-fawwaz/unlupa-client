import { api } from "@/services/api";
import type { TeacherRequestPayload, TeacherRequestResponse } from "../types";

export const studentDashboardService = {
  sendTeacherRequest: async (
    payload: TeacherRequestPayload,
  ): Promise<TeacherRequestResponse> => {
    const response = await api.post("/api/v1/user/teacher-request", payload);
    return response.data.data;
  },
};
