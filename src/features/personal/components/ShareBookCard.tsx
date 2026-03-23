import {
  Calendar,
  Share2,
  Box,
  Globe2,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { Book } from "../types/personal.types";

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
                 rounded-[2.5rem] bg-linear-to-b from-[#16211C] to-[#0A0D14] 
                 border ${isPublished ? "border-sky-500/20 hover:border-sky-400/50" : isPending ? "border-amber-500/20 hover:border-amber-400/50" : "border-emerald-500/20 hover:border-emerald-400/50"} 
                 transition-all duration-700 min-h-[350px] 
                 hover:-translate-y-2 ${isPublished ? "hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.2)]" : isPending ? "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]" : "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)]"} 
                 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer`}
    >
      {/* Decorative Background glow */}
      <div
        className={`absolute -inset-10 ${isPublished ? "bg-sky-500/5" : isPending ? "bg-amber-500/5" : "bg-emerald-500/5"} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full pointer-events-none`}
      />

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
          <div className="absolute inset-0 w-full h-full bg-linear-to-t from-[#0A0D14] to-[#121A16] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
            {/* Very minimal book pattern for empty state */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 ${isPublished ? "bg-sky-500/10" : isPending ? "bg-amber-500/10" : "bg-emerald-500/10"} rounded-full blur-[100px] pointer-events-none`}
            />
            <div
              className={`w-16 h-16 rounded-[1.5rem] ${isPublished ? "bg-sky-500/10 border-sky-500/20 text-sky-400/80 group-hover:text-sky-300" : isPending ? "bg-amber-500/10 border-amber-500/20 text-amber-400/80 group-hover:text-amber-300" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400/80 group-hover:text-emerald-300"} border flex items-center justify-center group-hover:scale-120 group-hover:-rotate-3 transition-all duration-700 backdrop-blur-md`}
            >
              <Box className="w-6 h-6 transition-colors" />
            </div>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          {isPublished ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/10 backdrop-blur-xl border border-sky-500/30 shadow-lg rounded-full text-[9px] font-bold tracking-widest uppercase text-sky-200 group-hover:text-sky-100 group-hover:bg-sky-500/20 transition-all duration-500">
              <CheckCircle className="w-3 h-3 text-sky-400" />
              <span>Sudah Rilis</span>
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 shadow-lg rounded-full text-[9px] font-bold tracking-widest uppercase text-amber-200 group-hover:text-amber-100 group-hover:bg-amber-500/20 transition-all duration-500">
              <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Proses Review</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-emerald-500/30 shadow-lg rounded-full text-[9px] font-bold tracking-widest uppercase text-emerald-200 group-hover:text-emerald-100 group-hover:bg-emerald-500/20 transition-all duration-500">
              <Globe2 className="w-3 h-3 text-emerald-400" />
              <span>Draft Lokal</span>
            </div>
          )}
        </div>
      </div>

      {/* --- BODY SECTION --- */}
      <div className="p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
        <div className="mb-6 z-10 relative">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-50 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-400/90 leading-relaxed font-light line-clamp-2">
            {book.description ||
              "Tidak ada sinopsis atau deskripsi untuk kitab ini."}
          </p>
        </div>

        {/* Action Button: Share */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Karya Sendiri
            </div>
          </div>

          {isPublished ? (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400/80 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Terpublikasi Global</span>
            </button>
          ) : isPending ? (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400/80 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
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
              className="w-full py-3.5 rounded-xl cursor-pointer bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-emerald-400 font-bold transition-all flex items-center justify-center gap-2"
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
