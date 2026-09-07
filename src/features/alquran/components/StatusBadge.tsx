import type { ItemStatus } from "@/features/alquran/types/quran.types";

interface StatusBadgeProps {
  status: ItemStatus;
}

const STATUS_CONFIG: Record<ItemStatus, { label: string; className: string }> =
  {
    new: {
      label: "Belum Mulai",
      className: "bg-info/10 text-info border-info/30",
    },
    memorizing: {
      label: "Proses Hafal",
      className: "bg-warning/10 text-warning border-warning/30",
    },
    consolidation: {
      label: "Penguatan",
      className: "bg-destructive/10 text-destructive border-destructive/30",
    },
    active: {
      label: "Ujian Ketahanan",
      className: "bg-warning/10 text-warning border-warning/30",
    },
    maintenance: {
      label: "Terjaga",
      className: "bg-success/10 text-success border-success/30",
    },
    graduated: {
      label: "Selesai",
      className: "bg-primary/10 text-primary border-primary/30",
    },
  };

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
