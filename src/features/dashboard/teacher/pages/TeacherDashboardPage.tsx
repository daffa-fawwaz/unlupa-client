import { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  Search,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  MoreVertical,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Play,
  Loader2,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Sidebar } from "@/components/ui/Sidebar";
import { useGetDaily } from "@/features/alquran/hooks/useGetDaily";
import { useGetMyItems } from "@/features/alquran/hooks/useGetMyItems";
import { QuickAccessCards } from "@/components/ui/QuickAccessCards";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const TeacherDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { name } = useCurrentUser();

  const { data: dailyTasks, loading: dailyLoading } = useGetDaily();
  const { data: myItems, loading: myItemsLoading, getMyItems } = useGetMyItems();

  useEffect(() => {
    void getMyItems("quran");
  }, []);

  const totalStudents = myItems?.data.groups.length ?? 0;
  const totalItems =
    myItems?.data.groups.reduce((sum, group) => sum + group.item_count, 0) ?? 0;

  // Get initial letter for avatar
  const initialLetter = name.charAt(0).toUpperCase();

  const statCards = [
    {
      title: "Total Siswa",
      value: dailyLoading || myItemsLoading ? "..." : totalStudents.toString(),
      change: "Aktif",
      desc: "Siswa dalam bimbingan",
      icon: Users,
      color: "blue",
    },
    {
      title: "Materi Terjaga",
      value: dailyLoading || myItemsLoading ? "..." : totalItems.toString(),
      change: "Item",
      desc: "Al-Qur'an & Buku",
      icon: BookOpen,
      color: "emerald",
    },
    {
      title: "Review Hari Ini",
      value: dailyLoading ? "..." : (dailyTasks?.length ?? 0).toString(),
      change: "Tugas",
      desc: "Perlu diselesaikan",
      icon: Clock,
      color: "gold",
    },
    {
      title: "Progress Rata-rata",
      value: "78%",
      change: "+12%",
      desc: "Dari semua siswa",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const topStudents = [
    { name: "Ahmad Fauzi", progress: 95, items: 142, status: "excellent" },
    { name: "Siti Nurhaliza", progress: 88, items: 128, status: "good" },
    { name: "Umar Bakri", progress: 82, items: 115, status: "good" },
    { name: "Khadijah Amin", progress: 75, items: 98, status: "average" },
  ];

  const recentActivities = [
    {
      type: "completion",
      title: "Ahmad Fauzi menyelesaikan Juz 30",
      time: "5 menit lalu",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      type: "review",
      title: "Siti Nurhaliza melakukan review Surah Al-Mulk",
      time: "15 menit lalu",
      icon: Star,
      color: "amber",
    },
    {
      type: "alert",
      title: "Umar Bakri belum review 3 hari",
      time: "1 jam lalu",
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-deep-universe text-white relative overflow-hidden font-primary max-w-7xl mx-auto p-6 md:p-10 transition-all duration-300">
      {/* Background Elements */}
      <div className="stars-overlay"></div>

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
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 transition text-amber-500"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-display font-bold text-white tracking-widest">
                DASHBOARD <span className="text-gold-premium">PENGAJAR</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-400">
                Pusat Monitoring & Bimbingan Siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="Cari siswa atau materi..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm w-64 focus:w-80 transition-all focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 transition" />
            </div>

            {/* Notification */}
            <button className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </button>

            {/* Teacher Profile (Dynamic from auth store) */}
            <div className="h-9 w-9 rounded-lg bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center font-serif font-bold text-black border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              {initialLetter}
            </div>
          </div>
        </header>

        {/* QUICK ACCESS CARDS */}
        <QuickAccessCards role="teacher" />

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

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Top Students Progress */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Progress Siswa Teratas
              </h3>
              <button className="text-xs text-gray-400 hover:text-white transition">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={student.name}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition cursor-pointer"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-bold font-serif border border-amber-500/30">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white group-hover:text-amber-300 transition">
                        {student.name}
                      </h4>
                      <span className="text-xs font-mono text-amber-500">
                        {student.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          student.status === "excellent"
                            ? "bg-linear-to-r from-emerald-500 to-emerald-400"
                            : student.status === "good"
                              ? "bg-linear-to-r from-amber-500 to-amber-400"
                              : "bg-linear-to-r from-blue-500 to-blue-400"
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {student.items} item terjaga
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Reviews */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Review Hari Ini
              </h3>
              <span className="text-xs text-amber-500 font-mono">
                {dailyTasks?.length ?? 0} tugas
              </span>
            </div>

            {dailyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-amber-500 spin-loader" />
              </div>
            ) : dailyTasks && dailyTasks.length > 0 ? (
              <div className="space-y-3">
                {dailyTasks.slice(0, 5).map((task: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-amber-500/30 transition"
                  >
                    <p className="text-sm text-white font-medium truncate">
                      {task.item_name || `Tugas ${idx + 1}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(task.due_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-gray-400">Tidak ada review hari ini</p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Section: Activity & Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                Aktivitas Terbaru
              </h3>
              <button className="text-xs text-gray-400 hover:text-white transition">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      activity.color === "emerald"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : activity.color === "amber"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white group-hover:text-amber-300 transition">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-600 group-hover:text-white transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col">
            <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Aksi Cepat
            </h3>

            <div className="space-y-3 flex-1">
              <button className="w-full cursor-pointer group p-4 rounded-xl bg-linear-to-r from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/50 hover:from-amber-500/20 transition flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-white">
                    Mulai Sesi Live
                  </h4>
                  <p className="text-[10px] text-amber-500/60">
                    Kelas virtual dengan siswa
                  </p>
                </div>
              </button>

              <button className="w-full cursor-pointer group p-4 rounded-xl bg-linear-to-r from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/50 hover:from-blue-500/20 transition flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-100 group-hover:text-white">
                    Kelola Siswa
                  </h4>
                  <p className="text-[10px] text-blue-500/60">
                    Lihat & monitor progress
                  </p>
                </div>
              </button>

              <button className="w-full cursor-pointer group p-4 rounded-xl bg-linear-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/50 hover:from-emerald-500/20 transition flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-100 group-hover:text-white">
                    Beri Feedback
                  </h4>
                  <p className="text-[10px] text-emerald-500/60">
                    Review progress siswa
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">
                System Version 2.4.0 (Alpha)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
