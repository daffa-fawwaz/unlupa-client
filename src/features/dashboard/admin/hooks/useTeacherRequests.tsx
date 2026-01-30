import { useState } from "react";
import { teacherRequestService } from "../services/teacherRequest.service";
import type { TeacherRequest } from "../types/teacherRequest.types";

export const useTeacherRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TeacherRequest[] | null>(null);

  const getTeacherRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teacherRequestService.getTeacherRequests();
      setData(response.data);
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
    getTeacherRequests,
  };
};
