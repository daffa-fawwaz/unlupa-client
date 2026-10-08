import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
} from "@/components/foundations/hugeicons";
import type { Book } from "../types/personal.types";
import { useRemoveBookFromClass } from "@/features/classroom/hooks/useClassroom";
import { toast } from "sonner";
import { resolveAssetUrl } from "@/lib/assets";
import { BookCoverVisual } from "@/components/personal/BookCoverVisual";

export interface BookCardProps {
  book: Book;
  showMenu?: boolean;
  classroomId?: string;
  onClick?: () => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export const BookCard = ({
  book,
  showMenu,
  classroomId,
  onClick,
  onEdit,
  onDelete,
}: BookCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const removeBookMutation = useRemoveBookFromClass();

  const coverSrc = resolveAssetUrl(book.cover_image);

  const btnRef = useRef<HTMLButtonElement>(null);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!classroomId) return;

    setMenuOpen(false);
    const toastId = toast.loading("Menghapus buku dari kelas...");

    removeBookMutation.mutate(
      { classId: classroomId, bookId: book.id },
      {
        onSuccess: () => {
          toast.success("Buku berhasil dihapus dari kelas!", {
            id: toastId,
            duration: 3000,
          });
        },
        onError: (err) => {
          const apiError = err as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          toast.error(
            apiError.response?.data?.message ||
              apiError.message ||
              "Gagal menghapus buku dari kelas.",
            {
              id: toastId,
              duration: 4000,
            },
          );
        },
      },
    );
  };

  const formattedDate = new Date(book.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!menuOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(false);
    onEdit?.(book);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(false);
    onDelete?.(book);
  };

  // Close on outside click — use mousedown so it fires before the click
  // event that opened the menu has finished bubbling, preventing instant close.
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (menuRef.current?.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    const id = setTimeout(() => {
      document.addEventListener("click", handler, true);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", handler, true);
    };
  }, [menuOpen]);

  const hasMenuActions = Boolean(
    onEdit || onDelete || (showMenu && classroomId),
  );

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col justify-between overflow-hidden group 
                 rounded-xl bg-card 
                 border border-border hover:border-primary/40 
                 transition-colors min-h-[200px] sm:min-h-[320px]
                 hover:-translate-y-1 cursor-pointer"
    >
      {/* Ambient effects */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Three-dot button — inside card, z-20 */}
      {hasMenuActions && (
        <button
          ref={btnRef}
          type="button"
          onClick={toggleMenu}
          className="absolute top-3 right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-background/50 border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-300 cursor-pointer"
        >
          <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}

      {/* Dropdown via portal — never clipped */}
      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed w-44 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ top: menuPos.top, right: menuPos.right, zIndex: 9999 }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-foreground hover:bg-primary/20 transition-colors text-left cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-primary" />
                <span>Edit Buku</span>
              </button>
            )}
            {onEdit && (onDelete || (showMenu && classroomId)) && (
              <div className="w-full h-px bg-border" />
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Buku</span>
              </button>
            )}
            {showMenu && classroomId && (
              <button
                type="button"
                onClick={handleRemove}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus dari Kelas</span>
              </button>
            )}
          </div>,
          document.body,
        )}

      {/* Physical book cover */}
      <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_25%,rgba(239,105,5,0.16),transparent_68%)] sm:h-56">
        <div className="absolute inset-x-5 bottom-3 h-2 rounded-full bg-black/15 blur-sm" />
        <div className="absolute inset-x-0 bottom-0 h-5 border-t border-[#d8c7ae] bg-[linear-gradient(180deg,#eadfce_0%,#cdb99d_100%)] dark:border-[#51483d] dark:bg-[linear-gradient(180deg,#51483d_0%,#302a24_100%)]" />
        <BookCoverVisual
          src={coverSrc}
          title={book.title}
          author={book.owner_name}
          className="h-24 w-[4.25rem] sm:h-44 sm:w-32"
        />
      </div>

      {/* Body */}
      <div className="p-3 sm:p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
        <div className="mb-2 sm:mb-6">
          <div className="flex items-center gap-2 mb-1 sm:mb-3">
            <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-surface-1 border border-border text-[8px] sm:text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 sm:gap-1.5 w-max">
              {book.status === "draft" ? (
                <>
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-sm bg-warning/80" />
                  <span className="text-warning/90">Draft</span>
                </>
              ) : (
                <>
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-sm bg-success/80" />
                  <span className="text-success/90">Published</span>
                </>
              )}
            </div>
          </div>

          <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1 sm:mb-2 leading-tight group-hover:text-foreground transition-colors line-clamp-2 pr-6">
            {book.title}
          </h3>
          <p className="hidden sm:block text-sm text-muted-foreground/90 leading-relaxed font-light line-clamp-2">
            {book.description ||
              "Tidak ada sinopsis atau deskripsi untuk kitab ini."}
          </p>
        </div>

        {/* Stats — desktop only */}
        <div className="hidden sm:flex justify-between items-center bg-surface-1 border border-border rounded-xl p-4 mb-5">
          <div className="flex flex-col items-center flex-1">
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">
              Total
            </div>
            <span className="text-xl font-black text-foreground">0</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-[9px] text-primary/70 font-bold uppercase tracking-widest mb-1">
              Aktif
            </div>
            <span className="text-xl font-black text-primary">0</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-[9px] text-success/70 font-bold uppercase tracking-widest mb-1">
              Lulus
            </div>
            <span className="text-xl font-black text-success">0</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center mt-auto">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
