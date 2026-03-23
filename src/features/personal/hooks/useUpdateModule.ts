import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { UpdatedModule, UpdateModulePayload } from "../types/personal.types";

export const useUpdateModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedModule, setUpdatedModule] = useState<UpdatedModule | null>(null);

  const updateModule = async (
    moduleId: string,
    payload: UpdateModulePayload,
  ): Promise<UpdatedModule> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.updateModule(moduleId, payload);
      setUpdatedModule(response.data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal memperbarui modul.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { updateModule, loading, error, updatedModule };
};
