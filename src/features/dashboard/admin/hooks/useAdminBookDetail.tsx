import { useState } from "react";
import { pendingBookService } from "@/features/dashboard/admin/services/pendingBook.service";
import type { AdminBookDetail } from "@/features/dashboard/admin/types/pendingBook.types";

export const useAdminBookDetail = () => {
  const [data, setData] = useState<AdminBookDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBookDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pendingBookService.getBookDetail(id);
      setData(response.data);
    } catch (err: any) {
      setError(err.message ?? "Gagal memuat detail buku.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getBookDetail };
};
