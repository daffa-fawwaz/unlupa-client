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
    accent: "bg-info",
    softBg: "bg-info/10",
    border: "border-info/25",
    text: "text-info",
    iconBg: "bg-info/15",
    glow: "",
  },
  emerald: {
    accent: "bg-success",
    softBg: "bg-success/10",
    border: "border-success/25",
    text: "text-success",
    iconBg: "bg-success/15",
    glow: "",
  },
  amber: {
    accent: "bg-warning",
    softBg: "bg-warning/10",
    border: "border-warning/25",
    text: "text-warning",
    iconBg: "bg-warning/15",
    glow: "",
  },
  violet: {
    accent: "bg-primary",
    softBg: "bg-primary/10",
    border: "border-primary/25",
    text: "text-primary",
    iconBg: "bg-primary/15",
    glow: "",
  },
  rose: {
    accent: "bg-destructive",
    softBg: "bg-destructive/10",
    border: "border-destructive/25",
    text: "text-destructive",
    iconBg: "bg-destructive/15",
    glow: "",
  },
  indigo: {
    accent: "bg-primary",
    softBg: "bg-primary/10",
    border: "border-primary/25",
    text: "text-primary",
    iconBg: "bg-primary/15",
    glow: "",
  },
  teal: {
    accent: "bg-primary",
    softBg: "bg-primary/10",
    border: "border-primary/25",
    text: "text-primary",
    iconBg: "bg-primary/15",
    glow: "",
  },
  cyan: {
    accent: "bg-info",
    softBg: "bg-info/10",
    border: "border-info/25",
    text: "text-info",
    iconBg: "bg-info/15",
    glow: "",
  },
  fuchsia: {
    accent: "bg-primary",
    softBg: "bg-primary/10",
    border: "border-primary/25",
    text: "text-primary",
    iconBg: "bg-primary/15",
    glow: "",
  },
  pink: {
    accent: "bg-primary",
    softBg: "bg-primary/10",
    border: "border-primary/25",
    text: "text-primary",
    iconBg: "bg-primary/15",
    glow: "",
  },
  yellow: {
    accent: "bg-warning",
    softBg: "bg-warning/10",
    border: "border-warning/25",
    text: "text-warning",
    iconBg: "bg-warning/15",
    glow: "",
  },
  lime: {
    accent: "bg-success",
    softBg: "bg-success/10",
    border: "border-success/25",
    text: "text-success",
    iconBg: "bg-success/15",
    glow: "",
  },
  gray: {
    accent: "bg-muted",
    softBg: "bg-muted/50",
    border: "border-muted",
    text: "text-muted-foreground",
    iconBg: "bg-muted/30",
    glow: "",
  },
};

export const statusLabel = {
  active: "Aktif",
  draft: "Draft",
  archived: "Arsip",
};

export const tones: ClassroomCardTone[] = [
    "blue",
    "teal",
    "emerald",
    "amber",
    "violet",
    "rose",
    "indigo",
    "cyan",
    "fuchsia",
    "pink",
    "yellow",
    "lime",
    "gray",
  ];
