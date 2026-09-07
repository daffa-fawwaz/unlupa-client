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
    <div className="bg-card border border-border rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-lg font-serif text-foreground">Target Menghafal</h3>
          <p className="text-xs text-muted-foreground">
            Teruslah istiqomah, setiap ayat yang kau hafal adalah cahaya di akhirat kelak.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary font-mono">
            {completedItems} / {totalItems} Hafalan
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-surface-1 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${itemPercentage}%`,
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Juz Selesai</p>
          <p className="text-xl font-bold text-primary">{completedJuz}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Juz</p>
          <p className="text-xl font-bold text-foreground">{totalJuz}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Progress</p>
          <p className="text-xl font-bold text-primary">{Math.round(itemPercentage)}%</p>
        </div>
        {manualCompletedJuz > 0 && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">✓ Ditandai</p>
            <p className="text-xl font-bold text-primary/80">{manualCompletedJuz}</p>
          </div>
        )}
      </div>
    </div>
  );
};
