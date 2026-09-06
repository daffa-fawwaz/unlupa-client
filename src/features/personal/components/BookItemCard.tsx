import { useNavigate } from "react-router";
import { Brain, CalendarClock, Clock, FileText, Flame, Image } from "lucide-react";
import { useItemDetailCached } from "@/features/personal/hooks/useItemDetailCached";
import type { BookItem } from "@/features/personal/types/personal.types";

interface BookItemCardProps {
  item: BookItem;
  bookId: string;
  /** Real item_id from the `items` table (state ID). If provided, stability &
   *  next_review_at will be fetched. If omitted the card renders without those stats. */
  realItemId?: string;
}

export const BookItemCard = ({ item, bookId, realItemId }: BookItemCardProps) => {
  const navigate = useNavigate();
  // Only fetch detail when we have the correct item state ID
  const detail = useItemDetailCached(realItemId ?? "");
  const nextReviewAt = detail?.next_review_at || detail?.interval_next_review_at;
  const reviewCount = detail?.review_count ?? item.review_count ?? 0;
  // Prefer stability from the tree response (item prop) since the BE returns it directly.
  // Fall back to detail fetch only if the tree didn't include it.
  const stability = item.stability ?? detail?.stability;

  return (
    <button
      onClick={() => navigate(`/dashboard/pribadi/book/${bookId}/item/${item.id}`)}
      className="group relative bg-card border border-border rounded-2xl sm:rounded-2xl p-3 sm:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-success/30 hover:shadow-xl flex flex-col overflow-hidden text-left"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-surface-1 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />

      {item.image && (
        <div className="relative z-10 mb-3 overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-surface-1">
          <img
            src={item.image}
            alt={item.content || "Gambar item"}
            className="h-28 w-full object-cover sm:h-40 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-foreground/80 backdrop-blur">
            <Image className="h-3 w-3" />
            Gambar
          </div>
        </div>
      )}

      {/* Question */}
      <div className="relative z-10 mb-2 sm:mb-4">
        <h3 className="text-sm sm:text-xl font-bold text-foreground group-hover:text-success transition-colors duration-300 line-clamp-2 leading-snug whitespace-pre-wrap">
          {item.content}
        </h3>
      </div>

      {/* Answer preview — hidden on mobile */}
      <div className="relative z-10 flex-1 mb-2 sm:mb-4 hidden sm:block">
        <div className="p-3 rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors border border-transparent group-hover:border-border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-3 h-3 text-muted-foreground" />
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">Jawaban</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">{item.answer}</p>
        </div>
      </div>

      {/* Footer stats */}
      <div className="relative z-10 grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-4 border-t border-border">
        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-warning" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">Review</span>
          </div>
          <span className="text-xs sm:text-base font-mono font-bold text-warning leading-none">{reviewCount}x</span>
        </div>

        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">Stability</span>
          </div>
          <span className="text-xs font-bold text-primary leading-none">
            {stability != null && !isNaN(parseFloat(String(stability)))
              ? `${Math.round(parseFloat(String(stability)))}`
              : "—"}
          </span>
        </div>

        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-info" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">Est.</span>
          </div>
          <span className="text-xs font-medium text-info leading-none">
            {item.estimated_review_seconds >= 60
              ? `${Math.round(item.estimated_review_seconds / 60)}m`
              : `${item.estimated_review_seconds}d`}
          </span>
        </div>

        <div className="flex flex-col p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-surface-1 group-hover:bg-surface-2 transition-colors">
          <div className="flex items-center gap-1 mb-0.5">
            <CalendarClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-info" />
            <span className="text-[0.5rem] sm:text-[0.6rem] text-muted-foreground uppercase tracking-wider font-bold">Next</span>
          </div>
          <span className="text-[0.6rem] sm:text-xs font-medium text-info leading-none">
            {nextReviewAt
              ? new Date(nextReviewAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
              : "—"}
          </span>
        </div>
      </div>
    </button>
  );
};
