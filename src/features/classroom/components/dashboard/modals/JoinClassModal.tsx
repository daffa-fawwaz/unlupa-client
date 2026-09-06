import { createPortal } from "react-dom";
import { X, GraduationCap, Users, BookOpen, Sparkles } from "lucide-react";
import { resolveAssetUrl } from "@/lib/assets";

export interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  classPreview?: {
    title: string;
    description: string;
    teacherName: string;
    memberCount: number;
    bookCount: number;
    coverImage?: string;
  };
}

export const JoinClassModal = ({
  isOpen,
  onClose,
  onJoin,
  classPreview,
}: JoinClassModalProps) => {
  if (!isOpen) return null;

  // Dummy data if none provided
  const data = classPreview || {
    title: "Kelas Tahsin & Tajwid Al-Quran",
    description:
      "Program intensif pembelajaran tahsin dan tajwid dasar hingga mahir. Cocok untuk semua kalangan yang ingin memperbaiki bacaan Al-Quran.",
    teacherName: "Ust. Fulan bin Fulan",
    memberCount: 124,
    bookCount: 3,
    coverImage: "",
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header Background */}
        <div className="relative h-32 sm:h-40 shrink-0 overflow-hidden bg-surface-1">
          {data.coverImage ? (
            <img
              src={resolveAssetUrl(data.coverImage)}
              alt={data.title}
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-info/20 via-primary/10 to-transparent">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-info/20 blur-[60px]" />
              <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-primary/20 blur-[60px]" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-card to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative px-6 pb-8 sm:px-8">
          {/* Icon overlap */}

          <div className="mt-4">
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-info">
                <Sparkles className="h-3.5 w-3.5" />
                Preview Kelas
              </div>
              <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
                {data.title}
              </h2>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {data.description || "Belum ada deskripsi untuk kelas ini."}
            </p>

            <div className="mb-8 rounded-2xl border border-border bg-surface-1 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-1">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Pengajar
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {data.teacherName}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-border pt-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Siswa
                    </p>
                    <p className="font-black text-foreground">{data.memberCount}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Kitab
                    </p>
                    <p className="font-black text-foreground">{data.bookCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-border bg-transparent px-4 py-3.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-surface-2 sm:w-auto"
              >
                Batal
              </button>
              <button
                onClick={onJoin}
                className="w-full flex-1 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:-translate-y-0.5"
              >
                Gabung Kelas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
