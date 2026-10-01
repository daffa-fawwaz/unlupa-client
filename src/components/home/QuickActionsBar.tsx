import type { ElementType } from "react";
import { ArrowUpRight, Award, CalendarDays, FolderDown, Share2, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { downloadDatabaseBackup } from "../../lib/offlineStorage";

interface Props {
  onOpenReport: () => void;
  onOpenAchievementModal: () => void;
  onOpenAttendanceModal: () => void;
}

type QuickAction = {
  id: string;
  labelEn: string;
  labelId: string;
  descEn: string;
  descId: string;
  badge: string;
  icon: ElementType;
  cardStyle: string;
  iconStyle: string;
  onClick: () => void;
};

export const QuickActionsBar = ({
  onOpenReport,
  onOpenAchievementModal,
  onOpenAttendanceModal,
}: Props) => {
  const { language } = useApp();

  const handleBackup = () => {
    try {
      downloadDatabaseBackup();
    } catch (error) {
      console.error("Failed to export database backup", error);
    }
  };

  const actions: QuickAction[] = [
    {
      id: "report",
      labelEn: "Progress Report",
      labelId: "Rapor Progres",
      descEn: "Share your learning summary",
      descId: "Bagikan ringkasan pembelajaran",
      badge: "PDF",
      icon: Share2,
      cardStyle: "from-brand-50 to-orange-100/70 hover:border-brand/50",
      iconStyle: "bg-brand-solid text-white",
      onClick: onOpenReport,
    },
    {
      id: "cert",
      labelEn: "Certificate Generator",
      labelId: "Cetak Sertifikat",
      descEn: "Create a printable certificate",
      descId: "Buat sertifikat siap cetak",
      badge: "HD",
      icon: Award,
      cardStyle: "from-amber-50 to-yellow-100/70 hover:border-amber-400/70",
      iconStyle: "bg-amber-600 text-white",
      onClick: onOpenAchievementModal,
    },
    {
      id: "attendance",
      labelEn: "Attendance Log",
      labelId: "Riwayat Kehadiran",
      descEn: "Review attendance and permits",
      descId: "Lihat rekap kehadiran dan izin",
      badge: "LOG",
      icon: CalendarDays,
      cardStyle: "from-blue-50 to-cyan-100/70 hover:border-blue-400/70",
      iconStyle: "bg-blue-600 text-white",
      onClick: onOpenAttendanceModal,
    },
    {
      id: "backup",
      labelEn: "Backup Database",
      labelId: "Cadangkan Data",
      descEn: "Export your offline data archive",
      descId: "Ekspor arsip data offline",
      badge: "JSON",
      icon: FolderDown,
      cardStyle: "from-emerald-50 to-teal-100/70 hover:border-emerald-400/70",
      iconStyle: "bg-emerald-600 text-white",
      onClick: handleBackup,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand-700" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              {language === "en" ? "Quick Tools & Exports" : "Fitur Cepat & Utilitas"}
            </h3>
          </div>
          <p className="mt-1 text-xs text-secondary">
            {language === "en" ? "Reports, records, and your learning data" : "Rapor, catatan, dan data pembelajaranmu"}
          </p>
        </div>
        <span className="hidden rounded-full border border-secondary bg-secondary px-2.5 py-1 text-xs font-medium text-secondary sm:inline-flex">
          {actions.length} tools
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              aria-label={language === "en" ? action.labelEn : action.labelId}
              title={language === "en" ? action.labelEn : action.labelId}
              className={`group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-secondary bg-gradient-to-br p-2 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] sm:block sm:aspect-auto sm:min-h-44 sm:rounded-3xl sm:p-5 sm:text-left ${action.cardStyle}`}
            >
              <div className="relative flex items-center justify-center sm:items-start sm:justify-between sm:gap-3">
                <div className={`flex size-11 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105 ${action.iconStyle}`}>
                  <Icon className="size-5" />
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full border border-black/5 bg-white/70 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-600 backdrop-blur-sm">
                    {action.badge}
                  </span>
                  <ArrowUpRight className="size-4 text-slate-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>

              <div className="relative mt-8 hidden sm:block">
                <p className="text-base font-semibold tracking-tight text-slate-950">
                  {language === "en" ? action.labelEn : action.labelId}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {language === "en" ? action.descEn : action.descId}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
