import { Link, useLocation } from "react-router";
import { GraduationCap, User, Clock } from "lucide-react";

const getRoomMeta = (pathname: string) => {
  if (pathname.includes("/kelas")) {
    return {
      label: "Ruang Kelas",
      subtitle: "Pembelajaran terstruktur & akademis sedang kami siapkan.",
      badge: "Segera Hadir",
      icon: <GraduationCap className="w-10 h-10 text-blue-400" />,
      accent: "blue",
    } as const;
  }

  if (pathname.includes("/pribadi")) {
    return {
      label: "Ruang Pribadi",
      subtitle: "Ruang belajar personal dengan materi pilihan Anda.",
      badge: "Segera Hadir",
      icon: <User className="w-10 h-10 text-purple-400" />,
      accent: "purple",
    } as const;
  }

  return {
    label: "Ruang Belajar",
    subtitle: "Ruang ini sedang dalam pengembangan.",
    badge: "Segera Hadir",
    icon: <Clock className="w-10 h-10 text-amber-400" />,
    accent: "amber",
  } as const;
};

export const ComingSoonRoomPage = () => {
  const location = useLocation();
  const { label, subtitle, badge, icon, accent } = getRoomMeta(location.pathname);

  return (
    <div className="min-h-screen bg-deep-universe text-white font-sans selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-amber-300">
              {badge}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-start gap-6">
              <div
                className={`w-16 h-16 rounded-2xl bg-${accent}-500/10 border border-${accent}-500/30 flex items-center justify-center`}
              >
                {icon}
              </div>

              <div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide mb-3">
                  {label}{" "}
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-300 via-amber-400 to-amber-500">
                    Segera Hadir
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-gray-300 mb-4 max-w-xl">
                  {subtitle} Tim UNLUPA sedang meracik pengalaman belajar yang
                  nyaman, fokus, dan relevan dengan kebutuhan Anda.
                </p>

                <p className="text-xs text-gray-400">
                  Sambil menunggu, Anda dapat tetap melanjutkan hafalan di{" "}
                  <span className="text-emerald-300 font-medium">Ruang Al-Qur&apos;an</span>{" "}
                  atau kembali ke beranda dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[220px]">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-900 text-sm font-semibold shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition"
              >
                Kembali ke Dashboard
              </Link>

              <Link
                to="/dashboard/alquran"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-sm text-gray-100 hover:bg-white/5 transition"
              >
                Buka Ruang Al-Qur&apos;an
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

