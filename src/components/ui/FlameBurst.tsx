import { useState } from "react";
import type { CSSProperties } from "react";
import { Flame } from "lucide-react";

const SPARKS = [
  { x: -26, y: -16, delay: 0, color: "bg-linear-to-br from-amber-400 to-orange-500" },
  { x: 26, y: -20, delay: 40, color: "bg-linear-to-br from-orange-400 to-red-500" },
  { x: -32, y: 8, delay: 80, color: "bg-linear-to-br from-amber-300 to-orange-500" },
  { x: 32, y: 10, delay: 20, color: "bg-linear-to-br from-red-400 to-orange-500" },
  { x: -16, y: -30, delay: 60, color: "bg-linear-to-br from-amber-400 to-orange-500" },
  { x: 18, y: -32, delay: 100, color: "bg-linear-to-br from-orange-400 to-red-500" },
  { x: -10, y: 16, delay: 120, color: "bg-linear-to-br from-amber-400 to-orange-500" },
  { x: 10, y: 18, delay: 50, color: "bg-linear-to-br from-red-400 to-amber-400" },
] as const;

interface FlameBurstProps {
  solid?: boolean;
}

export const FlameBurst = ({ solid = false }: FlameBurstProps) => {
  const [isBlazing, setIsBlazing] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const handleClick = () => {
    setIsBlazing(true);
    setBurstKey((k) => k + 1);
    window.setTimeout(() => setIsBlazing(false), 700);
  };

  const containerClass = solid
    ? "bg-amber-100/80 text-amber-600 border border-amber-500/20 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-500/20"
    : "bg-orange-50 text-orange-600 border border-orange-200/60 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-500/20";

  const flameColor = solid
    ? "text-amber-600 dark:text-orange-400"
    : "text-orange-600 dark:text-orange-400";

  return (
    <button
      type="button"
      aria-label="Ikon api menyala"
      onClick={handleClick}
      className={`group relative w-16 h-16 rounded-xl ${containerClass} flex items-center justify-center shrink-0 transform -rotate-3 cursor-pointer active:scale-95 transition-transform duration-200`}
    >
      <Flame
        className={`w-8 h-8 animate-pulse ${flameColor} transition-transform duration-200 ${isBlazing ? "scale-125 -rotate-12" : ""}`}
      />
      {isBlazing && (
        <span key={burstKey} className="absolute inset-0 pointer-events-none">
          <span className="absolute inset-1 rounded-full bg-orange-400/30 blur-sm animate-flame-burst" />
          {SPARKS.map((spark, i) => (
            <span
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${spark.color} animate-flame-burst`}
              style={
                {
                  left: "50%",
                  top: "50%",
                  animationDelay: `${spark.delay}ms`,
                  "--burst-x": `${spark.x}px`,
                  "--burst-y": `${spark.y}px`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}
    </button>
  );
};