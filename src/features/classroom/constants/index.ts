import type { ClassroomCardTone } from "@/features/classroom/types/index";

export const toneStyles: Record<
  ClassroomCardTone,
  {
    accent: string;
    softBg: string;
    border: string;
    text: string;
    iconBg: string;
    glow: string;
  }
> = {
  blue: {
    accent: "from-blue-500 to-cyan-400",
    softBg: "bg-blue-500/10",
    border: "border-blue-500/25",
    text: "text-blue-300",
    iconBg: "bg-blue-500/15",
    glow: "group-hover:shadow-blue-500/10",
  },
  emerald: {
    accent: "from-emerald-500 to-teal-400",
    softBg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    text: "text-emerald-300",
    iconBg: "bg-emerald-500/15",
    glow: "group-hover:shadow-emerald-500/10",
  },
  amber: {
    accent: "from-amber-500 to-orange-400",
    softBg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-300",
    iconBg: "bg-amber-500/15",
    glow: "group-hover:shadow-amber-500/10",
  },
  violet: {
    accent: "from-violet-500 to-fuchsia-400",
    softBg: "bg-violet-500/10",
    border: "border-violet-500/25",
    text: "text-violet-300",
    iconBg: "bg-violet-500/15",
    glow: "group-hover:shadow-violet-500/10",
  },
};

export const statusLabel = {
  active: "Aktif",
  draft: "Draft",
  archived: "Arsip",
};
