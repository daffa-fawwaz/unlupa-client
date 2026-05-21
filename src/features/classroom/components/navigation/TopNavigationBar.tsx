import { Menu, Users } from "lucide-react";

interface TopNavigationBarProps {
  setIsSidebarOpen: (open: boolean) => void;
}

export const TopNavigationBar = ({
  setIsSidebarOpen,
}: TopNavigationBarProps) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group cursor-pointer"
      >
        <div className="p-2.5 rounded-2xl border border-white/5 group-hover:border-white/20 bg-white/5 group-hover:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-lg">
          <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs font-mono tracking-[0.2em] font-semibold hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
          MENU
        </span>
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#131824]/80 border border-blue-500/20 text-xs text-blue-400 font-bold backdrop-blur-xl shadow-lg shadow-blue-500/5 select-none transition-all hover:bg-[#1A2235]">
          <Users className="w-4 h-4" />
          <span>Student Area</span>
        </div>
      </div>
    </div>
  );
};
