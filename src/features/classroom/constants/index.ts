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
  rose: {
    accent: "from-rose-500 to-pink-400",
    softBg: "bg-rose-500/10",
    border: "border-rose-500/25",
    text: "text-rose-300",
    iconBg: "bg-rose-500/15",
    glow: "group-hover:shadow-rose-500/10",
  },
  indigo: {
    accent: "from-indigo-500 to-purple-400",
    softBg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    text: "text-indigo-300",
    iconBg: "bg-indigo-500/15",
    glow: "group-hover:shadow-indigo-500/10",
  },
  teal: {
    accent: "from-teal-500 to-cyan-400",
    softBg: "bg-teal-500/10",
    border: "border-teal-500/25",
    text: "text-teal-300",
    iconBg: "bg-teal-500/15",
    glow: "group-hover:shadow-teal-500/10",
  },
  cyan: {
    accent: "from-cyan-500 to-sky-400",
    softBg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    text: "text-cyan-300",
    iconBg: "bg-cyan-500/15",
    glow: "group-hover:shadow-cyan-500/10",
  },
  fuchsia: {
    accent: "from-fuchsia-500 to-pink-400",
    softBg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/25",
    text: "text-fuchsia-300",
    iconBg: "bg-fuchsia-500/15",
    glow: "group-hover:shadow-fuchsia-500/10",
  },
  pink: {
    accent: "from-pink-500 to-rose-400",
    softBg: "bg-pink-500/10",
    border: "border-pink-500/25",
    text: "text-pink-300",
    iconBg: "bg-pink-500/15",
    glow: "group-hover:shadow-pink-500/10",
  },
  yellow: {
    accent: "from-yellow-500 to-orange-400",
    softBg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
    text: "text-yellow-300",
    iconBg: "bg-yellow-500/15",
    glow: "group-hover:shadow-yellow-500/10",
  },
  lime: {
    accent: "from-lime-500 to-green-400",
    softBg: "bg-lime-500/10",
    border: "border-lime-500/25",
    text: "text-lime-300",
    iconBg: "bg-lime-500/15",
    glow: "group-hover:shadow-lime-500/10",
  },
  gray: {
    accent: "from-gray-500 to-gray-400",
    softBg: "bg-gray-500/10",
    border: "border-gray-500/25",
    text: "text-gray-300",
    iconBg: "bg-gray-500/15",
    glow: "group-hover:shadow-gray-500/10",
  },
};

export const statusLabel = {
  active: "Aktif",
  draft: "Draft",
  archived: "Arsip",
};
