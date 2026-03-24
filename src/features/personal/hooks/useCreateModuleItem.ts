import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedModuleItem, CreateModuleItemPayload } from "../types/personal.types";

export const useCreateModuleItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdItem, setCreatedItem] = useState<CreatedModuleItem | null>(null);

  const createModuleItem = async (
    moduleId: string,
    payload: CreateModuleItemPayload,
  ): Promise<CreatedModuleItem> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.createModuleItem(moduleId, payload);
      setCreatedItem(response.data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal menambahkan item ke modul.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createModuleItem, loading, error, createdItem };
};
