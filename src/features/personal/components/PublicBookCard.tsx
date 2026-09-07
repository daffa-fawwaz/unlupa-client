import { Calendar, Download, Box, Globe2 } from "lucide-react";
import type { Book } from "../types/personal.types";
import { resolveAssetUrl } from "@/lib/assets";

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
    <div className="relative flex flex-col justify-between overflow-hidden group 
                 rounded-2xl bg-card 
                 border border-primary/20 hover:border-primary/50 
                 transition-all duration-700 min-h-[350px] 
                 hover:-translate-y-2 hover:shadow-xl 
                 shadow-sm cursor-pointer">
      
      {/* Decorative Background glow */}
      <div className="absolute -inset-10 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />

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
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-120 group-hover:rotate-3 transition-transform duration-700">
               <Box className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors" />
            </div>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
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
            {book.description || "Tidak ada sinopsis atau deskripsi untuk kitab ini."}
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
            onClick={(e) => { e.stopPropagation(); onImport?.(book); }}
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
