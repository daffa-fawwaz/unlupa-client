import { useState, useEffect, useRef } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  value1: number;
  value2: number;
  onChange: (lower: number, upper: number) => void;
  label: string;
  unit?: string;
}

export const DualRangeSlider = ({
  min,
  max,
  value1,
  value2,
  onChange,
  label,
  unit = "",
}: DualRangeSliderProps) => {
  const [localValue1, setLocalValue1] = useState(value1);
  const [localValue2, setLocalValue2] = useState(value2);
  const slider1Ref = useRef<HTMLInputElement>(null);
  const slider2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue1(value1);
    setLocalValue2(value2);
  }, [value1, value2]);

  const handleChange = (newValue1: number, newValue2: number) => {
    const lower = Math.min(newValue1, newValue2);
    const upper = Math.max(newValue1, newValue2);
    setLocalValue1(newValue1);
    setLocalValue2(newValue2);
    onChange(lower, upper);
  };

  const lower = Math.min(localValue1, localValue2);
  const upper = Math.max(localValue1, localValue2);
  const range = max - min;
  const leftPercent = ((lower - min) / range) * 100;
  const widthPercent = ((upper - lower) / range) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between font-mono text-sm text-gray-400 mb-2">
        <span>{label}</span>
        <span>
          <span className="text-amber-400 font-bold text-lg">{lower}</span>
          {unit} s.d{" "}
          <span className="text-amber-400 font-bold text-lg">{upper}</span>
          {unit}
        </span>
      </div>

      <div className="relative w-full h-12 px-2.5">
        {/* Track */}
        <div className="absolute top-1/2 left-2.5 right-2.5 h-1 bg-white/10 rounded-full -translate-y-1/2" />

        {/* Range highlight */}
        <div
          className="absolute top-1/2 h-1 bg-amber-400 rounded-full -translate-y-1/2 pointer-events-none z-10"
          style={{
            left: `calc(${leftPercent}% + 10px)`,
            width: `calc(${widthPercent}% - 0px)`,
            boxShadow: "0 0 10px rgba(251, 191, 36, 0.4)",
          }}
        />

        {/* Slider 1 */}
        <input
          ref={slider1Ref}
          type="range"
          min={min}
          max={max}
          value={localValue1}
          onChange={(e) => handleChange(parseInt(e.target.value), localValue2)}
          className="absolute top-1/2 left-2.5 w-[calc(100%-20px)] -translate-y-1/2 z-20 appearance-none bg-transparent pointer-events-auto cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(251,191,36,0.5)]
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-400 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Slider 2 */}
        <input
          ref={slider2Ref}
          type="range"
          min={min}
          max={max}
          value={localValue2}
          onChange={(e) => handleChange(localValue1, parseInt(e.target.value))}
          className="absolute top-1/2 left-2.5 w-[calc(100%-20px)] -translate-y-1/2 z-20 appearance-none bg-transparent pointer-events-auto cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_5px_rgba(251,191,36,0.5)]
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-400 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
};
