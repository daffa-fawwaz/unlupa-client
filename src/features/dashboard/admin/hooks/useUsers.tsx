import { useState } from "react";
import { userService } from "../services/user.service";
import type { User } from "../types/user.types";

export const useUsers = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers();
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getUsers };
};
