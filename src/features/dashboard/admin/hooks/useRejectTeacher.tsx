import { useState } from "react";
import { teacherApproveService } from "@/features/dashboard/admin/services/teacherRequest.service";
import type { TeacherRequestResponse } from "@/features/dashboard/admin/types/teacherRequest.types";

export const useRejectTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TeacherRequestResponse | null>(null);

  const rejectTeacherRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherApproveService.rejectTeacherRequest(id);
      setData(response);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    rejectTeacherRequest,
  };
};
