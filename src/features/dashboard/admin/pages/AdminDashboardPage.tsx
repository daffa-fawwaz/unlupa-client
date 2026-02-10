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
} from "lucide-react";
import { StatCard, stats } from "../../../../components/ui/StatCard";
import { Sidebar } from "@/components/ui/Sidebar";

export const AdminDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                DASHBOARD <span className="text-gold-premium">ADMIN</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-400">
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
          {stats.map((stat) => (
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
              <button className="w-full cursor-pointer group p-4 rounded-xl bg-linear-to-r from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/50 hover:from-amber-500/20 transition flex items-center gap-3 text-left group">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-100 group-hover:text-white">
                    Teacher Requests
                  </h4>
                  <p className="text-[10px] text-amber-500/60">
                    Lihat permintaan menjadi pengajar
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
