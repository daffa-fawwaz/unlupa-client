import { useAuthStore } from "@/features/auth/stores/auth.store";
import { AdminDashboardPage } from "./admin/pages/AdminDashboardPage";
import { TeacherDashboardPage } from "./teacher/pages/TeacherDashboardPage";
import { StudentDashboardPage } from "./student/pages/StudentDashboardPage";

export const DashboardShell = () => {
  const role = useAuthStore((state) => state.user?.role);

  if (role === "admin") return <AdminDashboardPage />;
  if (role === "teacher") return <TeacherDashboardPage />;
  if (role === "student") return <StudentDashboardPage />;

  return null;
};
