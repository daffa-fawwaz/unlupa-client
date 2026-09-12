import { useLayoutEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { BookItemOrigin } from "@/features/personal/utils/bookReviewUtils";

interface OriginBadgeProps {
  origin: BookItemOrigin | null;
}

const buildOriginLabel = (origin: BookItemOrigin): string =>
  [
    origin.bookTitle,
    origin.halaqah?.title,
    ...(origin.subModules ?? []).map((m) => m.title),
    origin.order != null ? `Urutan ke-${origin.order}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const OriginBadge = ({ origin }: OriginBadgeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  const label = origin ? buildOriginLabel(origin) : "";

  useLayoutEffect(() => {
    if (!origin) return;
    let cancelled = false;

    const measure = () => {
      if (!cancelled && containerRef.current && measureRef.current) {
        setOverflowing(
          measureRef.current.getBoundingClientRect().width >
            containerRef.current.clientWidth,
        );
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    window.addEventListener("resize", measure);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => setReducedMotion(motion.matches);
    motion.addEventListener?.("change", handleMotionChange);

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", measure);
      motion.removeEventListener?.("change", handleMotionChange);
    };
  }, [origin, label]);

  if (!origin) return null;

  const animate = overflowing && !reducedMotion;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6 min-w-0">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border text-[11px] font-semibold text-muted-foreground max-w-full min-w-0">
        <MapPin className="w-3 h-3 text-primary shrink-0" />
        <div
          ref={containerRef}
          className="relative overflow-hidden max-w-[200px] sm:max-w-[280px]"
        >
          <span
            ref={measureRef}
            aria-hidden="true"
            className="invisible absolute left-0 top-0 whitespace-nowrap"
          >
            {label}
          </span>
          {animate ? (
            <span className="inline-block whitespace-nowrap animate-marquee will-change-transform">
              <span className="pr-2">{label}</span>
              <span className="pr-2" aria-hidden="true">
                {label}
              </span>
            </span>
          ) : (
            <span className="block truncate whitespace-nowrap">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
};