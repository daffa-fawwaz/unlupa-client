interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export const ProgressBar = ({
  current,
  total,
  percentage,
}: ProgressBarProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-lg font-serif text-white">Progres 30 Juz</h3>
          <p className="text-xs text-gray-400">
            Dihitung dari halaman terjaga (Terjaga & Selesai).
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-amber-400 font-mono">
            {current} / {total} Juz
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-linear-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            boxShadow: "0 0 15px rgba(251, 191, 36, 0.4)",
          }}
        />
      </div>
    </div>
  );
};
