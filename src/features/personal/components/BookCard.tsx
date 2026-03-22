import { useState } from "react";
import { PenTool, MoreVertical, Edit2, Trash2, Calendar, Box } from "lucide-react";
import type { Book } from "../types/personal.types";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const BookCard = ({ book, onClick, onEdit, onDelete }: BookCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date(book.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(book);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(book);
  };

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col justify-between overflow-hidden group 
                 rounded-[2.5rem] bg-linear-to-b from-[#1E2736] to-[#0A0D14] 
                 border border-white/5 hover:border-white/10 
                 transition-all duration-700 min-h-[320px] 
                 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] 
                 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer"
    >
      {/* Dynamic ambient highlight on top edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Background glow within the card */}
      <div className="absolute -inset-10 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none" />

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
          <div className="absolute inset-0 w-full h-full bg-linear-to-t from-[#0A0D14] to-[#121822] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
            {/* Very minimal book pattern for empty state */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#1E2736]/50 border border-white/5 flex items-center justify-center group-hover:scale-120 group-hover:-rotate-3 transition-transform duration-700 backdrop-blur-md">
               <Box className="w-6 h-6 text-gray-500 group-hover:text-gray-300 transition-colors" />
            </div>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg rounded-full text-[9px] font-bold tracking-[0.15em] uppercase text-gray-300 group-hover:text-blue-200 group-hover:border-blue-500/30 transition-all duration-500">
            <PenTool className="w-3 h-3 text-blue-400" />
            <span>Karya Mandiri</span>
          </div>

          {/* Right: Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg text-gray-300 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu Panel */}
            {menuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-[#161D26]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-200 hover:text-white hover:bg-blue-500/20 transition-colors text-left"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                  <span>Edit Kitab</span>
                </button>
                <div className="w-full h-px bg-white/5" />
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Kitab</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-15" onClick={toggleMenu} />
      )}

      {/* --- BODY SECTION --- */}
      <div className="p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
        
        <div className="mb-6 z-10 relative">
          <div className="flex items-center gap-2 mb-3">
             <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm w-max">
              {book.status === "draft" ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-sm bg-amber-500/80" />
                  <span className="text-amber-400/90">Draft</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500/80" />
                  <span className="text-emerald-400/90">Published</span>
                </>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-100 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-400/90 leading-relaxed font-light line-clamp-2">
            {book.description || "Tidak ada sinopsis atau deskripsi untuk kitab ini."}
          </p>
        </div>

        {/* Stats Grid - Using Minimal Dots/Lines instead of heavy boxes */}
        <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-4 mb-5 shadow-inner">
          <div className="flex flex-col items-center flex-1">
             <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 shadow-sm">Total</div>
             <span className="text-xl font-black text-gray-200">0</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex flex-col items-center flex-1">
             <div className="text-[9px] text-blue-500/70 font-bold uppercase tracking-widest mb-1 shadow-sm">Aktif</div>
             <span className="text-xl font-black text-blue-400">0</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex flex-col items-center flex-1">
             <div className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest mb-1 shadow-sm">Lulus</div>
             <span className="text-xl font-black text-emerald-400">0</span>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
