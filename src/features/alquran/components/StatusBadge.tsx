import type { ItemStatus } from "../types/quran.types";

interface StatusBadgeProps {
  status: ItemStatus;
}

const STATUS_CONFIG: Record<ItemStatus, { label: string; className: string }> =
  {
    new: {
      label: "Belum Mulai",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    memorizing: {
      label: "Proses Hafal",
      className: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    },
    consolidation: {
      label: "Penguatan",
      className: "bg-red-500/10 text-red-400 border-red-500/30",
    },
    active: {
      label: "Ujian Ketahanan",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    maintenance: {
      label: "Terjaga",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    graduated: {
      label: "Selesai",
      className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
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
