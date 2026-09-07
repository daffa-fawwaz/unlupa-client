import {
  BookOpen,
  Clock,
  CheckCircle,
  Layers,
  ChevronRight,
  Calendar,
} from "lucide-react";
import type { MyItemDetail } from "@/features/alquran/types/quran.types";
import { SURAH_NAMES } from "@/features/alquran/constants/surahList";
import { convertPageRangeToSurahLabel } from "@/features/alquran/utils/pageToSurahConverter";

interface HafalanCardProps {
  item: MyItemDetail;
  onClick?: () => void;
}

export const HafalanCard = ({ item, onClick }: HafalanCardProps) => {
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
  } else if (parts[0] === "page" && parts[1]) {
    // Use converter for rich label
    const pageRange = `page:${parts[1]}`;
    const convertedLabel = convertPageRangeToSurahLabel(pageRange);
    // Parse: "Hal 582-604 - An-Naba 1-40"
    const [pagePart, surahPart] = convertedLabel.split(" - ");
    displayTitle = surahPart || pagePart;
    displaySubtitle = pagePart;
  } else {
    displayTitle = `Halaman ${parts[1]}`;
    displaySubtitle = "Mushaf";
  }

  const intervalLabel = () => {
    switch (item.status) {
      case "fsrs_active":
      case "interval":
        return "Ujian FSRS";
      case "graduate":
        return "Selesai";
      case "menghafal":
        return "Menghafal";
      default:
        return item.status;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col p-4 md:p-7 rounded-2xl md:rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-2 overflow-hidden cursor-pointer"
    >
      {/* Background Decor */}
      <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
        <BookOpen className="w-48 h-48 text-foreground" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-2 md:p-3.5 rounded-xl md:rounded-2xl bg-surface-1 border border-border group-hover:bg-surface-2 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110">
            <BookOpen className="w-4 md:w-6 h-4 md:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                item.status === "fsrs_active"
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : item.status === "menghafal"
                    ? "bg-warning/10 border-warning/20 text-warning"
                    : item.status === "interval"
                      ? "bg-info/10 border-info/20 text-info"
                      : "bg-success/10 border-success/20 text-success"
              }`}
            >
              {intervalLabel()}
            </span>
          </div>
        </div>

        <div className="mb-4 md:mb-8">
          <h3 className="text-lg md:text-3xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors">
            <Layers className="w-3 h-3 md:w-4 md:h-4  text-primary/50" />
            <span className="font-medium">{displaySubtitle}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex flex-col gap-3 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2 group-hover:text-foreground/80 transition-colors">
              <Clock className="w-3 h-3 md:w-4 md:h-4  text-primary/50" />
              <span>{item.review_count}x Review</span>
            </div>
            <div className="flex items-center gap-2 group-hover:text-foreground/80 transition-colors">
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4  text-success/50" />
              <span>
                {new Date(item.created_at).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {(item.next_review_at || item.next_review) && (
              <div className="flex items-center gap-2 group-hover:text-foreground/80 transition-colors">
                <Calendar className="w-3 h-3 md:w-4 md:h-4  text-info/50" />
                <span> 
                  {new Date((item.next_review_at || item.next_review)!).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  })} 
                </span>
              </div>
            )}
          </div>

          {/* Chevron sebagai visual cue bahwa card bisa diklik */}
          <div className="opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-primary">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
