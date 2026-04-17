import { Calendar, Download, Box, Globe2 } from "lucide-react";
import type { Book } from "../types/personal.types";

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
                 rounded-[2.5rem] bg-linear-to-b from-[#161D29] to-[#0A0D14] 
                 border border-purple-500/20 hover:border-purple-400/50 
                 transition-all duration-700 min-h-[350px] 
                 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] 
                 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer">
      
      {/* Decorative Background glow */}
      <div className="absolute -inset-10 bg-purple-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />

      {/* --- IMAGE HEADER SECTION --- */}
      <div className="relative h-48 w-full shrink-0 flex items-center justify-center overflow-hidden bg-[#0A0D14]">
        {/* Shadow to separate image from text */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-[#0A0D14] to-transparent z-10 pointer-events-none" />

        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-linear-to-t from-[#0A0D14] to-[#1A1A2E] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
            {/* Very minimal book pattern for empty state */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-16 h-16 rounded-[1.5rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-120 group-hover:rotate-3 transition-transform duration-700 backdrop-blur-md">
               <Box className="w-6 h-6 text-purple-400/80 group-hover:text-purple-300 transition-colors" />
            </div>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-lg rounded-full text-[9px] font-bold tracking-widest uppercase text-purple-200 group-hover:text-purple-100 group-hover:bg-purple-500/20 transition-all duration-500">
            <Globe2 className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>Publik global</span>
          </div>
        </div>
      </div>

      {/* --- BODY SECTION --- */}
      <div className="p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
        
        <div className="mb-6 z-10 relative">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-purple-50 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-400/90 leading-relaxed font-light line-clamp-2">
            {book.description || "Tidak ada sinopsis atau deskripsi untuk kitab ini."}
          </p>
        </div>

        {/* Action Button: Download/Import */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onImport?.(book); }}
            className="w-full py-3.5 rounded-xl cursor-pointer bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500 hover:text-white text-purple-400 font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Simpan ke Koleksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
