import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  GraduationCap,
  Layers,
  MoreVertical,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { ClassroomCardProps } from "@/features/classroom/types/index";

import { toneStyles, statusLabel } from "@/features/classroom/constants/index";

export const ClassroomCard = ({
  title,
  description,
  teacherName,
  memberCount,
  bookCount,
  activeReviewCount,
  nextSessionLabel = "Belum dijadwalkan",
  status = "active",
  tone = "blue",
  coverImage,
  onClick,
  onMenuClick,
}: ClassroomCardProps) => {
  const theme = toneStyles[tone];

  return (
    <article
      onClick={onClick}
      className={`group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-linear-to-b from-[#1A2230] to-[#0B0E14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 hover:-translate-y-1 hover:border-white/12 hover:shadow-2xl ${theme.glow} ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`absolute inset-x-0 top-0 z-20 h-1 bg-linear-to-r ${theme.accent}`}
      />

      <div className="absolute -right-16 -top-20 z-0 h-56 w-56 rounded-full bg-white/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-16 left-0 z-0 h-48 w-48 rounded-full bg-white/4 blur-[90px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />

      <div className="relative h-44 shrink-0 overflow-hidden border-b border-white/5 bg-[#0A0D14] sm:h-48">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-linear-to-br from-white/4 via-transparent to-white/6 ${theme.softBg}`}
          >
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#111722] to-transparent pointer-events-none" />
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/8 blur-[70px] pointer-events-none" />
            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border ${theme.border} ${theme.iconBg} shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2 sm:h-28 sm:w-28`}
            >
              <GraduationCap className={`h-12 w-12 ${theme.text} sm:h-14 sm:w-14`} />
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#111722] via-[#111722]/45 to-transparent pointer-events-none" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${theme.border} ${theme.softBg} ${theme.text}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabel[status]}
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMenuClick?.();
          }}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/35 text-gray-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
          aria-label="Buka menu kelas"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${theme.border} ${theme.iconBg}`}
          >
            <GraduationCap className={`h-5 w-5 ${theme.text}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Pengajar
            </p>
            <p className="truncate text-sm font-semibold text-gray-300">
              {teacherName}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="mb-2 line-clamp-2 text-xl font-black leading-tight text-white transition-colors group-hover:text-blue-50">
            {title}
          </h3>
          <p className="line-clamp-2 min-h-[44px] text-sm leading-relaxed text-gray-400">
            {description || "Belum ada deskripsi kelas."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white/5 bg-white/4 p-3">
            <Users className="mb-2 h-4 w-4 text-gray-500" />
            <p className="text-lg font-black leading-none text-white">
              {memberCount}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Siswa
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/4 p-3">
            <BookOpen className="mb-2 h-4 w-4 text-gray-500" />
            <p className="text-lg font-black leading-none text-white">
              {bookCount}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Kitab
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/4 p-3">
            <Layers className="mb-2 h-4 w-4 text-gray-500" />
            <p className="text-lg font-black leading-none text-white">
              {activeReviewCount}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Review
            </p>
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-white/5 bg-[#0F141D] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
            <CalendarClock className={`h-4 w-4 ${theme.text}`} />
            <span className="truncate">{nextSessionLabel}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Progress kelas terpantau</span>
            </div>
            <ChevronRight
              className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 ${theme.text}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
};
