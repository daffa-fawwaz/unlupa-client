import {
  Calendar,
  Share2,
  Box,
  Globe2,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { Book } from "../types/personal.types";
import { resolveAssetUrl } from "@/lib/assets";

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
                 rounded-2xl bg-card 
                 border ${isPublished ? "border-success/20 hover:border-success/50" : isPending ? "border-warning/20 hover:border-warning/50" : "border-success/20 hover:border-success/50"} 
                 transition-all duration-700 min-h-[350px] 
                 hover:-translate-y-2 ${isPublished ? "hover:shadow-xl" : isPending ? "hover:shadow-xl" : "hover:shadow-xl"} 
                 shadow-sm cursor-pointer`}
    >
      {/* Decorative Background glow */}
      <div
        className={`absolute -inset-10 ${isPublished ? "bg-primary/5" : isPending ? "bg-warning/5" : "bg-success/5"} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none`}
      />

      {/* --- IMAGE HEADER SECTION --- */}
      <div className="relative h-48 w-full shrink-0 flex items-center justify-center overflow-hidden bg-surface-1">
        {/* Shadow to separate image from text */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-card to-transparent z-10 pointer-events-none" />

        {book.cover_image ? (
          <img
            src={resolveAssetUrl(book.cover_image)}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-linear-to-t from-surface-1 to-surface-2 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
            {/* Very minimal book pattern for empty state */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 ${isPublished ? "bg-primary/10" : isPending ? "bg-warning/10" : "bg-success/10"} rounded-full blur-[100px] pointer-events-none`}
            />
            <div
              className={`w-16 h-16 rounded-2xl ${isPublished ? "bg-primary/10 border-primary/20 text-primary/80 group-hover:text-primary" : isPending ? "bg-warning/10 border-warning/20 text-warning/80 group-hover:text-warning" : "bg-success/10 border-success/20 text-success/80 group-hover:text-success"} border flex items-center justify-center group-hover:scale-120 group-hover:-rotate-3 transition-all duration-700`}
            >
              <Box className="w-6 h-6 transition-colors" />
            </div>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          {isPublished ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 shadow-sm rounded-full text-[9px] font-bold tracking-widest uppercase text-primary group-hover:text-primary group-hover:bg-primary/20 transition-all duration-500">
              <CheckCircle className="w-3 h-3 text-primary" />
              <span>Sudah Rilis</span>
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/30 shadow-sm rounded-full text-[9px] font-bold tracking-widest uppercase text-warning group-hover:text-warning group-hover:bg-warning/20 transition-all duration-500">
              <Clock className="w-3 h-3 text-warning animate-pulse" />
              <span>Proses Review</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background/40 border border-success/30 shadow-sm rounded-full text-[9px] font-bold tracking-widest uppercase text-success group-hover:text-success group-hover:bg-success/20 transition-all duration-500">
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
              className="w-full py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary/80 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Terpublikasi Global</span>
            </button>
          ) : isPending ? (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-warning/10 border border-warning/20 text-warning/80 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
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
              className="w-full py-3.5 rounded-xl cursor-pointer bg-success/10 border border-success/30 hover:bg-success hover:text-success-foreground text-success font-bold transition-all flex items-center justify-center gap-2"
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
