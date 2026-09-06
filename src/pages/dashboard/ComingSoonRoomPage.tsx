import { Link, useLocation } from "react-router";
import { GraduationCap, User, Clock } from "lucide-react";

const getRoomMeta = (pathname: string) => {
  if (pathname.includes("/kelas")) {
    return {
      label: "Ruang Kelas",
      subtitle: "Pembelajaran terstruktur & akademis sedang kami siapkan.",
      badge: "Segera Hadir",
      icon: <GraduationCap className="w-10 h-10 text-primary" />,
    } as const;
  }

  if (pathname.includes("/pribadi")) {
    return {
      label: "Ruang Pribadi",
      subtitle: "Ruang belajar personal dengan materi pilihan Anda.",
      badge: "Segera Hadir",
      icon: <User className="w-10 h-10 text-primary" />,
    } as const;
  }

  return {
    label: "Ruang Belajar",
    subtitle: "Ruang ini sedang dalam pengembangan.",
    badge: "Segera Hadir",
    icon: <Clock className="w-10 h-10 text-primary" />,
  } as const;
};

export const ComingSoonRoomPage = () => {
  const location = useLocation();
  const { label, subtitle, badge, icon } = getRoomMeta(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-warning animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-warning">
              {badge}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                {icon}
              </div>

              <div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide mb-3">
                  {label} <span className="text-primary">Segera Hadir</span>
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-xl">
                  {subtitle} Tim UNLUPA sedang meracik pengalaman belajar yang
                  nyaman, fokus, dan relevan dengan kebutuhan Anda.
                </p>

                <p className="text-xs text-muted-foreground">
                  Sambil menunggu, Anda dapat tetap melanjutkan hafalan di{" "}
                  <span className="text-success font-medium">Ruang Al-Qur&apos;an</span>{" "}
                  atau kembali ke beranda dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[220px]">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
              >
                Kembali ke Dashboard
              </Link>

              <Link
                to="/dashboard/alquran"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm text-foreground hover:bg-surface-1 transition"
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

