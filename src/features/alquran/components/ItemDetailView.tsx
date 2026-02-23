import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Layers,
  CalendarDays,
  BarChart2,
  RotateCcw,
  Sparkles,
  Brain,
} from "lucide-react";
import type { MyItemDetail } from "@/features/alquran/types/quran.types";
import { SURAH_NAMES } from "@/features/alquran/constants/surahList";
import { StartIntervalModal } from "@/features/alquran/components/StartIntervalModal";

export type ActionPhase = "menghafal" | "interval" | "fsrs_active";

function getInitialPhase(status: string): ActionPhase {
  switch (status) {
    case "new":
    case "menghafal":
      return "menghafal";
    case "consolidation":
    case "interval":
      return "fsrs_active";
    case "maintenance":
    case "fsrs_active":
      return "fsrs_active";
    default:
      return "menghafal";
  }
}
const ACTION_CONFIG: Record<
  ActionPhase,
  {
    label: string;
    description: string;
    icon: React.ReactNode;
    buttonClass: string;
    sectionTitle: string;
    href?: string;
  }
> = {
  menghafal: {
    sectionTitle: "Konfirmasi Hafalan",
    description:
      "Sebelum memulai murajaah, konfirmasi dulu bahwa kamu sudah hafal bagian ini dengan baik.",
    label: "Sudah Hafal",
    icon: <CheckCircle className="w-5 h-5" />,
    buttonClass:
      "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-emerald-900/20 hover:shadow-emerald-500/30",
  },
  interval: {
    sectionTitle: "Mulai Murajaah",
    description:
      "Atur jadwal pengulangan hafalan. Kamu akan diingatkan sesuai interval yang dipilih.",
    label: "Mulai Murajaah",
    icon: <Play className="w-5 h-5 fill-current" />,
    buttonClass:
      "bg-linear-to-r from-amber-500 to-orange-600 text-black shadow-amber-900/20 hover:shadow-amber-500/30",
  },
  fsrs_active: {
    sectionTitle: "Masa Murajaah",
    href: "/alquran",
    description:
      "Kamu sedang dalam masa murajaah, item ini akan diulang sesuai interval yang telah ditentukan.",
    label: "Review",
    icon: <RotateCcw className="w-5 h-5" />,
    buttonClass:
      "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-blue-900/20 hover:shadow-blue-500/30",
  },
};

const STATUS_DISPLAY_CONFIG = {
  menghafal: {
    title: "Fase Menghafal",
    icon: <Brain className="w-12 h-12 text-amber-400" />,
    iconBg: "bg-amber-500/10 border-amber-500/20 shadow-amber-500/20",
    description:
      "Item ini masih dalam tahap hafalan awal. Fokuslah untuk mengulang-ulang bacaan secara berkesinambungan hingga lancar tanpa melihat mushaf.",
  },
  interval: {
    title: "Fase Transisi",
    icon: <Clock className="w-12 h-12 text-blue-400" />,
    iconBg: "bg-blue-500/10 border-blue-500/20 shadow-blue-500/20",
    description:
      "Mantap! Hafalan sudah dikonfirmasi. Saat ini sedang mengatur jadwal murajaah agar ingatan tidak pudar.",
  },
  fsrs_active: {
    title: "Fase Murajaah",
    icon: <RotateCcw className="w-12 h-12 text-emerald-400" />,
    iconBg: "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20",
    description:
      "Hafalan ini sudah masuk ke jadwal murajaah berkala FSRS. Lakukan review rutin tepat waktu ketika jadwalnya tiba agar hafalan tetap terjaga seumur hidup.",
  },
};

function getStatusDisplay(status: string) {
  if (["new", "menghafal"].includes(status))
    return STATUS_DISPLAY_CONFIG.menghafal;
  if (["consolidation", "interval"].includes(status))
    return STATUS_DISPLAY_CONFIG.interval;
  if (["maintenance", "fsrs_active", "graduated", "active"].includes(status))
    return STATUS_DISPLAY_CONFIG.fsrs_active;
  return STATUS_DISPLAY_CONFIG.menghafal;
}

