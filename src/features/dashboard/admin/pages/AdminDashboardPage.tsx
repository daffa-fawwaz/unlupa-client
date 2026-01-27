import { useState } from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import {
  Menu,
  Bell,
  Search,
  Users,
  BookOpen,
  DollarSign,
  Activity,
  MoreVertical,
  Calendar,
  Shield,
  ArrowUpRight,
} from "lucide-react";

export const AdminDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dummy Data for Stats
  const stats = [
    {
      title: "Total Pengguna",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
      color: "blue",
      desc: "Siswa & Pengajar",
    },
    {
      title: "Kelas Aktif",
      value: "156",
      change: "+8.2%",
      icon: BookOpen,
      color: "emerald",
      desc: "Sedang berlangsung",
    },
    {
      title: "Pendapatan",
      value: "Rp 154jt",
      change: "+23.1%",
      icon: DollarSign,
      color: "gold",
      desc: "Bulan ini",
    },
    {
      title: "Aktivitas Sistem",
      value: "98.9%",
      change: "+0.4%",
      icon: Activity,
      color: "purple",
      desc: "Uptime Server",
    },
  ];

  return (
    <div className="min-h-screen bg-deep-universe text-white relative overflow-hidden font-primary max-w-7xl mx-auto p-6 md:p-10 transition-all duration-300">
      {/* Background Elements */}
      <div className="stars-overlay"></div>

      {/* Sidebar Integration */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

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
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-widest">
                DASHBOARD <span className="text-gold-premium">ADMIN</span>
              </h1>
              <p className="text-sm text-gray-400">
                Pusat Kontrol Ekosistem BAQEN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="Cari data..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm w-64 focus:w-80 transition-all focus:border-amber-500/50 focus:outline-none text-white placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 transition" />
            </div>

            {/* Notification */}
            <button className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </button>

            {/* Admin Profile Tiny */}
            <div className="h-9 w-9 rounded-lg bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center font-serif font-bold text-black border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              A
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`monolith-card ${stat.color} p-6 rounded-2xl group`}
            >
              <div className="card-nebula bg-current opacity-20"></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`icon-orb text-${stat.color}-400`}>
                  <stat.icon className="w-6 h-6 neon-icon" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-${stat.color}-400`}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Section: Activity & Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                Aktivitas Terkini
              </h3>
              <button className="text-xs text-gray-400 hover:text-white transition">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition">
                      Pendaftaran Siswa Baru
                    </h4>
                    <p className="text-xs text-gray-400">
                      Ahmad Fauzi mendaftar di kelas Tahsin Dasar
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    2m lalu
                  </span>
                  <MoreVertical className="w-4 h-4 text-gray-600 group-hover:text-white transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col">
            <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              Aksi Cepat
            </h3>

            <div className="space-y-3 flex-1">
              <button className="w-full p-4 rounded-xl bg-linear-to-r from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/50 hover:from-amber-500/20 transition flex items-center gap-3 text-left group">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-white">
                    Tambah Pengajar
                  </h4>
                  <p className="text-[10px] text-amber-500/60">
                    Verifikasi manual
                  </p>
                </div>
              </button>

              <button className="w-full p-4 rounded-xl bg-linear-to-r from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/50 hover:from-blue-500/20 transition flex items-center gap-3 text-left group">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-100 group-hover:text-white">
                    Buat Jadwal
                  </h4>
                  <p className="text-[10px] text-blue-500/60">
                    Sesi kelas baru
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
