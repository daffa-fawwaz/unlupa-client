import { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  Users,
  Activity,
  MoreVertical,
  Calendar,
  Shield,
  BookMarked,
} from "lucide-react";
import { Link } from "react-router";
import { StatCard } from "@/components/ui/StatCard";
import { Sidebar } from "@/components/ui/Sidebar";
import { useUsers } from "@/features/dashboard/admin/hooks/useUsers";
import { useTeacherRequests } from "@/features/dashboard/admin/hooks/useTeacherRequests";
import { QuickAccessCards } from "@/components/ui/QuickAccessCards";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";


export const AdminDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { name } = useCurrentUser();

  const { data: users, loading: usersLoading } = useUsers();
  const {
    data: teacherRequests,
    loading: teacherLoading,
  } = useTeacherRequests();

  const loading = usersLoading || teacherLoading;

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter((u) => u.is_active).length ?? 0;
  const teacherCount = users?.filter((u) => u.role === "teacher").length ?? 0;
  const studentCount = users?.filter((u) => u.role === "student").length ?? 0;
  const pendingTeacherRequests =
    teacherRequests?.filter((r) => r.status === "pending").length ?? 0;

  // Get initial letter for avatar
  const initialLetter = name.charAt(0).toUpperCase();

  const statCards = [
    {
      title: "Total Pengguna",
      value: loading ? "..." : totalUsers.toLocaleString("id-ID"),
      change: "Live",
      desc: `Siswa & Pengajar (${studentCount} siswa, ${teacherCount} guru)`,
      icon: Users,
      color: "blue",
    },
    {
      title: "Pengguna Aktif",
      value: loading ? "..." : activeUsers.toLocaleString("id-ID"),
      change: "Realtime",
      desc: "Akun yang sedang aktif",
      icon: Activity,
      color: "emerald",
    },
    {
      title: "Guru Terdaftar",
      value: loading ? "..." : teacherCount.toString(),
      change: "Terdata",
      desc: "Akun dengan peran pengajar",
      icon: Shield,
      color: "gold",
    },
    {
      title: "Permintaan Guru Pending",
      value: loading ? "..." : pendingTeacherRequests.toString(),
      change: "Butuh Review",
      desc: "Belum diproses",
      icon: Users,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-primary max-w-7xl mx-auto p-6 md:p-10 transition-all duration-300">
      {/* Sidebar Integration */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 p-4 md:p-8 transition-all">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border transition text-foreground"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-display font-bold text-foreground tracking-widest">
                DASHBOARD <span className="text-primary">ADMIN</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Pusat Kontrol Ekosistem UNLUPA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="Cari data..."
                className="pl-10 pr-4 py-2 bg-surface-1 border border-border rounded-full text-sm w-64 focus:w-80 transition-all focus:border-primary/50 focus:outline-none text-foreground placeholder-muted-foreground"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition" />
            </div>

            {/* Notification */}
            <button className="relative p-2 rounded-full bg-surface-1 hover:bg-surface-2 border border-border transition group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
            </button>

            {/* Admin Profile (Dynamic from auth store) */}
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center font-serif font-bold text-primary-foreground">
              {initialLetter}
            </div>
          </div>
        </header>

        {/* QUICK ACCESS CARDS */}
        <QuickAccessCards role="admin" />

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Aktivitas Terkini
              </h3>
              <button className="text-xs text-muted-foreground hover:text-foreground transition">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-surface-1 hover:bg-surface-2 border border-border transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center text-info border border-info/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground group-hover:text-info transition">
                      Pendaftaran Siswa Baru
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Ahmad Fauzi mendaftar di kelas Tahsin Dasar
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    2m lalu
                  </span>
                  <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl p-6 border border-border flex flex-col">
            <h3 className="text-lg font-serif font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Aksi Cepat
            </h3>

            <div className="space-y-3 flex-1">
              <Link
                to="/dashboard/teacher-requests"
                className="w-full cursor-pointer group p-4 rounded-xl bg-warning/10 border border-warning/20 hover:border-warning/50 transition flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Teacher Requests
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Lihat permintaan menjadi pengajar
                  </p>
                </div>
              </Link>

              <Link
                to="/dashboard/book-requests"
                className="w-full cursor-pointer group p-4 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/50 transition flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Book Requests
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Review publikasi buku guru
                  </p>
                </div>
              </Link>

              <button className="w-full p-4 rounded-xl bg-info/10 border border-info/20 hover:border-info/50 transition flex items-center gap-3 text-left group">
                <div className="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center text-info group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Buat Jadwal
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Sesi kelas baru
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                System Version 2.4.0 (Alpha)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
