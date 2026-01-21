import {
  ChevronRight,
  GraduationCap,
  LogOut,
  Moon,
  RefreshCw,
  Settings,
  User,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar = ({
  isOpen,
  onClose,
}: DashboardSidebarProps) => {
  return (
    <>
      {/* SIDEBAR DRAWER */}
      <aside className={`sidebar ${isOpen ? "active" : ""}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-amber-500/30 flex items-center justify-center">
              <span className="font-serif font-bold text-amber-500">B</span>
            </div>
            <span className="font-cinzel font-bold text-xl text-white tracking-widest">
              BAQEN
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="mb-8">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">
            Mode Akun
          </p>
          <button className="role-switch-btn group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-bold">
                P
              </div>
              <span className="text-sm font-medium text-white group-hover:text-amber-400 transition">
                Pelajar
              </span>
            </div>
            <RefreshCw className="w-4 h-4 text-gray-500 group-hover:text-white transition group-hover:rotate-180" />
          </button>
        </div>

        {/* Room Navigation */}
        <div className="flex-1 overflow-y-auto pr-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 px-1">
            Ruang Belajar
          </p>

          <div className="nav-card nav-quran group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-serif text-white group-hover:text-emerald-300">
                Ruang Al-Qur'an
              </h4>
              <p className="text-[10px] text-gray-400">Jaga Hafalan Suci</p>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-500/50 group-hover:translate-x-1 transition" />
          </div>

          <div className="nav-card nav-class group">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-serif text-white group-hover:text-blue-300">
                Ruang Kelas
              </h4>
              <p className="text-xs text-gray-400">Terstruktur & Akademis</p>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-500/50 group-hover:translate-x-1 transition" />
          </div>

          <div className="nav-card nav-private group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-serif text-white group-hover:text-purple-300">
                Ruang Pribadi
              </h4>
              <p className="text-xs text-gray-400">Materi Pilihan Anda</p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-500/50 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-4 pt-6 border-t border-white/10 space-y-2">
          <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Pengaturan</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg text-red-400 hover:bg-red-900/20 transition cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
