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
        className="shrink-0 snap-start w-full sm:w-auto min-w-[200px] px-5 py-4 bg-primary rounded-lg flex items-center gap-3 text-primary-foreground font-bold transition-colors hover:bg-primary/90 group"
      >
        <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
          <Plus className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-0.5">
            Hafalan Baru
          </div>
          <div className="text-xl leading-none font-serif">Tambah Target</div>
        </div>
        <ArrowRight className="w-5 h-5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </button>

      <button className="shrink-0 snap-start w-full sm:w-auto min-w-[200px] px-5 py-4 bg-card border border-border rounded-lg flex items-center gap-3 text-foreground hover:bg-surface-2 hover:border-border transition-colors group">
        <div className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="text-left">
          <div className="text-[10px] text-muted-foreground font-bold opacity-70 uppercase tracking-widest mb-0.5 group-hover:text-primary transition-colors">
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
