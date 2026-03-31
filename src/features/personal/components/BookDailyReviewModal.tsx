import { useState, useEffect } from "react";
import { X, Clock, BookOpen, ChevronRight } from "lucide-react";
import type { BookDailyTask, BookDailyReviewGroup } from "@/features/personal/types/personal.types";
import { getTodayDateKey } from "@/features/personal/utils/bookReviewUtils";

interface BookDailyReviewModalProps {
  isOpen: boolean;
  bookGroup: BookDailyReviewGroup | null;
  onClose: () => void;
  onItemSelected: (task: BookDailyTask) => void;
}

export const BookDailyReviewModal = ({
  isOpen,
  bookGroup,
  onClose,
  onItemSelected,
}: BookDailyReviewModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen || !bookGroup) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}d`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-3 md:p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:-top-5 md:-right-5 z-20 p-2 rounded-full bg-[#111826] border border-white/10 text-gray-400 hover:text-white hover:bg-[#1A2232] transition-colors"
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
            <div className="absolute inset-0 backface-hidden rounded-3xl md:rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-[#101725] via-[#0D1422] to-[#0A111C] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-y-auto">
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.20),transparent_35%)]" />

              <div className="relative p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl md:text-2xl font-black text-white truncate">
                        {bookGroup.book_title}
                      </h2>
                      <p className="text-cyan-200/80 text-sm">
                        {bookGroup.itemCount} item untuk direview
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-cyan-500/20 hover:border-cyan-300/40 transition-colors shrink-0"
                  >
                    <Clock className="w-4 h-4" />
                    Lihat Estimasi
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {bookGroup.items.map((item, index) => {
                    const itemTitle = item.book_item_title || `Item ${index + 1}`;
                    return (
                      <button
                        key={item.item_id}
                        onClick={() => {
                          const task: BookDailyTask = {
                            item_id: item.item_id,
                            source: "interval_review",
                            state: "pending",
                            task_date: getTodayDateKey(),
                            content_ref: item.content_ref,
                            status: item.status,
                            book_title: item.book_title,
                            book_item_title: item.book_item_title,
                          };
                          onItemSelected(task);
                        }}
                        className="w-full group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/40 transition-all text-left"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                            <span className="text-cyan-400 font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white font-bold truncate group-hover:text-cyan-400 transition-colors">
                              {itemTitle}
                            </h3>
                            <p className="text-gray-400 text-xs truncate">
                              {item.content_ref}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>

                {/* Total Time Footer */}
                <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-200 font-semibold">
                        Total Estimasi
                      </span>
                    </div>
                    <span className="text-2xl font-black text-cyan-400">
                      {formatTime(bookGroup.totalEstimatedSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back - Time Summary */}
            <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] rounded-3xl md:rounded-[2rem] border border-emerald-400/20 bg-linear-to-br from-[#13211D] via-[#101B19] to-[#0B1513] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-y-auto">
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_15%_25%,rgba(16,185,129,0.32),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.2),transparent_35%)]" />

              <div className="relative p-4 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl md:text-2xl font-black text-white truncate">
                        Rincian Waktu
                      </h2>
                      <p className="text-emer`ald-200/80 text-sm truncate">
                        {bookGroup.book_title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 hover:bg-emerald-500/20 hover:border-emerald-300/40 transition-colors shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    Lihat Item
                  </button>
                </div>

                {/* Time Breakdown */}
                <div className="space-y-4 mb-8">
                  {bookGroup.items.map((item, index) => {
                    const itemTitle = item.book_item_title || `Item ${index + 1}`;
                    const itemMinutes = Math.ceil(
                      (item.estimatedReviewSeconds || 0) / 60,
                    );
                    return (
                      <div
                        key={item.item_id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-bold text-xs">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">
                            {itemTitle}
                          </h3>
                          <p className="text-gray-400 text-xs truncate">
                            {item.content_ref}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-emerald-400 font-bold text-sm">
                            {itemMinutes > 0 ? `${itemMinutes} mnt` : "< 1 mnt"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-center">
                  <p className="text-emerald-200 text-sm mb-2">Total Waktu Review</p>
                  <p className="text-4xl font-black text-emerald-400 mb-1">
                    {formatTime(bookGroup.totalEstimatedSeconds)}
                  </p>
                  <p className="text-emerald-200/60 text-xs">
                    {bookGroup.itemCount} item
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
