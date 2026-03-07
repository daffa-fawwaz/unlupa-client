import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";

interface TimeSliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
}

export const TimeSlider = ({
  min = 1,
  max = 60,
  defaultValue = 5,
  onChange,
  className = "",
  label,
}: TimeSliderProps) => {
  const [value, setValue] = useState(defaultValue);
  const valueRef = useRef(defaultValue);

  // Convert to percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max],
  );

  // Update parent when value changes
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div className={`relative w-full py-4 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {label}
          </label>
          <div className="text-lg font-mono font-bold text-amber-400">
            {value} <span className="text-xs text-gray-500">menit</span>
          </div>
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const newValue = Number(event.target.value);
          setValue(newValue);
          valueRef.current = newValue;
        }}
        className="absolute w-full h-0 opacity-0 cursor-pointer z-10"
      />

      <div className="relative w-full">
        {/* Track Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-white/10 rounded-full z-1" />

        {/* Selected Range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full z-2"
          style={{ width: `${getPercent(value)}%` }}
        />

        {/* Thumb Visual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 border-2 border-[#0B0E14] rounded-full shadow-lg z-3 -ml-3 flex items-center justify-center transform transition-transform hover:scale-110"
          style={{ left: `${getPercent(value)}%` }}
        >
          <div className="w-1.5 h-1.5 bg-black rounded-full/50" />
        </div>

        {/* Time markers */}
        <div className="absolute top-8 left-0 right-0 flex justify-between text-xs text-gray-500 px-1">
          <span>{min}m</span>
          <span>{Math.floor((min + max) / 2)}m</span>
          <span>{max}m</span>
        </div>
      </div>
    </div>
  );
};
