import { useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  MoreVertical,
  Layers,
} from "lucide-react";
import type { MyItemDetail } from "@/features/alquran/types/quran.types";
import { SURAH_NAMES } from "@/features/alquran/constants/surahList";
import { StartIntervalModal } from "@/features/alquran/components/StartIntervalModal";

interface HafalanCardProps {
  item: MyItemDetail;
  onIntervalStarted?: () => void; 
}

export const HafalanCard = ({ item, onIntervalStarted }: HafalanCardProps) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  let displayTitle = "";
  let displaySubtitle = "";

  const parts = item.content_ref.split(":");
  if (parts[0] === "surah") {
    let surahName = parts[1] || "Unknown";
    const surahId = parseInt(parts[1]);
    if (!isNaN(surahId) && SURAH_NAMES[surahId - 1]) {
      surahName = SURAH_NAMES[surahId - 1];
    }
    const ayatRange = parts[2] ? parts[2].replace("-", " - ") : "?";
    displayTitle = surahName;
    displaySubtitle = `Ayat ${ayatRange}`;
  } else {
    displayTitle = `Halaman ${parts[1]}`;
    displaySubtitle = "Mushaf";
  }

  return (
    <>
      <div className="group relative flex flex-col p-7 rounded-[2.5rem] bg-gray-900/40 border border-white/5 hover:border-amber-500/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Background Decor */}
        <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
          <BookOpen className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-300 shadow-inner group-hover:scale-110">
              <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-amber-400 transition-colors" />
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${
                  item.status === "active"
                    ? "bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]"
                    : item.status === "memorizing"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]"
                      : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                }`}
              >
                {item.status}
              </span>
              <button className="p-1.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-serif text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
              {displayTitle}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
              <Layers className="w-4 h-4 text-amber-500/50" />
              <span className="font-medium">{displaySubtitle}</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-6 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-2 group-hover:text-gray-400 transition-colors">
                <Clock className="w-4 h-4 text-amber-500/50" />
                <span>{item.review_count}x Review</span>
              </div>
              <div className="flex items-center gap-2 group-hover:text-gray-400 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-500/50" />
                <span>
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-amber-500 hover:bg-amber-400 text-black p-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
            >
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal di-render di luar card supaya tidak terpotong oleh overflow:hidden card */}
      <StartIntervalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={item.item_id}
        itemTitle={`${displayTitle} – ${displaySubtitle}`}
        onSuccess={onIntervalStarted}
      />
    </>
  );
};
