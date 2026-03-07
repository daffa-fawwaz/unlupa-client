interface ProgressBarProps {
  totalItems: number;
  completedItems: number;
  totalJuz: number;
  completedJuz: number;
  manualCompletedJuz?: number;
}

export const ProgressBar = ({
  totalItems,
  completedItems,
  totalJuz,
  completedJuz,
  manualCompletedJuz = 0,
}: ProgressBarProps) => {
  const itemPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-lg font-serif text-white">🎯 Target Menghafal</h3>
          <p className="text-xs text-gray-400">
            Teruslah istiqomah, setiap ayat yang kau hafal adalah cahaya di akhirat kelak.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            {completedItems} / {totalItems} Hafalan
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${itemPercentage}%`,
            boxShadow: "0 0 15px rgba(52, 211, 153, 0.5)",
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Juz Selesai</p>
          <p className="text-xl font-bold text-amber-400">{completedJuz}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total Juz</p>
          <p className="text-xl font-bold text-white">{totalJuz}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Progress</p>
          <p className="text-xl font-bold text-emerald-400">{Math.round(itemPercentage)}%</p>
        </div>
        {manualCompletedJuz > 0 && (
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">✓ Ditandai</p>
            <p className="text-xl font-bold text-emerald-300">{manualCompletedJuz}</p>
          </div>
        )}
      </div>
    </div>
  );
};
