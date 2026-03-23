import { useState } from "react";
import { personalService } from "../services/personal.services";

export const useDeleteModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteModule = async (moduleId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await personalService.deleteModule(moduleId);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal menghapus modul.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { deleteModule, loading, error };
};
