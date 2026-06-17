import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { studentDashboardService } from "../services/studentDashboard.service";
import type { TeacherRequestPayload } from "../types";

export const useTeacherRequest = () => {
  const queryClient = useQueryClient();

  const sendTeacherRequest = useMutation({
    mutationFn: (payload: TeacherRequestPayload) =>
      studentDashboardService.sendTeacherRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-joined-classes"] });
    },
  });

  return {
    sendTeacherRequest,
  };
};
