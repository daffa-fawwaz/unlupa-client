import { api } from "@/lib/axios";
import type { UserListResponse, UserActionResponse } from "../types/user.types";

export const userService = {
  // Get all users
  getUsers: async (): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>("/api/v1/admin/users");
    return response.data;
  },

  // Activate user
  activateUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await api.post<UserActionResponse>(
      `/api/v1/admin/users/${userId}/activate`,
    );
    return response.data;
  },

  // Deactivate user
  deactivateUser: async (userId: string): Promise<UserActionResponse> => {
    const response = await api.post<UserActionResponse>(
      `/api/v1/admin/users/${userId}/deactivate`,
    );
    return response.data;
  },
};
