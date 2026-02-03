import { useState } from "react";
import type { TeacherRequestResponse } from "../types/teacherRequest.types";
import { teacherApproveService } from "../services/teacherRequest.service";

export const useApproveTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TeacherRequestResponse | null>(null);

  const approveTeacherRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherApproveService.approveTeacherRequest(id);
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
    approveTeacherRequest,
  };
};
