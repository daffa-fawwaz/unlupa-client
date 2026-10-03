import {
  Calendar,
  Share2,
  Globe2,
  Clock,
  CheckCircle,
} from "@/components/foundations/hugeicons";
import type { Book } from "../types/personal.types";
import { resolveAssetUrl } from "@/lib/assets";
import { BookCoverVisual } from "@/components/personal/BookCoverVisual";

interface ShareBookCardProps {
  book: Book;
  onShare?: (book: Book) => void;
}

export const ShareBookCard = ({ book, onShare }: ShareBookCardProps) => {
  const formattedDate = new Date(book.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isPublished = book.status === "published";
  const isPending = book.status === "pending" || book.status === "review";

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden group 
                 rounded-xl bg-card 
                 border border-border hover:border-primary/40 
                 transition-colors min-h-[350px] 
                 hover:-translate-y-1 cursor-pointer`}
    >
      {/* Decorative Background glow */}
      <div className="absolute -inset-10 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />

      {/* --- PHYSICAL BOOK COVER --- */}
      <div className="relative flex h-56 w-full shrink-0 items-center justify-center overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_28%,rgba(239,105,5,0.18),transparent_68%)]">
        <div className="absolute inset-x-5 bottom-3 h-2 rounded-full bg-black/15 blur-sm" />
        <div className="absolute inset-x-0 bottom-0 h-6 border-t border-[#d8c7ae] bg-[linear-gradient(180deg,#eadfce_0%,#cdb99d_100%)] dark:border-[#51483d] dark:bg-[linear-gradient(180deg,#51483d_0%,#302a24_100%)]" />
        <BookCoverVisual
          src={resolveAssetUrl(book.cover_image)}
          title={book.title}
          author={book.owner_name}
          className="h-44 w-32"
        />

        {/* Top Floating Controls */}
        <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between">
          {isPublished ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-[9px] font-bold tracking-widest uppercase text-primary group-hover:text-primary group-hover:bg-primary/20 transition-colors">
              <CheckCircle className="w-3 h-3 text-primary" />
              <span>Sudah Rilis</span>
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/30 rounded-full text-[9px] font-bold tracking-widest uppercase text-warning group-hover:text-warning group-hover:bg-warning/20 transition-colors">
              <Clock className="w-3 h-3 text-warning" />
              <span>Proses Review</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background/40 border border-success/30 rounded-full text-[9px] font-bold tracking-widest uppercase text-success group-hover:text-success group-hover:bg-success/20 transition-colors">
              <Globe2 className="w-3 h-3 text-success" />
              <span>Draft Lokal</span>
            </div>
          )}
        </div>
      </div>

      {/* --- BODY SECTION --- */}
      <div className="p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
        <div className="mb-6 z-10 relative">
          <h3 className="text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-foreground transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground/90 leading-relaxed font-light line-clamp-2">
            {book.description ||
              "Tidak ada sinopsis atau deskripsi untuk kitab ini."}
          </p>
        </div>

        {/* Action Button: Share */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Karya Sendiri
            </div>
          </div>

          {isPublished ? (
            <button
              disabled
              className="w-full py-3.5 rounded-lg bg-primary/10 border border-primary/20 text-primary/80 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Terpublikasi Global</span>
            </button>
          ) : isPending ? (
            <button
              disabled
              className="w-full py-3.5 rounded-lg bg-warning/10 border border-warning/20 text-warning/80 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Menunggu Persetujuan</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(book);
              }}
              className="w-full py-3.5 rounded-lg cursor-pointer bg-primary/10 border border-primary/30 hover:bg-primary hover:text-primary-foreground text-primary font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Kitab</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
