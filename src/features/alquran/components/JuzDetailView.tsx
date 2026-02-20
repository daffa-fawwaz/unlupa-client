import { ArrowLeft, Plus, BookOpen, Activity } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetMyItems } from "@/features/alquran/hooks/useGetMyItems";
import { HafalanKosong } from "@/components/ui/HafalanKosong";
import { HafalanCard } from "@/components/ui/HafalanCard";
import { AddHafalanModal } from "./AddHafalanModal";
import type { MyItemDetail } from "@/features/alquran/types/quran.types";

interface JuzDetailViewProps {
  juzId: string;
  juzIndex: number;
  backToDashboard: () => void;
  onItemClick: (item: MyItemDetail) => void;
}

export const JuzDetailView = ({
  juzId,
  juzIndex,
  backToDashboard,
  onItemClick,
}: JuzDetailViewProps) => {
  const { data, loading, error, getMyItems } = useGetMyItems();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    getMyItems("quran");
  }, []);

  const juzData = useMemo(() => {
    if (!data?.data?.groups) return null;
    return data.data.groups.find((group) => group.juz_id === juzId);
  }, [data, juzId]);

  const handleSaveHafalan = () => {
    // Refresh data after successful save
    getMyItems("quran");
  };

  return (
    <div className="animate-fadeIn pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="relative mb-12 p-8 md:p-10 rounded-[3rem] bg-linear-to-br from-amber-500/20 via-purple-500/10 to-transparent border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] transform translate-x-1/3 -translate-y-1/3 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-6 items-start">
            <button
              className="mt-1 p-3 rounded-2xl cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 hover:shadow-amber-500/20 hover:scale-105 transition-all group backdrop-blur-sm"
              onClick={backToDashboard}
            >
              <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-amber-400 transition-colors" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Juz {juzIndex}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium">
                  Al-Qur'an Tracker
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 tracking-tight">
                Hafalan{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-400">
                  Juz {juzIndex}
                </span>
              </h1>
              <p className="text-gray-400 text-lg flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                {juzData?.item_count || 0} Item sedang dipelajari
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-8 py-4 bg-linear-to-r from-amber-500 to-orange-600 rounded-2xl text-black font-bold shadow-lg shadow-amber-900/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group"
          >
            <div className="p-1 bg-black/20 rounded-full group-hover:rotate-90 transition-transform duration-300">
              <Plus className="w-5 h-5 text-black" />
            </div>
            <span>Tambah Hafalan Baru</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Loading Skeletons
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-white/5 animate-pulse"
            />
          ))
        ) : error ? (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4">
              <Activity className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-400 text-lg">Gagal memuat data: {error}</p>
          </div>
        ) : juzData && juzData.items.length > 0 ? (
          juzData.items.map((item) => (
            <HafalanCard
              key={item.item_id}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))
        ) : (
          <HafalanKosong hafalan="Juz" />
        )}
      </div>

      {/* Add Hafalan Modal */}
      <AddHafalanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        juzId={juzId}
        juzNumber={juzIndex}
        existingItems={juzData?.items || []}
        onSave={handleSaveHafalan}
      />
    </div>
  );
};
