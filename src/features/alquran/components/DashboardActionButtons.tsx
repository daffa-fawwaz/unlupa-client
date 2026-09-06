import { Plus, Users, ArrowRight } from "lucide-react";

interface DashboardActionButtonsProps {
  onAddClick: () => void;
}

export const DashboardActionButtons = ({
  onAddClick,
}: DashboardActionButtonsProps) => {
  return (
    <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide snap-x">
      <button
        onClick={onAddClick}
        className="shrink-0 snap-start w-full sm:w-auto min-w-[200px] px-6 py-5 bg-warning rounded-2xl flex items-center gap-4 text-warning-foreground font-bold shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-surface-1 dark:bg-warning-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

        <div className="relative z-10 w-10 h-10 bg-warning-foreground/20 rounded-2xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
          <Plus className="w-6 h-6 text-warning-foreground" />
        </div>
        <div className="text-left relative z-10">
          <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-0.5">
            Hafalan Baru
          </div>
          <div className="text-xl leading-none font-serif">Tambah Target</div>
        </div>
        <ArrowRight className="w-5 h-5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
      </button>

      <button className="shrink-0 snap-start w-full sm:w-auto min-w-[200px] px-6 py-5 bg-card border border-border rounded-2xl flex items-center gap-4 text-foreground hover:bg-surface-2 hover:border-border transition-all group overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-surface-1/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

        <div className="w-10 h-10 bg-surface-2 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Users className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <div className="text-left">
          <div className="text-[10px] text-muted-foreground font-bold opacity-70 uppercase tracking-widest mb-0.5 group-hover:text-warning transition-colors">
            Komunitas
          </div>
          <div className="text-xl leading-none font-serif text-muted-foreground group-hover:text-foreground transition-colors">
            Gabung Kelas
          </div>
        </div>
      </button>
    </div>
  );
};
