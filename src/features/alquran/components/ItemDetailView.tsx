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
    sectionTitle: "Lakukan Review",
    description:
      "Saatnya mengulang hafalan! Buka sesi review untuk memperkuat ingatan kamu.",
    label: "Mulai Review",
    icon: <RotateCcw className="w-5 h-5" />,
    buttonClass:
      "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-blue-900/20 hover:shadow-blue-500/30",
  },
};

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
        console.log("Review dimulai untuk item:", item.item_id);
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
            Ditambahkan
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
      <div className="p-6 rounded-3xl bg-white/3 border border-white/10 space-y-4">
        {/* Progress indicator — menunjukkan user ada di mana */}
        <div className="flex items-center gap-2 mb-2">
          {(["menghafal", "interval", "fsrs_active"] as ActionPhase[]).map(
            (s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    s === phase
                      ? "bg-amber-400 scale-125"
                      : (
                            [
                              "menghafal",
                              "interval",
                              "fsrs_active",
                            ] as ActionPhase[]
                          ).indexOf(phase) > i
                        ? "bg-green-500"
                        : "bg-white/20"
                  }`}
                />
                {i < 2 && (
                  <div
                    className={`h-px w-6 transition-colors duration-500 ${
                      (
                        [
                          "menghafal",
                          "interval",
                          "fsrs_active",
                        ] as ActionPhase[]
                      ).indexOf(phase) > i
                        ? "bg-green-500"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ),
          )}
          <span className="ml-2 text-xs text-gray-500 font-medium">
            {phase === "menghafal" && "Langkah 1 dari 3"}
            {phase === "interval" && "Langkah 2 dari 3"}
            {phase === "fsrs_active" && "Langkah 3 dari 3"}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500/60" />
            <h2 className="text-lg font-bold text-white">
              {config.sectionTitle}
            </h2>
          </div>
          <p className="text-sm text-gray-400">{config.description}</p>
        </div>

        {/* Tombol yang berubah sesuai state */}
        <button
          onClick={handleActionClick}
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all ${config.buttonClass}`}
        >
          <div className="p-1.5 bg-black/20 rounded-full">{config.icon}</div>
          {config.label}
        </button>
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
