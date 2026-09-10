import { useAuthStore } from "@/features/auth/stores/auth.store";
import { AdminDashboardPage } from "@/features/dashboard/admin/pages/AdminDashboardPage";
import { TeacherDashboardPage } from "@/features/dashboard/teacher/pages/TeacherDashboardPage";
import { StudentDashboardPage } from "@/features/dashboard/student/pages/StudentDashboardPage";
import { useDashboardModeStore } from "@/features/dashboard/stores/dashboard-mode.store";
import { Navigate } from "react-router";

const roleSubtitle: Record<string, string> = {
  student: "Lanjutkan perjalanan menghafal Anda hari ini.",
  teacher: "Pantau progres kelas dan bimbing setiap siswa dengan tenang.",
  admin: "Kelola pengguna, pengajar, dan publikasi buku Anda dari sini.",
};

const DashboardGreeting = ({ name, role }: { name: string; role: string }) => {
  const dateLabel = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-10">
      <p className="font-mono text-[0.7rem] uppercase tracking-widest text-primary/80">
        {dateLabel}
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-foreground leading-snug mt-2">
        Selamat Datang Kembali,{" "}
        <span className="text-primary">{name}</span>
      </h1>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mt-1.5">
        {roleSubtitle[role] ?? roleSubtitle.student}
      </p>
    </div>
  );
};

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
      <DashboardGreeting name={user?.name ?? "User"} role={finalRole} />
      {content}
    </div>
  );
};