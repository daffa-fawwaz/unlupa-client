import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type ClassroomSearchInputProps = {
  value?: string;
  resultCount?: number;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onFilterClick?: () => void;
};

export const ClassroomSearchInput = ({
  value,
  resultCount,
  placeholder = "Cari kelas, pengajar, atau kitab...",
  onChange,
  onClear,
  onFilterClick,
}: ClassroomSearchInputProps) => {
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value ?? internalValue;
  const hasValue = currentValue.trim().length > 0;

  const handleChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleClear = () => {
    handleChange("");
    onClear?.();
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <label className="group relative flex h-12 flex-1 items-center overflow-hidden rounded-2xl border border-border bg-surface-1 transition-all duration-300 focus-within:border-primary/35 focus-within:bg-surface-2 focus-within:ring-4 focus-within:ring-primary/10">
        <span className="flex h-full w-12 shrink-0 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={currentValue}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 py-2 flex-1 bg-transparent pr-11 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      <div className="flex items-center gap-2">
        {typeof resultCount === "number" && (
          <span className="hidden whitespace-nowrap rounded-full border border-border bg-surface-1 px-3 py-2 text-xs font-semibold text-muted-foreground sm:inline-flex">
            {resultCount} kelas
          </span>
        )}

        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface-1 px-4 text-sm font-bold text-muted-foreground transition hover:border-border hover:bg-surface-2 hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};
