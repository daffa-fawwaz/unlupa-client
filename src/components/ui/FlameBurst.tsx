import { useState } from "react";
import type { CSSProperties } from "react";
import { Flame } from "lucide-react";

interface BurstParticle {
  angle: number;
  dist: number;
  size: number;
  color: string;
  delay: number;
}

const PARTICLE_COLORS = [
  "#ffd166",
  "#ffb84d",
  "#ff9f43",
  "#ff8a3d",
  "#ff6b35",
  "#ff512f",
].map((hex) => hex + "cc");

const BURST_COUNT = 16;

const buildBurst = (): BurstParticle[] =>
  Array.from({ length: BURST_COUNT }, (_, i) => {
    const angle = (360 / BURST_COUNT) * i + (i % 2 === 0 ? 7 : 0);
    const dist = 40 + (i % 3) * 12;
    const size = 4 + (i % 4);
    const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
    const delay = (i % 4) * 35;
    return { angle, dist, size, color, delay };
  });

const BURST = buildBurst();

const EMBERS = [
  { drift: 10, delay: 90 },
  { drift: -14, delay: 170 },
  { drift: 24, delay: 250 },
  { drift: -6, delay: 330 },
  { drift: 14, delay: 430 },
  { drift: -22, delay: 520 },
];

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

  const blazedState =
    "text-red-500 dark:text-red-400 drop-shadow-[0_0_6px_rgba(255,150,60,0.8)] drop-shadow-[0_0_18px_rgba(239,68,68,0.55)]";

  return (
    <button
      type="button"
      aria-label="Ikon api menyala"
      onClick={handleClick}
      className={`group relative w-16 h-16 rounded-xl ${containerClass} flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 ${
        isBlazing
          ? "shadow-[0_0_0_1px_rgba(239,68,68,0.35),0_0_26px_rgba(239,68,68,0.45)] border-red-400/50"
          : "group-hover:border-red-400/40 group-hover:shadow-[0_0_18px_rgba(239,68,68,0.25)]"
      }`}
    >
      <Flame
        className={`w-8 h-8 transition-[color,filter] duration-300 ${
          isBlazing
            ? blazedState
            : `${flameColor} group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]`
        }`}
      />
      {isBlazing && (
        <span
          key={burstKey}
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <span className="firework-flash" />
          {BURST.map((p, i) => (
            <span
              key={i}
              className="firework-spark"
              style={
                {
                  "--angle": `${p.angle}deg`,
                  "--dist": `${p.dist}px`,
                  "--size": `${p.size}px`,
                  "--color": p.color,
                  animationDelay: `${p.delay}ms`,
                } as CSSProperties
              }
            />
          ))}
          {EMBERS.map((e, i) => (
            <span
              key={`ember-${i}`}
              className="firework-ember"
              style={
                {
                  "--drift": `${e.drift}px`,
                  "--color": "#ff8a3d",
                  animationDelay: `${e.delay}ms`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}
    </button>
  );
};