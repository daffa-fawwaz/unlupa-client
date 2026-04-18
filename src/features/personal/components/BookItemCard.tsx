import { useNavigate } from "react-router";
import { Brain, CalendarClock, Clock, FileText, Flame } from "lucide-react";
import { useItemDetailCached } from "@/features/personal/hooks/useItemDetailCached";
import type { BookItem } from "@/features/personal/types/personal.types";

interface BookItemCardProps {
  item: BookItem;
  bookId: string;
}

export const BookItemCard = ({ item, bookId }: BookItemCardProps) => {
  const navigate = useNavigate();
  const detail = useItemDetailCached(item.id);
  const nextReviewAt = detail?.next_review_at || detail?.interval_next_review_at;
  const reviewCount = detail?.review_count ?? item.review_count ?? 0;
  const stability = detail?.stability ?? item.stability;

  return (
    <button
      onClick={() => navigate(`/dashboard/pribadi/book/${bookId}/item/${item.id}`)}
      className="group relative bg-[#0F1218]/80 backdrop-blur-md border border-white/5 rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col overflow-hidden text-left"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative order number */}
      <div className="absolute top-1 right-2 text-4xl sm:text-7xl font-serif font-bold text-white/3 pointer-events-none select-none">
        {item.order}
      </div>

      {/* Question */}
      <div className="relative z-10 mb-2 sm:mb-4">
        <h3 className="text-sm sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-snug">
          {item.content}
        </h3>
      </div>

      {/* Answer preview — hidden on mobile */}
      <div className="relative z-10 flex-1 mb-2 sm:mb-4 hidden sm:block">
        <div className="p-3 rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors border border-transparent group-hover:border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-3 h-3 text-gray-500" />
            <span className="text-[0.6rem] text-gray-500 uppercase tracking-wider font-bold">Jawaban</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.answer}</p>
        </div>
      </div>

      {/* Footer stats */}
      <div className="relative z-10 grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-4 border-t border-white/5">
        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-gray-500 uppercase tracking-wider font-bold">Review</span>
          </div>
          <span className="text-xs sm:text-base font-mono font-bold text-amber-400 leading-none">{reviewCount}x</span>
        </div>

        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-gray-500 uppercase tracking-wider font-bold">Stabil</span>
          </div>
          <span className="text-xs font-bold text-purple-400 leading-none">
            {stability != null && !isNaN(parseFloat(String(stability)))
              ? Math.round(parseFloat(String(stability)))
              : "—"}
          </span>
        </div>

        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-gray-500 uppercase tracking-wider font-bold">Est.</span>
          </div>
          <span className="text-xs font-medium text-cyan-400 leading-none">
            {item.estimated_review_seconds >= 60
              ? `${Math.round(item.estimated_review_seconds / 60)}m`
              : `${item.estimated_review_seconds}d`}
          </span>
        </div>

        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/2 group-hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <CalendarClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-gray-500 uppercase tracking-wider font-bold">Next</span>
          </div>
          <span className="text-[0.6rem] sm:text-xs font-medium text-blue-400 leading-none">
            {nextReviewAt
              ? new Date(nextReviewAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
              : "—"}
          </span>
        </div>
      </div>
    </button>
  );
};