function parseContentRef(contentRef: string) {
  const parts = contentRef.split(":");
  if (parts[0] === "surah") {
    const surahId = parseInt(parts[1]);
    const surahName =
      !isNaN(surahId) && SURAH_NAMES[surahId - 1]
        ? SURAH_NAMES[surahId - 1]
        : parts[1] || "Unknown";
    const [start, end] = (parts[2] || "?").split("-");
    return {
      type: "surah" as const,
      title: surahName,
      subtitle: `Ayat ${start} – ${end}`,
      range: parts[2] || "?",
    };
  } else {
    const [start, end] = (parts[1] || "?").split("-");
    return {
      type: "page" as const,
      title: `Halaman ${start}`,
      subtitle: end && end !== start ? `s/d Halaman ${end}` : "Mushaf",
      range: parts[1] || "?",
    };
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "active":
      return {
        label: "Aktif",
        className:
          "bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.1)]",
      };
    case "memorizing":
      return {
        label: "Menghafal",
        className:
          "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.1)]",
      };
    case "consolidation":
      return {
        label: "Konsolidasi",
        className:
          "bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.1)]",
      };
    case "graduated":
      return {
        label: "Lulus",
        className:
          "bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.1)]",
      };
    default:
      return {
        label: status,
        className: "bg-gray-500/10 border-gray-500/20 text-gray-400",
      };
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ItemDetailViewProps {
  item: MyItemDetail;
  juzIndex: number;
  backToJuzDetail: () => void;
  // currentPhase: phase yang disimpan parent (persistent antar navigasi)
  // Kalau undefined, kita derive dari item.status
  currentPhase?: ActionPhase;
  // onPhaseChange: callback supaya parent bisa simpan phase terbaru
  onPhaseChange: (phase: ActionPhase) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ItemDetailView = ({
  item,
  juzIndex,
  backToJuzDetail,
  currentPhase,
  onPhaseChange,
}: ItemDetailViewProps) => {
  // Controlled Phase: kita tidak pakai state lokal lagi.
  // Phase sekarang sepenuhnya dikendalikan oleh parent (AlquranPage).
  // Jika parent belum punya data (misal: baru buka item ini), kita pakai fallback.
  const phase = currentPhase ?? getInitialPhase(item.status);

  // Helper: langsung panggil parent untuk update state
  const transitionTo = (newPhase: ActionPhase) => {
    onPhaseChange(newPhase);
  };

  // Modal start interval hanya muncul di phase "start_interval"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const info = parseContentRef(item.content_ref);
  const statusStyle = getStatusStyle(item.status);
  const config = ACTION_CONFIG[phase];
  const currentStatusDisplay = getStatusDisplay(item.status);

  const createdDate = new Date(item.created_at).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handler utama tombol — logika transisi state ada di sini
  // Ini adalah "mesin" dari state machine kita.
  const handleActionClick = () => {
    switch (phase) {
      case "menghafal":
        transitionTo("interval");
        break;
      case "interval":
        setIsModalOpen(true);
        break;
      case "fsrs_active":
        if (config.href) {
          window.location.href = config.href;
        } else {
          console.log("Review dimulai untuk item:", item.item_id);
        }
        break;
    }
  };

  const handleIntervalSuccess = () => {
    transitionTo("fsrs_active");
  };

  return (
    <div className="animate-fadeIn pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Back Button & Breadcrumb ── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={backToJuzDetail}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 hover:scale-105 transition-all group backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Juz {juzIndex}</span>
          <span>/</span>
          <span className="text-gray-300">{info.title}</span>
        </div>
      </div>

      {/* ── Hero Card ── */}
      <div className="relative p-8 md:p-10 rounded-[3rem] bg-linear-to-br from-amber-500/15 via-gray-900/60 to-gray-900/80 border border-amber-500/20 overflow-hidden shadow-2xl shadow-amber-500/5 mb-8">
        <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none">
          <BookOpen className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Juz {juzIndex}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight">
            {info.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-lg">
            <Layers className="w-5 h-5 text-amber-500/60" />
            <span>{info.subtitle}</span>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-colors">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-500/60" />
            Total Review
          </div>
          <span className="text-3xl font-mono font-bold text-white">
            {item.review_count}
            <span className="text-base text-gray-500 font-normal ml-1">
              kali
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-colors">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-green-500/60" />
            Ditambahkann
          </div>
          <span className="text-sm font-medium text-gray-300 leading-snug mt-1">
            {createdDate}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-colors">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <BarChart2 className="w-4 h-4 text-blue-500/60" />
            Tipe Hafalan
          </div>
          <span className="text-lg font-bold text-white capitalize">
            {info.type === "surah" ? "Per Surah" : "Per Halaman"}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-colors">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <CalendarDays className="w-4 h-4 text-purple-500/60" />
            Rentang
          </div>
          <span className="text-lg font-mono font-bold text-white">
            {info.range.replace("-", " – ")}
          </span>
        </div>
      </div>

      {/* ── Action Section (State Machine UI) ── */}
      <div className="p-1 rounded-[2.5rem] md:rounded-[3rem] bg-linear-to-b from-white/10 to-white/5 shadow-2xl mb-8 border border-white/5 mx-auto w-full">
        <div className="bg-[#0B0E14] rounded-[2.25rem] md:rounded-[2.75rem] p-5 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden shadow-inner">
          {/* Subtle Background Accent */}
          <div className="absolute -top-32 -right-32 w-64 md:w-96 h-64 md:h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

          {/* BIG STATUS DISPLAY */}
          <div className="relative z-10 flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start text-center md:text-left">
            <div
              className={`w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-[1.5rem] md:rounded-[2rem] border flex items-center justify-center shadow-2xl ${currentStatusDisplay.iconBg} backdrop-blur-md relative group`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] md:rounded-[2rem]" />
              {currentStatusDisplay.icon}
            </div>

            <div className="flex flex-col justify-center py-2 flex-1 w-full">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <span className="text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.25em] uppercase text-gray-400">
                  Status Saat Ini
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 tracking-tight drop-shadow-sm">
                {currentStatusDisplay.title}
              </h2>

              <p className="text-gray-300 leading-relaxed text-sm md:text-lg max-w-2xl bg-white/3 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5 shadow-inner">
                {currentStatusDisplay.description}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* Action Flow */}
          <div className="relative z-10 bg-[#161D26] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 border border-white/5 shadow-2xl">
            {/* Progress indicator — menunjukkan user ada di mana */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mb-6 md:mb-8">
              {(["menghafal", "interval", "fsrs_active"] as ActionPhase[]).map(
                (s, i) => {
                  const isActive = s === phase;
                  const isPast =
                    (
                      ["menghafal", "interval", "fsrs_active"] as ActionPhase[]
                    ).indexOf(phase) > i;

                  return (
                    <div key={s} className="flex items-center gap-2 md:gap-4">
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-500 z-10 ${
                            isActive
                              ? "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-110"
                              : isPast
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/5 text-gray-500 border border-white/10"
                          }`}
                        >
                          {i + 1}
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 rounded-full border-2 md:border-[3px] border-amber-500/30 animate-ping" />
                        )}
                      </div>

                      {i < 2 && (
                        <div
                          className={`h-0.5 w-4 md:w-16 rounded-full transition-colors duration-500 ${
                            isPast ? "bg-emerald-500/50" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                  );
                },
              )}

              <span className="hidden sm:inline-block md:ml-6 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest shadow-inner mt-2 sm:mt-0">
                {phase === "menghafal" && "Langkah 1 dari 3"}
                {phase === "interval" && "Langkah 2 dari 3"}
                {phase === "fsrs_active" && "Langkah 3 dari 3"}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between">
              <div className="flex-1 text-center lg:text-left w-full">
                <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-2 md:mb-3">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  <span className="text-amber-400 text-xs md:text-sm font-bold tracking-wider uppercase">
                    Tindakan Selanjutnya
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">
                  {config.sectionTitle}
                </h3>

                <p className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {config.description}
                </p>
              </div>

              {/* Tombol yang berubah sesuai state */}
              <button
                onClick={handleActionClick}
                className={`shrink-0 w-full lg:w-auto min-w-[200px] md:min-w-[240px] flex items-center justify-center gap-3 md:gap-4 py-4 md:py-5 px-6 md:px-10 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-2xl hover:-translate-y-1 hover:shadow-3xl active:translate-y-0 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group ${config.buttonClass}`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <div className="relative z-10 p-2 md:p-2.5 bg-black/20 rounded-lg md:rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {config.icon}
                </div>
                <span className="relative z-10 text-center">
                  {config.label}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* StartIntervalModal — hanya relevan di phase start_interval */}
      <StartIntervalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={item.item_id}
        itemTitle={`${info.title} – ${info.subtitle}`}
        onSuccess={handleIntervalSuccess}
      />
    </div>
  );
};
