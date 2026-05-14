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
      <label className="group relative flex h-12 flex-1 items-center overflow-hidden rounded-2xl border border-white/8 bg-white/5 transition-all duration-300 focus-within:border-emerald-400/35 focus-within:bg-white/7 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]">
        <span className="flex h-full w-12 shrink-0 items-center justify-center text-gray-500 transition-colors group-focus-within:text-emerald-300">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={currentValue}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 py-2 flex-1 bg-transparent pr-11 text-sm font-medium text-white outline-none placeholder:text-gray-600"
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-white/10 hover:text-white"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      <div className="flex items-center gap-2">
        {typeof resultCount === "number" && (
          <span className="hidden whitespace-nowrap rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-400 sm:inline-flex">
            {resultCount} kelas
          </span>
        )}

        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 text-sm font-bold text-gray-300 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
        >
          <SlidersHorizontal className="h-4 w-4 text-emerald-300" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};
