import { useState, useEffect } from "react";
import { X, Clock, BookOpen, ChevronRight } from "lucide-react";
import type { DailyTask } from "@/features/alquran/types/quran.types";
import type { JuzReviewEstimate } from "@/features/alquran/hooks/useDailyReviewEstimate";
import { parseContentRef } from "@/features/alquran/components/item-detail/ItemDetailView.config";

interface DailyReviewJuzModalProps {
  isOpen: boolean;
  juzEstimate: JuzReviewEstimate | null;
  onClose: () => void;
  onItemSelected: (task: DailyTask) => void;
}

export const DailyReviewJuzModal = ({
  isOpen,
  juzEstimate,
  onClose,
  onItemSelected,
}: DailyReviewJuzModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen || !juzEstimate) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} detik`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins} menit`;
    return `${mins} menit ${secs} detik`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:-top-5 md:-right-5 z-20 p-2 rounded-full bg-surface-1 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="perspective-[2200px]">
          <div
            className={`relative min-h-[500px] md:min-h-[450px] w-full transform-3d transition-transform duration-700 ${
              isFlipped ? "transform-[rotateY(180deg)]" : ""
            }`}
          >
            {/* Front - Item List */}
            <div className="absolute inset-0 backface-hidden rounded-2xl border border-info/20 bg-card shadow-xl overflow-y-auto">
              <div className="relative p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-info/10 border border-info/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-foreground">
                        Juz {juzEstimate.juz_index}
                      </h2>
                      <p className="text-info/80 text-sm">
                        {juzEstimate.itemCount} item untuk direview
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-1 border border-border text-sm text-muted-foreground hover:bg-info/10 hover:border-info/40 hover:text-info transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Lihat Estimasi
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {juzEstimate.items.map((item, index) => {
                    const info = parseContentRef(item.content_ref);
                    return (
                      <button
                        key={item.item_id}
                        onClick={() => {
                          const task: DailyTask = {
                            item_id: item.item_id,
                            source: "interval_review",
                            state: "pending",
                            task_date: new Date().toISOString().split("T")[0],
                            content_ref: item.content_ref,
                            juz_index: juzEstimate.juz_index,
                            status: item.status,
                          };
                          onItemSelected(task);
                        }}
                        className="w-full group flex items-center justify-between p-4 rounded-xl bg-surface-1 border border-border hover:bg-surface-2 hover:border-info/50 transition-all text-left"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center shrink-0">
                            <span className="text-info font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-foreground font-bold truncate group-hover:text-info transition-colors">
                              {info?.title || `Item ${index + 1}`}
                            </h3>
                            <p className="text-muted-foreground text-xs truncate">
                              {info?.subtitle || item.content_ref}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-info group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>

                {/* Total Time Footer */}
                <div className="mt-6 p-4 rounded-xl bg-info/10 border border-info/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-info" />
                      <span className="text-info font-semibold">
                        Total Estimasi
                      </span>
                    </div>
                    <span className="text-2xl font-black text-info">
                      {formatTime(juzEstimate.totalEstimatedSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back - Time Summary */}
            <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] rounded-2xl border border-success/20 bg-surface-1 shadow-xl overflow-y-auto">
              <div className="relative p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-foreground">
                        Rincian Waktu
                      </h2>
                      <p className="text-success/80 text-sm">
                        Juz {juzEstimate.juz_index}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-1 border border-border text-sm text-muted-foreground hover:bg-success/10 hover:border-success/40 hover:text-success transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Lihat Item
                  </button>
                </div>

                {/* Time Breakdown */}
                <div className="space-y-4 mb-8">
                  {juzEstimate.items.map((item, index) => {
                    const info = parseContentRef(item.content_ref);
                    const itemMinutes = Math.ceil(
                      (item.estimatedReviewSeconds || 0) / 60,
                    );
                    return (
                      <div
                        key={item.item_id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-border"
                      >
                        <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                          <span className="text-success font-bold text-xs">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-foreground font-semibold text-sm truncate">
                            {info?.title || `Item ${index + 1}`}
                          </h3>
                          <p className="text-muted-foreground text-xs truncate">
                            {info?.subtitle || item.content_ref}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-success font-bold text-sm">
                            {itemMinutes > 0 ? `${itemMinutes} mnt` : "< 1 mnt"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="p-6 rounded-2xl bg-success/10 border border-success/20 text-center">
                  <p className="text-success text-sm mb-2">Total Waktu Review</p>
                  <p className="text-4xl font-black text-success mb-1">
                    {formatTime(juzEstimate.totalEstimatedSeconds)}
                  </p>
                  <p className="text-success/60 text-xs">
                    {juzEstimate.itemCount} item
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
