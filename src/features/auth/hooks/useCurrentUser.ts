import { useAuthStore } from "@/features/auth/stores/auth.store";

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  
  return {
    user,
    name: user?.name ?? "User",
    role: user?.role ?? "student",
    email: user?.email ?? "",
    isAuthenticated: !!user,
  };
};
