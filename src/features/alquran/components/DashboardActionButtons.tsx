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
        className="shrink-0 snap-start w-full sm:w-auto min-w-[200px] px-6 py-5 bg-linear-to-br from-amber-500 to-orange-600 rounded-[2rem] flex items-center gap-4 text-black font-bold shadow-lg shadow-amber-900/20 hover:scale-[1.02] hover:shadow-amber-500/30 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

        <div className="relative z-10 w-10 h-10 bg-black/20 rounded-2xl flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
          <Plus className="w-6 h-6 text-black" />
        </div>
        <div className="text-left relative z-10">
          <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-0.5">
            Hafalan Baru
          </div>
          <div className="text-xl leading-none font-serif">Tambah Target</div>
        </div>
        <ArrowRight className="w-5 h-5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
      </button>

      <button className="shrink-0 snap-start w-full sm:w-auto min-w-[200px] px-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 text-white hover:bg-white/10 hover:border-white/20 transition-all group overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Users className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
        </div>
        <div className="text-left">
          <div className="text-[10px] text-gray-400 font-bold opacity-70 uppercase tracking-widest mb-0.5 group-hover:text-amber-400 transition-colors">
            Komunitas
          </div>
          <div className="text-xl leading-none font-serif text-gray-200 group-hover:text-white transition-colors">
            Gabung Kelas
          </div>
        </div>
      </button>
    </div>
  );
};
