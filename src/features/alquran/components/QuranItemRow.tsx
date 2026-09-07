import { Trash2 } from "lucide-react";
import { StatusBadge } from "@/features/alquran/components/StatusBadge";
import type {
  QuranItem,
  Material,
  ItemStatus,
} from "@/features/alquran/types/quran.types";

interface QuranItemRowProps {
  item: QuranItem;
  material: Material;
  onStatusChange: (systemId: string, newStatus: ItemStatus) => void;
  onDelete: (systemId: string) => void;
}

export const QuranItemRow = ({
  item,
  material,
  onStatusChange,
  onDelete,
}: QuranItemRowProps) => {
  const handleDelete = () => {
    if (confirm("Hapus item ini?")) {
      onDelete(item.id_system);
    }
  };

  // Format dates
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  // Render monitor box based on status
  const renderMonitorBox = () => {
    if (item.status === "consolidation") {
      const day = item.consolidationDays || 1;
      return (
        <div className="rounded-lg p-3 mt-4 border-l-[3px] border-destructive bg-destructive/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
              HARI KE-
            </span>
            <span className="font-mono font-bold text-sm text-foreground mt-0.5">
              {day}
            </span>
          </div>
          <div className="w-px h-6 bg-border mx-3" />
          <div className="flex flex-col text-right">
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
              NEXT
            </span>
            <span className="font-mono font-bold text-xs text-foreground mt-0.5">
              Besok
            </span>
          </div>
        </div>
      );
    }

    if (item.status === "active") {
      const stage = item.activeStage || 1;
      const streak = item.stageStreak || 0;
      const nextReview = formatDate(item.nextReview);
      const lastReview = formatDate(item.lastReview);

      return (
        <div className="rounded-lg p-3 mt-4 border-l-[3px] border-warning bg-warning/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
              TAHAP
            </span>
            <span className="font-mono font-bold text-sm text-foreground mt-0.5">
              {stage}/15
            </span>
            <span className="text-[0.65rem] text-muted-foreground mt-0.5">
              Streak {streak}/3
            </span>
          </div>
          <div className="w-px h-6 bg-border mx-3" />
          <div className="flex flex-col text-right">
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
              NEXT
            </span>
            <span className="font-mono font-bold text-xs text-warning mt-0.5">
              {nextReview}
            </span>
            <span className="text-[0.65rem] text-muted-foreground mt-0.5">
              Last: {lastReview}
            </span>
          </div>
        </div>
      );
    }

    if (item.status === "maintenance") {
      const lastReview = formatDate(item.lastReview);
      const nextReview = formatDate(item.nextReview);

      return (
        <div className="rounded-lg p-3 mt-4 border-l-[3px] border-success bg-success/5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
              TERAKHIR
            </span>
            <span className="font-mono font-bold text-sm text-foreground mt-0.5">
              {lastReview}
            </span>
          </div>
          <div className="w-px h-6 bg-border mx-3" />
          <div className="flex flex-col text-right">
            <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">
              JADWAL
            </span>
            <span className="font-mono font-bold text-xs text-success mt-0.5">
              {nextReview}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render action button based on status
  const renderActionButton = () => {
    const buttonClass =
      "px-3 py-1.5 bg-transparent border border-dashed border-border text-muted-foreground text-[0.6rem] rounded-md cursor-pointer transition-colors hover:border-primary/40 hover:text-primary hover:bg-primary/5";

    if (item.status === "new") {
      return (
        <button
          onClick={() => onStatusChange(item.id_system, "memorizing")}
          className={buttonClass}
        >
          Mulai Menghafal
        </button>
      );
    }

    if (item.status === "memorizing") {
      return (
        <button
          onClick={() => onStatusChange(item.id_system, "consolidation")}
          className={buttonClass}
        >
          Sudah Hafal
        </button>
      );
    }

    if (item.status === "consolidation") {
      return (
        <button
          onClick={() => onStatusChange(item.id_system, "active")}
          className={buttonClass}
        >
          Lompati ke Ujian
        </button>
      );
    }

    if (item.status === "active") {
      return (
        <button
          onClick={() => onStatusChange(item.id_system, "maintenance")}
          className={buttonClass}
        >
          Lompati ke Terjaga
        </button>
      );
    }

    if (item.status === "maintenance") {
      return (
        <button
          onClick={() => onStatusChange(item.id_system, "graduated")}
          className={buttonClass}
        >
          Luluskan
        </button>
      );
    }

    if (item.status === "graduated") {
      return (
        <button
          onClick={() => onStatusChange(item.id_system, "active")}
          className={buttonClass}
        >
          Aktifkan Lagi
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-surface-1 border border-border rounded-2xl p-5 mb-3 transition-all hover:bg-surface-2 hover:border-border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-serif text-foreground">{material.title}</h3>
        <div className="flex gap-2 items-center">
          <StatusBadge status={item.status} />
          <button
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1 rounded transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
        <div>
          Ayat:{" "}
          <span className="text-muted-foreground font-mono font-bold ml-1">
            {item.range.ayat}
          </span>
        </div>
        <div>
          Hal:{" "}
          <span className="text-muted-foreground font-mono font-bold ml-1">
            {item.range.page}
          </span>
        </div>
        <div>
          Waktu:{" "}
          <span className="text-muted-foreground font-mono font-bold ml-1">
            {item.time.value}m
          </span>
        </div>
      </div>

      {/* Monitor Box */}
      {renderMonitorBox()}

      {/* Action Button */}
      <div className="text-right mt-2">{renderActionButton()}</div>
    </div>
  );
};
