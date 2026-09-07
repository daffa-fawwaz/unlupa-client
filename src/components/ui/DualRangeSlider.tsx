import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
  className?: string;
}

export const DualRangeSlider = ({
  min,
  max,
  onChange,
  className = "",
}: DualRangeSliderProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Update parent when values change (debounced slightly or on mouse up ideally, but strict change here)
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  return (
    <div className={`relative w-full py-4 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left z-3 absolute w-full pointer-events-none h-0 opacity-0 cursor-pointer"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right z-4 absolute w-full pointer-events-none h-0 opacity-0 cursor-pointer"
      />

      <div className="relative w-full">
        {/* Track Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-surface-1 rounded-full z-1" />

        {/* Selected Range */}
        <div
          ref={range}
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary rounded-full z-2"
        />

        {/* Thumb Left Visual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary border-2 border-background rounded-full shadow-sm z-3 -ml-3 flex items-center justify-center transform transition-transform hover:scale-110"
          style={{ left: `${getPercent(minVal)}%` }}
        >
          <div className="w-1.5 h-1.5 bg-background rounded-full" />
        </div>

        {/* Thumb Right Visual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary border-2 border-background rounded-full shadow-sm z-3 -ml-3 flex items-center justify-center transform transition-transform hover:scale-110"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          <div className="w-1.5 h-1.5 bg-background rounded-full" />
        </div>

        {/* Floating Labels */}
        <div
          className="absolute -top-10 -ml-3 px-2 py-1 bg-surface-2 rounded-lg text-xs font-mono text-foreground border border-border z-4"
          style={{ left: `${getPercent(minVal)}%` }}
        >
          {minVal}
        </div>
        <div
          className="absolute -top-10 -ml-3 px-2 py-1 bg-surface-2 rounded-lg text-xs font-mono text-foreground border border-border z-4"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          {maxVal}
        </div>
      </div>
    </div>
  );
};
