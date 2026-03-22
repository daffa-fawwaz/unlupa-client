import { useState } from "react";
import { personalService } from "../services/personal.services";
import type { CreatedModule, CreateModulePayload } from "../types/personal.types";

export const useCreateModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdModule, setCreatedModule] = useState<CreatedModule | null>(null);

  const createModule = async (
    bookId: string,
    payload: CreateModulePayload,
  ): Promise<CreatedModule> => {
    setLoading(true);
    setError(null);
    try {
      const response = await personalService.createModule(bookId, payload);
      setCreatedModule(response.data);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err.message ?? "Gagal membuat modul.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createModule, loading, error, createdModule };
};
