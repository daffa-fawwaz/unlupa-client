import { useEffect, useState } from "react";
import {
  Users,
  Activity,
  Shield,
  BookMarked,
  ArrowRight,
  UserPlus,
  CheckCircle2,
  Teacher,
  PendingUser,
  QuickAccess,
} from "@/components/foundations/hugeicons";
import { Link } from "react-router";
import { StatCard } from "@/components/ui/StatCard";
import { useUsers } from "@/features/dashboard/admin/hooks/useUsers";
import { useTeacherRequests } from "@/features/dashboard/admin/hooks/useTeacherRequests";

export const AdminDashboardPage = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const { data: users, loading: usersLoading, getUsers } = useUsers();
  const {
    data: teacherRequests,
    loading: teacherLoading,
    getTeacherRequests,
  } = useTeacherRequests();

  useEffect(() => {
    void getUsers();
    void getTeacherRequests();
  }, [getUsers, getTeacherRequests]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const loading = usersLoading || teacherLoading;

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter((u) => u.is_active).length ?? 0;
  const teacherCount = users?.filter((u) => u.role === "teacher").length ?? 0;
  const studentCount = users?.filter((u) => u.role === "student").length ?? 0;
  const pendingTeacherRequests =
    teacherRequests?.filter((r) => r.status === "pending").length ?? 0;

  const recentStudentUsers = [...(users ?? [])]
    .filter((user) => user.role === "student")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 4);

  const formatRelativeTime = (dateString: string) => {
    const diffMs = currentTime.getTime() - new Date(dateString).getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (diffMinutes < 1) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes}m lalu`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}j lalu`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}h lalu`;
  };

  const statCards = [
    {
      title: "Total Pengguna",
      value: loading ? "..." : totalUsers.toLocaleString("id-ID"),
      change: "Live",
      desc: `Siswa & Pengajar (${studentCount} siswa, ${teacherCount} guru)`,
      icon: Users,
      color: "emerald",
    },
    {
      title: "Pengguna Aktif",
      value: loading ? "..." : activeUsers.toLocaleString("id-ID"),
      change: "Realtime",
      desc: "Akun yang sedang aktif",
      icon: Activity,
      color: "blue",
    },
    {
      title: "Guru Terdaftar",
      value: loading ? "..." : teacherCount.toString(),
      change: "Terdata",
      desc: "Akun dengan peran pengajar",
      icon: Teacher,
      color: "gold",
    },
    {
      title: "Permintaan Guru Pending",
      value: loading ? "..." : pendingTeacherRequests.toString(),
      change: "Butuh Review",
      desc: "Belum diproses",
      icon: PendingUser,
      color: "purple",
    },
  ];

  return (
    <div className="relative z-10 transition-all">
      {/* Stats Grid */}
      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            desc={stat.desc}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </section>

      {/* Bottom Section: Activity & Quick Actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-3xl border border-secondary bg-primary p-5 shadow-xs lg:col-span-2 md:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                Live Feed
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-primary">
                <Activity className="size-5 text-brand-700" />
                Aktivitas Terkini
              </h3>
            </div>
            <Link
              to="/dashboard/user-list"
              className="rounded-full border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary transition hover:border-brand/40 hover:bg-brand-50 hover:text-brand-700"
            >
              Lihat Semua
            </Link>
          </div>

          {recentStudentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentStudentUsers.map((user) => (
                <div
                  key={user.id}
                  className="group flex items-center gap-4 rounded-2xl border border-secondary bg-secondary/40 p-4 transition hover:border-brand/40 hover:bg-brand-50/60"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-sm font-bold text-white shadow-sm">
                    {user.full_name?.charAt(0).toUpperCase() || "S"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-primary">
                      Siswa baru terdaftar
                    </h4>
                    <p className="truncate text-xs text-secondary">
                      {user.full_name || user.email} bergabung sebagai pelajar
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-tertiary ring-1 ring-secondary">
                    {formatRelativeTime(user.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-secondary bg-secondary/30 p-8 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <UserPlus className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-primary">
                Belum ada aktivitas
              </h4>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-secondary">
                Aktivitas akan muncul saat ada user baru dengan role student.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col rounded-3xl border border-secondary bg-primary p-5 shadow-xs md:p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-tertiary">
              Shortcut
            </p>
            <h3 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-primary">
              <QuickAccess className="size-5 text-brand-700" />
              Aksi Cepat
            </h3>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <Link
              to="/dashboard/teacher-requests"
              className="group flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-100 p-4 text-left text-amber-950 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-700 text-white shadow-sm">
                <PendingUser className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold">Teacher Requests</h4>
                <p className="text-xs opacity-75">
                  {pendingTeacherRequests} menunggu review
                </p>
              </div>
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/dashboard/book-requests"
              className="group flex items-center gap-3 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-rose-100 p-4 text-left text-orange-950 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-solid text-white shadow-sm">
                <BookMarked className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold">Book Requests</h4>
                <p className="text-xs opacity-75">Review publikasi buku guru</p>
              </div>
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/dashboard/user-list"
              className="group flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-cyan-100 p-4 text-left text-emerald-950 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                <Users className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold">User List</h4>
                <p className="text-xs opacity-75">{activeUsers} akun aktif</p>
              </div>
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-center">
            <p className="text-xs font-medium text-secondary">
              Sistem admin berjalan normal
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
