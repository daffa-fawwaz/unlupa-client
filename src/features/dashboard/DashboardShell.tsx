import { useAuthStore } from "@/features/auth/stores/auth.store";
import { AdminDashboardPage } from "@/features/dashboard/admin/pages/AdminDashboardPage";
import { TeacherDashboardPage } from "@/features/dashboard/teacher/pages/TeacherDashboardPage";
import { StudentDashboardPage } from "@/features/dashboard/student/pages/StudentDashboardPage";
import { useDashboardModeStore } from "@/features/dashboard/stores/dashboard-mode.store";
import { Navigate } from "react-router";

export const DashboardShell = () => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;
  const activeRole = useDashboardModeStore((state) => state.activeRole);

  if (!userRole) return <Navigate to="/login" replace />;

  let finalRole = activeRole;

  if (userRole === "student") {
    finalRole = "student";
  }

  if (userRole === "teacher" && activeRole === "admin") {
    finalRole = "teacher";
  }

  const content =
    finalRole === "admin" ? (
      <AdminDashboardPage />
    ) : finalRole === "teacher" ? (
      <TeacherDashboardPage />
    ) : (
      <StudentDashboardPage />
    );

  return (
    <div className="min-h-screen bg-background">
      {content}
    </div>
  );
};