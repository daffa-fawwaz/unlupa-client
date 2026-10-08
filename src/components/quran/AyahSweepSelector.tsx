import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Layers } from "@/components/foundations/hugeicons";

interface AyahSweepSelectorProps {
  startAyah: number;
  endAyah: number;
  fromAyah: number;
  toAyah: number;
  onChange: (from: number, to: number) => void;
  surahName?: string;
  language?: string;
}

export const AyahSweepSelector: React.FC<AyahSweepSelectorProps> = ({
  startAyah,
  endAyah,
  fromAyah,
  toAyah,
  onChange,
  surahName,
  language = "id",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverAyah, setHoverAyah] = useState<number | null>(null);

  const dragStartRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const totalAyahs = Math.max(1, endAyah - startAyah + 1);

  // Clamp current selection within valid bounds of this section
  const safeFrom = Math.max(startAyah, Math.min(endAyah, fromAyah));
  const safeTo = Math.max(startAyah, Math.min(endAyah, toAyah));
  const min = Math.min(safeFrom, safeTo);
  const max = Math.max(safeFrom, safeTo);
  const selectedCount = max - min + 1;
  const isSingle = min === max;

  const commitRange = useCallback(
    (start: number, end: number) => {
      const cMin = Math.max(startAyah, Math.min(endAyah, Math.min(start, end)));
      const cMax = Math.min(endAyah, Math.max(startAyah, Math.max(start, end)));
      onChange(cMin, cMax);
    },
    [startAyah, endAyah, onChange],
  );

  // Helper to extract ayah number from coordinates
  const getAyahFromCoords = (
    clientX: number,
    clientY: number,
  ): number | null => {
    const el = document.elementFromPoint(clientX, clientY);
    const item = el?.closest<HTMLElement>("[data-ayah]");
    if (!item) return null;
    const num = Number(item.dataset.ayah);
    return !isNaN(num) && num >= startAyah && num <= endAyah ? num : null;
  };

  // Pointer Down (Desktop Mouse, Touch, Stylus)
  const handlePointerDown = (
    e: React.PointerEvent<HTMLElement>,
    ayah: number,
  ) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if setPointerCapture is not available
    }
    isDraggingRef.current = true;
    dragStartRef.current = ayah;
    setIsDragging(true);
    setHoverAyah(ayah);
    commitRange(ayah, ayah);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || dragStartRef.current === null) return;
    const currentAyah = getAyahFromCoords(e.clientX, e.clientY);
    if (currentAyah !== null) {
      setHoverAyah(currentAyah);
      commitRange(dragStartRef.current, currentAyah);
    }
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e?: React.PointerEvent<HTMLElement>) => {
    if (e) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
    isDraggingRef.current = false;
    dragStartRef.current = null;
    setIsDragging(false);
    setHoverAyah(null);
  };

  // Touch Move fallback
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || dragStartRef.current === null) return;
    const touch = e.touches[0];
    const currentAyah = getAyahFromCoords(touch.clientX, touch.clientY);
    if (currentAyah !== null) {
      setHoverAyah(currentAyah);
      commitRange(dragStartRef.current, currentAyah);
    }
  };

  // Global listeners guarantee release
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        dragStartRef.current = null;
        setIsDragging(false);
        setHoverAyah(null);
      }
    };

    window.addEventListener("pointerup", handleGlobalEnd);
    window.addEventListener("pointercancel", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);
    window.addEventListener("touchcancel", handleGlobalEnd);

    return () => {
      window.removeEventListener("pointerup", handleGlobalEnd);
      window.removeEventListener("pointercancel", handleGlobalEnd);
      window.removeEventListener("touchend", handleGlobalEnd);
      window.removeEventListener("touchcancel", handleGlobalEnd);
    };
  }, []);

  return (
    <div className="select-none space-y-2">
      {/* Compact Ayah Summary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50/70 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-solid text-white shadow-2xs">
            <Layers className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {surahName && (
                <span className="text-xs font-semibold text-secondary">
                  {surahName}:
                </span>
              )}
              <span className="text-xs font-bold text-brand-800">
                {isSingle ? `Ayat ${min}` : `Ayat ${min} — ${max}`}
              </span>
              <span className="rounded-md border border-brand-200 bg-primary px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
                {isSingle ? "1 Ayat" : `${selectedCount} Ayat`}
              </span>
              {isDragging && (
                <span className="inline-flex animate-pulse items-center gap-1 rounded-md border border-[#fedf89] bg-[#fffaeb] px-1.5 py-0.5 text-[10px] font-bold text-[#b54708] dark:border-[#78350f] dark:bg-[#451a03]/40 dark:text-[#fdb022]">
                  <Sparkles className="size-2.5" />
                  <span>
                    {language === "en" ? "Sweeping..." : "Menyapu..."}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick presets (Semua di Halaman vs 1 Ayat) */}
        <div className="flex shrink-0 items-center gap-1">
          {!isSingle && (
            <button
              type="button"
              onClick={() => commitRange(min, min)}
              className="min-h-8 rounded-lg border border-secondary bg-primary px-2 py-1 text-[10px] font-semibold text-secondary outline-none transition hover:border-brand-200 hover:text-brand-700 focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905]"
            >
              {language === "en" ? "Single" : "1 Ayat"}
            </button>
          )}
          {totalAyahs > 1 && selectedCount !== totalAyahs && (
            <button
              type="button"
              onClick={() => commitRange(startAyah, endAyah)}
              className="min-h-8 rounded-lg border border-brand-200 bg-primary px-2 py-1 text-[10px] font-semibold text-brand-700 outline-none transition hover:bg-brand-50 focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905]"
            >
              {language === "en" ? "All Ayahs" : "Semua"}
            </button>
          )}
        </div>
      </div>

      {/* Interactive Ayah Sweep Grid */}
      <div
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handlePointerUp()}
        className={`grid touch-none select-none gap-1.5 rounded-2xl border border-secondary bg-secondary/35 p-2 ${
          totalAyahs <= 6
            ? "grid-cols-6"
            : totalAyahs <= 8
              ? "grid-cols-8"
              : totalAyahs <= 12
                ? "grid-cols-6 sm:grid-cols-10"
                : "grid-cols-7 sm:grid-cols-10"
        }`}
      >
        {Array.from({ length: totalAyahs }, (_, i) => startAyah + i).map(
          (ayahNum) => {
            const inRange = ayahNum >= min && ayahNum <= max;
            const isEdge = ayahNum === min || ayahNum === max;
            const isDragHover = isDragging && hoverAyah === ayahNum;

            return (
              <button
                type="button"
                key={ayahNum}
                data-ayah={ayahNum}
                onPointerDown={(e) => handlePointerDown(e, ayahNum)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    commitRange(ayahNum, ayahNum);
                  }
                }}
                aria-pressed={inRange}
                aria-label={`${language === "en" ? "Ayah" : "Ayat"} ${ayahNum}`}
                className={`relative flex h-9 touch-none select-none items-center justify-center rounded-xl border text-xs font-bold outline-none transition-all focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] sm:h-10 ${
                  isEdge
                    ? "z-10 scale-105 border-[#c2410c] bg-brand-solid font-black text-white shadow-xs ring-2 ring-[#f79009]"
                    : inRange
                      ? "border-brand-200 bg-brand-50 font-bold text-brand-700"
                      : "border-secondary bg-primary text-secondary hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                } ${isDragHover ? "ring-2 ring-[#f79009] ring-offset-1" : ""}`}
              >
                <span className="pointer-events-none">{ayahNum}</span>
              </button>
            );
          },
        )}
      </div>

      <p className="text-center text-[10px] text-quaternary">
        {language === "en"
          ? "Tap an ayah or sweep finger/cursor to select a range of verses."
          : "Ketuk nomor ayat atau sapukan jari/mouse untuk memilih rentang ayat bermasalah."}
      </p>
    </div>
  );
};
