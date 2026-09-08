import type { ReactNode } from "react";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  Play,
  RotateCcw,
  Brain,
  Trophy,
} from "lucide-react";
import { SURAH_NAMES } from "@/features/alquran/constants/surahList";
import { convertPageRangeToSurahLabel } from "@/features/alquran/utils/pageToSurahConverter";

export const PHASES = [
  "menghafal",
  "terjaga",
  "graduate",
] as const;
export const PHASES_STATUS = [
  "menghafal",
  "fsrs_active",
  "graduate",
] as const;

export type ActionPhase = (typeof PHASES)[number];
export type ActionPhaseStatus = (typeof PHASES_STATUS)[number];

export interface ActionConfig {
  label: string;
  labelSecondary?: string;
  description: string;
  icon: ReactNode;
  iconSecondary?: ReactNode;
  buttonClass: string;
  buttonSecondaryClass?: string;
  sectionTitle: string;
  href?: string;
}

export interface StatusDisplay {
  title: string;
  icon: ReactNode;
  iconBg: string;
  description: string;
}

export interface ParsedContentRef {
  type: "surah" | "page";
  title: string;
  subtitle: string;
  range: string;
}

export interface StatusStyle {
  label: string;
  className: string;
}

const ACTION_CONFIG: Record<ActionPhase, ActionConfig> = {
  menghafal: {
    sectionTitle: "Konfirmasi Hafalan",
    description:
      "Sebelum memulai ujian FSRS, konfirmasi dulu bahwa kamu sudah hafal bagian ini dengan baik.",
    label: "Sudah Hafal",
    icon: <CheckCircle className="w-5 h-5" />,
    buttonClass: "bg-primary text-primary-foreground",
  },
  terjaga: {
    sectionTitle: "Mode Ujian FSRS Aktif",
    description:
      "Bagus, hafalan ini sekarang sedang di mode ujian FSRS. Lanjut ke langkah berikutnya untuk melihat ringkasan penyelesaian fase ini.",
    label: "Lanjut ke Langkah 3",
    icon: <ArrowRight className="w-5 h-5" />,
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  graduate: {
    sectionTitle: "Selamat! Anda Telah Menyelesaikan Fase Ini",
    description:
      "Alhamdulillah, hafalan ini telah selesai dan mencapai tingkat kelulusan. Pertahankan konsistensi murajaah agar hafalan tetap melekat selamanya.",
    label: "Selesai",
    href: "/dashboard/alquran",
    icon: <Trophy className="w-5 h-5" />,
    buttonClass: "bg-primary text-primary-foreground",
  },
};

const STATUS_DISPLAY_CONFIG: Record<ActionPhaseStatus, StatusDisplay> = {
  menghafal: {
    title: "Fase Menghafal",
    icon: <Brain className="w-12 h-12 text-warning" />,
    iconBg: "bg-warning/10 border-warning/20",
    description:
      "Item ini masih dalam tahap hafalan awal. Fokuslah untuk mengulang-ulang bacaan secara berkesinambungan hingga lancar tanpa melihat mushaf.",
  },
  fsrs_active: {
    title: "Fase Ujian FSRS",
    icon: <RotateCcw className="w-12 h-12 text-success" />,
    iconBg: "bg-success/10 border-success/20",
    description:
      "Hafalan ini sudah masuk ke jadwal ujian FSRS berkala. Lakukan review rutin tepat waktu ketika jadwalnya tiba agar hafalan tetap terjaga seumur hidup.",
  },
  graduate: {
    title: "Fase Selesai",
    icon: <Trophy className="w-12 h-12 text-primary" />,
    iconBg: "bg-primary/10 border-primary/20",
    description:
      "Alhamdulillah! Anda telah menyelesaikan fase hafalan ini dengan sukses. Terus pertahankan dengan murajaah rutin agar hafalan tetap melekat.",
  },
};

export function getInitialPhase(status: string): ActionPhase {
  switch (status) {
    case "new":
    case "menghafal":
      return "menghafal";
    case "interval":
    case "fsrs_active":
      return "terjaga";
    case "graduate":
      return "graduate";
    default:
      return "menghafal";
  }
}

export function getActionConfig(phase: ActionPhase): ActionConfig {
  return ACTION_CONFIG[phase];
}

export function getStatusDisplay(status: string): StatusDisplay {
  if (["new", "menghafal"].includes(status)) {
    return STATUS_DISPLAY_CONFIG.menghafal;
  }

  if (
    ["maintenance", "terjaga", "graduated", "active", "fsrs_active", "interval", "consolidation", "interval_start"].includes(
      status,
    )
  ) {
    return STATUS_DISPLAY_CONFIG.fsrs_active;
  }

  return STATUS_DISPLAY_CONFIG.menghafal;
}

export function getStatusDisplayByPhase(phase: ActionPhase): StatusDisplay {
  switch (phase) {
    case "menghafal":
      return STATUS_DISPLAY_CONFIG.menghafal;
    case "terjaga":
      return STATUS_DISPLAY_CONFIG.fsrs_active;
    case "graduate":
      return STATUS_DISPLAY_CONFIG.graduate;
    default:
      return STATUS_DISPLAY_CONFIG.menghafal;
  }
}

export function parseContentRef(contentRef?: string | null): ParsedContentRef {
  if (!contentRef) {
    return {
      type: "page",
      title: "Item belum lengkap",
      subtitle: "",
      range: "?",
    };
  }

  const parts = contentRef.split(":");

  if (parts[0] === "surah") {
    const surahId = Number.parseInt(parts[1], 10);
    const surahName =
      !Number.isNaN(surahId) && SURAH_NAMES[surahId - 1]
        ? SURAH_NAMES[surahId - 1]
        : parts[1] || "Unknown";
    const [start, end] = (parts[2] || "?").split("-");

    return {
      type: "surah",
      title: surahName,
      subtitle: `Ayat ${start} – ${end}`,
      range: parts[2] || "?",
    };
  }

  // Handle page mode - use converter for rich label
  if (parts[0] === "page" && parts[1]) {
    const pageRange = `page:${parts[1]}`;
    const convertedLabel = convertPageRangeToSurahLabel(pageRange);

    // Split hanya di " - " pertama
    const dashIndex = convertedLabel.indexOf(" - ");
    const pagePart = convertedLabel.substring(0, dashIndex);
    const surahPart = convertedLabel.substring(dashIndex + 3); // ambil sisanya semua

    return {
      type: "page",
      title: surahPart || pagePart,
      subtitle: pagePart,
      range: parts[1],
    };
  }

  const [start, end] = (parts[1] || "?").split("-");
  return {
    type: "page",
    title: `Halaman ${start}`,
    subtitle: end && end !== start ? `s/d Halaman ${end}` : "Mushaf",
    range: parts[1] || "?",
  };
}

export function getStatusStyle(status: string): StatusStyle {
  switch (status) {
    case "menghafal":
      return {
        label: "Menghafal",
        className: "bg-success/10 border-success/20 text-success",
      };
    case "interval":
      return {
        label: "Latihan Interval",
        className: "bg-warning/10 border-warning/20 text-warning",
      };
    case "fsrs_active":
      return {
        label: "Ujian FSRS",
        className: "bg-info/10 border-info/20 text-info",
      };
    case "graduate":
      return {
        label: "Selesai",
        className: "bg-primary/10 border-primary/20 text-primary",
      };
    default:
      return {
        label: status,
        className: "bg-surface-1 border-border text-muted-foreground",
      };
  }
}

export function getStatusStyleByPhase(phase: ActionPhase): StatusStyle {
  switch (phase) {
    case "menghafal":
      return {
        label: "Menghafal",
        className: "bg-warning/10 border-warning/20 text-warning",
      };
    case "terjaga":
      return {
        label: "Ujian FSRS",
        className: "bg-success/10 border-success/20 text-success",
      };
    case "graduate":
      return {
        label: "Selesai",
        className: "bg-primary/10 border-primary/20 text-primary",
      };
    default:
      return {
        label: "Menghafal",
        className: "bg-warning/10 border-warning/20 text-warning",
      };
  }
}
