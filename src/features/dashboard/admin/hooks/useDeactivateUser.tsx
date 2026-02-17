import { useState } from "react";
import { userService } from "@/features/dashboard/admin/services/user.service";

export const useDeactivateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivateUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deactivateUser(userId);
    } catch (err) {
      setError("Failed to deactivate user");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deactivateUser, loading, error };
};
