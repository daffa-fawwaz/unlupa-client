import { Menu, Moon, Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  return (
    <div className="mb-10 flex flex-col justify-between relative z-10">
      <div className="flex justify-between items-start">
        <button
          onClick={onMenuClick}
          className="flex mb-4 items-center gap-3 text-gray-400 hover:text-amber-500 transition-all group cursor-pointer"
        >
          <div className="p-2.5 rounded-xl border border-white/10 group-hover:border-amber-500/50 bg-white/5 group-hover:bg-amber-500/10 transition-all duration-300">
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-mono tracking-[0.2em] hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
            MENU
          </span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-amber-500 font-medium">
          <Sparkles className="w-3 h-3" />
          <span>Premium Tracker</span>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 flex items-center gap-4 tracking-tight">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            <Moon className="w-10 h-10 text-amber-400 relative z-10" />
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-white to-gray-400">
            Al-Qur'an Tracker
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
          Pantau progres hafalan dan muraja'ahmu setiap hari dengan metode yang
          terstruktur.
        </p>
      </div>
    </div>
  );
};
