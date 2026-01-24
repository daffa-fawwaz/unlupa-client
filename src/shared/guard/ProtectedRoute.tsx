import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/unauthorized" />;
  } else {
    return <Outlet />;
  }
};
