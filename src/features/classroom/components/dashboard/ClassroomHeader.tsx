import type { ReactNode } from "react";
import { BookOpen, GraduationCap, Layers, Users } from "lucide-react";

type ClassroomHeaderProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  totalClasses?: number;
  totalStudents?: number;
  totalBooks?: number;
  activeReviews?: number;
  action?: ReactNode;
};

export const ClassroomHeader = ({
  title = "Ruang Kelas",
  subtitle = "Kelola kelas, pantau progres siswa, dan susun materi belajar dalam satu tempat.",
  eyebrow = "Classroom",
  totalClasses = 0,
  totalStudents = 0,
  totalBooks = 0,
  activeReviews = 0,
  action,
}: ClassroomHeaderProps) => {
  const stats = [
    {
      label: "Kelas",
      value: totalClasses,
      icon: GraduationCap,
      color: "text-emerald-300",
    },
    {
      label: "Siswa",
      value: totalStudents,
      icon: Users,
      color: "text-blue-300",
    },
    {
      label: "Kitab",
      value: totalBooks,
      icon: BookOpen,
      color: "text-amber-300",
    },
    {
      label: "Review",
      value: activeReviews,
      icon: Layers,
      color: "text-violet-300",
    },
  ];

  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#151D2A] via-[#101722] to-[#080B10] p-5 text-white shadow-[0_24px_70px_-42px_rgba(0,0,0,0.95)] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-blue-400" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/8 blur-[90px]" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            {eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">
            {subtitle}
          </p>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-white/5 bg-white/4 px-4 py-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {item.label}
                </p>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className="text-2xl font-black leading-none text-white">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </header>
  );
};
