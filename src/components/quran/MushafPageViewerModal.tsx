import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Loader2,
  CheckCircle2,
  Download,
  MessageSquare,
} from "@/components/foundations/hugeicons";
import {
  getSurahForPage,
  getJuzForPage,
  getQuranPageImageUrl,
  MUSHAF_SAMPLE_SNIPPETS,
} from "../../data/quranData";
import {
  getOfflinePageUrl,
  cachePageOffline,
  isPageCachedOffline,
} from "../../lib/offlineStorage";
import { AudioRecorderPlayer } from "../shared/AudioRecorderPlayer";
import { MurottalPlayer } from "../shared/MurottalPlayer";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";

interface Props {
  pageNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigatePage?: (newPage: number) => void;
  onOpenFeedback?: (pageNumber: number) => void;
}

export const MushafPageViewerModal: React.FC<Props> = ({
  pageNumber,
  isOpen,
  onClose,
  onNavigatePage,
  onOpenFeedback,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [isCaching, setIsCaching] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setImageError(false);
    setZoomLevel(1);

    // Check local offline storage first for 0ms instant loading
    (async () => {
      const cachedUrl = await getOfflinePageUrl(pageNumber);
      if (isMounted) {
        if (cachedUrl) {
          setLocalImageUrl(cachedUrl);
          setIsCached(true);
          setImageLoading(false);
        } else {
          setLocalImageUrl(null);
          setIsCached(false);
          setImageLoading(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [pageNumber]);

  const handleManualCache = async () => {
    setIsCaching(true);
    const ok = await cachePageOffline(pageNumber);
    if (ok) {
      setIsCached(true);
      const url = await getOfflinePageUrl(pageNumber);
      if (url) setLocalImageUrl(url);
    }
    setIsCaching(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      // Don't trigger if user is typing
      const target = e.target as HTMLElement;
      if (
        target &&
        ["input", "textarea", "select"].includes(target.tagName.toLowerCase())
      ) {
        return;
      }

      if (
        e.key === "ArrowLeft" &&
        e.altKey &&
        onNavigatePage &&
        pageNumber < 604
      ) {
        // Alt + ArrowLeft: Next page
        e.preventDefault();
        onNavigatePage(pageNumber + 1);
      } else if (
        e.key === "ArrowRight" &&
        e.altKey &&
        onNavigatePage &&
        pageNumber > 1
      ) {
        // Alt + ArrowRight: Prev page
        e.preventDefault();
        onNavigatePage(pageNumber - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, pageNumber, onNavigatePage]);

  // Swipe support for Mushaf page flipping
  useSwipeGesture(null, {
    disabled: !isOpen || zoomLevel > 1,
    onSwipeLeft: () => {
      // Swipe left -> advance to next page
      if (onNavigatePage && pageNumber < 604) {
        onNavigatePage(pageNumber + 1);
      }
    },
    onSwipeRight: () => {
      // Swipe right -> return to previous page or close on page 1
      if (onNavigatePage && pageNumber > 1) {
        onNavigatePage(pageNumber - 1);
      } else if (pageNumber === 1) {
        onClose();
      }
    },
    threshold: 40,
  });

  if (!isOpen) return null;

  const juzNum = getJuzForPage(pageNumber);
  const surahInfo = getSurahForPage(pageNumber);
  const imageUrl = getQuranPageImageUrl(pageNumber, 1260);

  const snippet = MUSHAF_SAMPLE_SNIPPETS[pageNumber] || {
    bismillah: pageNumber > 1 && pageNumber !== 187,
    header: `سُورَةُ ${surahInfo.nameAr}`,
    lines: [
      `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`,
      `آيَاتُ الْقُرْآنِ الْكَرِيمِ — الصَّفْحَةُ ${pageNumber}`,
      `تِلَاوَةٌ مُبَارَكَةٌ مِنْ ${surahInfo.nameAr} (الآيات ${surahInfo.ayahRange})`,
      `حِفْظُ وَمُرَاجَعَةُ كِتَابِ اللَّهِ بِإِتْقَانٍ وَثَبَاتٍ`,
      `وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ`,
      `اقْرَأْ وَارْتَقِ وَرَتِّلْ كَمَا كُنْتَ تُرَتِّلُ فِي الدُّنْيَا`,
      `إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ`,
    ],
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const resetZoom = () => setZoomLevel(1);

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => !open && onClose()}
      className="px-2 py-2 sm:px-4 sm:py-4"
    >
      <Modal className="max-w-6xl overflow-hidden rounded-3xl border border-secondary bg-primary shadow-2xl">
        <Dialog
          aria-label={`Mushaf halaman ${pageNumber}, ${surahInfo.nameEn}`}
          className="flex h-[calc(100dvh-1rem)] max-h-[920px] flex-col overflow-hidden sm:h-[92dvh]"
        >
          <header className="relative shrink-0 overflow-hidden border-b border-secondary bg-primary">
            <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-brand-100/55 blur-3xl" />
            <div className="relative flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white shadow-md shadow-brand-500/20">
                  <BookOpen className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-primary sm:text-base">
                      Mushaf Madani
                    </h2>
                    <span className="rounded-lg bg-brand-50 px-2 py-1 text-[10px] font-bold text-brand-700 ring-1 ring-brand-200 ring-inset">
                      Halaman {pageNumber} / 604
                    </span>
                    <span className="rounded-lg bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary">
                      Juz {juzNum}
                    </span>
                  </div>
                  <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-secondary">
                    <span className="truncate font-medium">
                      {surahInfo.nameEn} · Ayat {surahInfo.ayahRange}
                    </span>
                    <span
                      className="hidden shrink-0 font-serif text-brand-700 sm:inline"
                      dir="rtl"
                    >
                      سُورَةُ {surahInfo.nameAr}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup Mushaf"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-fg-quaternary outline-none transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              className="relative flex items-center gap-2 overflow-x-auto border-t border-secondary bg-secondary/30 px-4 py-2.5 sm:px-5"
              data-no-swipe="true"
            >
              <div className="hidden shrink-0 sm:block">
                <MurottalPlayer pageNumber={pageNumber} />
              </div>

              {onOpenFeedback && (
                <button
                  type="button"
                  onClick={() => onOpenFeedback(pageNumber)}
                  className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl bg-brand-solid px-3 py-2 text-xs font-semibold text-white shadow-xs outline-none transition hover:bg-brand-solid_hover focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905]"
                  title="Buka atau catat koreksi tajwid dan hafalan"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Evaluasi</span>
                </button>
              )}

              {isCached ? (
                <span className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#a6f4c5] bg-[#ecfdf3] px-3 py-2 text-[11px] font-semibold text-[#067647] dark:border-[#085d3a] dark:bg-[#052e22]/60 dark:text-[#47cd89]">
                  <CheckCircle2 className="size-3.5" />
                  Tersimpan offline
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleManualCache}
                  disabled={isCaching}
                  className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-secondary bg-primary px-3 py-2 text-[11px] font-semibold text-secondary outline-none transition hover:border-brand-200 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905]"
                  title="Simpan halaman agar bisa dibuka tanpa internet"
                >
                  {isCaching ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  {isCaching ? "Menyimpan..." : "Simpan offline"}
                </button>
              )}

              <div className="ml-auto hidden shrink-0 items-center rounded-xl border border-secondary bg-primary p-1 sm:flex">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.75}
                  className="flex size-7 items-center justify-center rounded-lg text-tertiary outline-none transition hover:bg-secondary hover:text-primary disabled:opacity-30 focus-visible:outline-[2px] focus-visible:outline-[#ef6905]"
                  title="Perkecil"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="min-w-14 px-2 py-1 text-[11px] font-semibold tabular-nums text-secondary outline-none focus-visible:outline-[2px] focus-visible:outline-[#ef6905]"
                  title="Kembalikan ke 100%"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 2.5}
                  className="flex size-7 items-center justify-center rounded-lg text-tertiary outline-none transition hover:bg-secondary hover:text-primary disabled:opacity-30 focus-visible:outline-[2px] focus-visible:outline-[#ef6905]"
                  title="Perbesar"
                >
                  <ZoomIn className="size-3.5" />
                </button>
              </div>

              {onNavigatePage && (
                <div className="flex shrink-0 items-center rounded-xl border border-secondary bg-primary p-1">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => onNavigatePage(pageNumber - 1)}
                    className="flex size-7 items-center justify-center rounded-lg text-tertiary outline-none transition hover:bg-secondary hover:text-primary disabled:opacity-30 focus-visible:outline-[2px] focus-visible:outline-[#ef6905]"
                    title="Halaman sebelumnya"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="min-w-16 px-2 text-center text-[11px] font-semibold tabular-nums text-secondary">
                    {pageNumber} / 604
                  </span>
                  <button
                    type="button"
                    disabled={pageNumber >= 604}
                    onClick={() => onNavigatePage(pageNumber + 1)}
                    className="flex size-7 items-center justify-center rounded-lg text-tertiary outline-none transition hover:bg-secondary hover:text-primary disabled:opacity-30 focus-visible:outline-[2px] focus-visible:outline-[#ef6905]"
                    title="Halaman selanjutnya"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </header>

          {onNavigatePage && (
            <>
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => onNavigatePage(pageNumber - 1)}
                aria-label="Halaman sebelumnya"
                className="absolute left-3 top-1/2 z-40 hidden size-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary/90 text-secondary shadow-lg backdrop-blur outline-none transition hover:bg-brand-solid hover:text-white disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] md:flex"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                disabled={pageNumber >= 604}
                onClick={() => onNavigatePage(pageNumber + 1)}
                aria-label="Halaman selanjutnya"
                className="absolute right-3 top-1/2 z-40 hidden size-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary/90 text-secondary shadow-lg backdrop-blur outline-none transition hover:bg-brand-solid hover:text-white disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] md:flex"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <main className="relative min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_50%_8%,#fff7ed_0%,#eee7dc_52%,#ddd4c6_100%)] p-3 dark:bg-[radial-gradient(circle_at_50%_8%,#263244_0%,#111827_58%,#0b1220_100%)] sm:p-5">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#eee7dc]/90 backdrop-blur-sm dark:bg-[#111827]/90">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg ring-1 ring-secondary ring-inset">
                  <Loader2 className="size-5 animate-spin text-brand-600" />
                </div>
                <p className="mt-3 text-xs font-semibold text-secondary">
                  Memuat halaman Mushaf {pageNumber}...
                </p>
              </div>
            )}

            <div className="flex min-h-full min-w-full items-center justify-center">
              {!imageError ? (
                <div
                  className="flex origin-top items-start justify-center transition-transform duration-200 ease-out"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <div className="relative rounded-[1.35rem] bg-[#fffdf7] p-1.5 shadow-[0_24px_70px_-28px_rgba(67,20,7,0.55)] ring-1 ring-[#d6c4a8] sm:p-2">
                    <div className="pointer-events-none absolute inset-y-5 -right-1.5 w-2 rounded-r-md bg-[repeating-linear-gradient(90deg,#fffdf8_0px,#fffdf8_1px,#e8dfd1_1px,#e8dfd1_2px)] shadow-sm" />
                    <img
                      src={localImageUrl || imageUrl}
                      alt={`Halaman Mushaf Al-Quran ${pageNumber}`}
                      onLoad={() => {
                        setImageLoading(false);
                        if (!isCached) {
                          cachePageOffline(pageNumber).then((ok) => {
                            if (ok) setIsCached(true);
                          });
                        }
                      }}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                      className="max-h-[calc(100dvh-230px)] w-auto max-w-[calc(100vw-2.5rem)] select-none rounded-xl object-contain sm:max-h-[calc(92dvh-210px)] sm:max-w-[calc(100vw-5rem)]"
                      loading="eager"
                    />
                  </div>
                </div>
              ) : (
                <div className="my-auto w-full max-w-xl rounded-3xl border border-[#d6c4a8] bg-[#fffdf5] p-5 text-slate-900 shadow-2xl sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-amber-800/20 px-2 pb-3 text-xs font-semibold text-amber-900">
                    <span className="font-serif">الجُزْءُ {juzNum}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 font-bold">
                      {surahInfo.nameEn} ({surahInfo.ayahRange})
                    </span>
                    <span className="font-serif text-sm">
                      سُورَةُ {surahInfo.nameAr}
                    </span>
                  </div>

                  <div className="my-3 rounded-xl bg-amber-100/70 px-4 py-2 text-center text-amber-950 ring-1 ring-amber-800/20 ring-inset">
                    <p className="font-serif text-lg font-bold">
                      {snippet.header}
                    </p>
                  </div>

                  {snippet.bismillah && (
                    <div className="my-3 py-1 text-center">
                      <p className="font-serif text-xl leading-loose text-amber-950 sm:text-2xl">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    </div>
                  )}

                  <div className="my-4 space-y-4 px-2">
                    {snippet.lines.map((line, idx) => (
                      <p
                        key={idx}
                        className="text-center font-serif text-xl leading-[2.2] text-slate-900 sm:text-2xl"
                        dir="rtl"
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-center border-t border-amber-800/20 pt-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-amber-100/70 font-serif text-sm font-bold text-amber-950 ring-1 ring-amber-800/30 ring-inset">
                      {pageNumber}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          <footer className="shrink-0 border-t border-secondary bg-primary px-3 py-2 shadow-[0_-8px_24px_-20px_rgba(16,24,40,0.45)] sm:px-5">
            <AudioRecorderPlayer
              itemId={pageNumber}
              itemType="quran"
              itemLabel={`Hal ${pageNumber}`}
              language="id"
              variant="mushaf-dock"
              onOpenFeedback={
                onOpenFeedback ? () => onOpenFeedback(pageNumber) : undefined
              }
            />
          </footer>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
