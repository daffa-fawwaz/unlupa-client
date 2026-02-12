import { ArrowLeft, Plus } from "lucide-react";

interface JuzDetailViewProps {
  backToDashboard: () => void;
}

export const JuzDetailView = ({ backToDashboard }: JuzDetailViewProps) => {
  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="p-2 rounded-xl cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          onClick={backToDashboard}
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-white">Juz</h1>
          <p className="text-sm text-gray-400">0 Hafalan Tersimpan</p>
        </div>
        <button className="ml-auto px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Hafalan</span>
        </button>
      </div>

      {/* Content */}
      {/* <div className="grid gap-3">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <QuranItemRow
              key={item.id_system}
              item={item}
              material={materials[item.material_id]}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/2">
            <p className="text-gray-500 mb-4">Belum ada hafalan di Juz {juz}</p>
            <button
              onClick={onAddItem}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-medium text-sm"
            >
              Mulai Menghafal
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
};
