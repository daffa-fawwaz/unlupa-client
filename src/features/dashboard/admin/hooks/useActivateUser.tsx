import { useState } from "react";
import { userService } from "@/features/dashboard/admin/services/user.service";

export const useActivateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.activateUser(userId);
    } catch (err) {
      setError("Failed to activate user");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { activateUser, loading, error };
};
