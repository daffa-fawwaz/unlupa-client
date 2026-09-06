import { Menu, Users, ArrowLeft } from "lucide-react";

interface TopNavigationBarProps {
  setIsSidebarOpen: (open: boolean) => void;
  info: string;
}

export const TopNavigationBar = ({
  setIsSidebarOpen,
  info,
}: TopNavigationBarProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Container untuk tombol Kembali dan Menu agar berdampingan */}
      <div className="flex items-center gap-3">
        {/* Tombol Menu */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group cursor-pointer"
        >
          <div className="p-2.5 rounded-2xl border border-border group-hover:border-border bg-surface-1 group-hover:bg-surface-2 transition-all duration-300">
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xs font-mono tracking-[0.2em] font-semibold hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
            MENU
          </span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-1 border border-primary/20 text-xs text-primary font-bold select-none transition-all hover:bg-surface-2">
          <Users className="w-4 h-4" />
          <span>{info}</span>
        </div>
      </div>
    </div>
  );
};
