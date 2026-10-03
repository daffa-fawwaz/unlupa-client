import { Calendar, Download, Globe2 } from "@/components/foundations/hugeicons";
import type { Book } from "../types/personal.types";
import { resolveAssetUrl } from "@/lib/assets";
import { BookCoverVisual } from "@/components/personal/BookCoverVisual";

interface PublicBookCardProps {
  book: Book;
  onImport?: (book: Book) => void;
}

export const PublicBookCard = ({ book, onImport }: PublicBookCardProps) => {
  const formattedDate = new Date(book.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative flex min-h-[350px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm transition-all duration-700 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl">
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background/40 border border-primary/30 shadow-sm rounded-full text-[9px] font-bold tracking-widest uppercase text-primary group-hover:text-primary group-hover:bg-primary/20 transition-all duration-500">
            <Globe2 className="w-3 h-3 text-primary animate-pulse" />
            <span>Publik global</span>
          </div>
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

        {/* Action Button: Download/Import */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onImport?.(book);
            }}
            className="w-full py-3.5 rounded-xl cursor-pointer bg-primary/10 border border-primary/30 hover:bg-primary hover:text-primary-foreground text-primary font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Simpan ke Koleksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
