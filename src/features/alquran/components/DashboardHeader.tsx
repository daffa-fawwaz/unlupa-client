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
          className="flex mb-4 items-center gap-3 text-muted-foreground hover:text-warning transition-all group cursor-pointer"
        >
          <div className="p-2.5 rounded-xl border border-border group-hover:border-warning/50 bg-surface-1 group-hover:bg-warning/10 transition-all duration-300">
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-mono tracking-[0.2em] hidden md:inline opacity-70 group-hover:opacity-100 transition-opacity">
            MENU
          </span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1 border border-border text-xs text-warning font-medium">
          <Sparkles className="w-3 h-3" />
          <span>Premium Tracker</span>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 flex items-center gap-4 tracking-tight">
          <Moon className="w-10 h-10 text-warning" />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground to-muted-foreground">
            Al-Qur'an Tracker
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
          Pantau progres hafalan dan muraja'ahmu setiap hari dengan metode yang
          terstruktur.
        </p>
      </div>
    </div>
  );
};
