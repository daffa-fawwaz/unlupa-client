import React, { useState, useEffect } from "react";
import { QuranPageItem, Language } from "../../types";
import { useApp } from "../../context/AppContext";
import { isDue, isReviewedToday, predictQuranIntervals } from "../../lib/fsrs";
import { AudioStorageService } from "../../lib/AudioStorageService";
import { AudioRecorderPlayer } from "../shared/AudioRecorderPlayer";
import {
  Play,
  Power,
  Sparkles,
  MessageSquare,
  Eye,
  Flame,
  Brain,
  CalendarClock,
  Plus,
  Mic,
  Check,
  Lock,
} from "@/components/foundations/hugeicons";

interface Props {
  page: QuranPageItem;
  language: Language;
  onToggleActive: (pageNumber: number) => void;
  onOpenMapanModal: (page: QuranPageItem) => void;
  onOpenFeedbackModal: (page: QuranPageItem) => void;
  onOpenMushafViewer: (pageNumber: number) => void;
  onInlineReview?: (pageNumber: number, rating: 1 | 2 | 3 | 4) => void;
  isJustReviewed?: boolean;
  justReviewedRating?: 1 | 2 | 3 | 4;
  isReadOnly?: boolean;
}

export const QuranPageCard: React.FC<Props> = ({
  page,
  language,
  onToggleActive,
  onOpenMapanModal,
  onOpenFeedbackModal,
  onOpenMushafViewer,
  onInlineReview,
  isJustReviewed,
  justReviewedRating,
  isReadOnly = false,
}) => {
  const { isReadOnlyMode } = useApp();
  const effectiveReadOnly = isReadOnly || isReadOnlyMode;
  const [showAudio, setShowAudio] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    let mounted = true;
    AudioStorageService.hasAudio(page.pageNumber).then((exists) => {
      if (mounted) setHasAudio(exists);
    });

    const handleAudioChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ itemId: string | number }>;
      if (String(customEvent.detail?.itemId) === String(page.pageNumber)) {
        AudioStorageService.hasAudio(page.pageNumber).then((exists) => {
          if (mounted) setHasAudio(exists);
        });
      }
    };

    window.addEventListener("audio-updated", handleAudioChange);
    return () => {
      mounted = false;
      window.removeEventListener("audio-updated", handleAudioChange);
    };
  }, [page.pageNumber]);

  const isDueToday = isDue(page.fsrsData.nextReview, page.isActive);
  const reviewedToday = isReviewedToday(page.fsrsData.lastReview);
  const showDimmed = reviewedToday && !isDueToday;
  const isMapan =
    page.status === "mastered_for_now" ||
    !!page.mapanCelebrated ||
    (page.fsrsData.stability || 0) * 0.4025587 >= 30;

  const formatAccurateDueDate = () => {
    if (!page.fsrsData.nextReview)
      return language === "en" ? "Today" : "Hari ini";
    const nextDate = new Date(page.fsrsData.nextReview);
    const now = new Date();
    const isOverdue = nextDate <= now;
    const formatted = nextDate.toLocaleDateString(
      language === "id" ? "id-ID" : "en-US",
      {
        day: "numeric",
        month: "short",
      },
    );
    if (isOverdue) {
      return language === "en"
        ? `Today (${formatted})`
        : `Hari ini (${formatted})`;
    }
    return formatted;
  };

  const getFullDueDateStr = () => {
    if (!page.fsrsData.nextReview)
      return language === "en" ? "Today" : "Hari ini";
    const nextDate = new Date(page.fsrsData.nextReview);
    return nextDate.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const unresolvedIssuesCount = page.issues
    ? page.issues.filter((i) => !i.isResolved).length
    : 0;

  return (
    <div
      className={`relative flex min-w-0 flex-col rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-200 dark:bg-slate-900 sm:p-4 ${
        isDueToday
          ? "border-amber-300 bg-amber-50/35 shadow-amber-200/40 hover:border-amber-400 dark:border-amber-700 dark:bg-amber-950/20 dark:shadow-amber-950/20"
          : showDimmed
            ? "border-emerald-200 bg-emerald-50/25 shadow-emerald-100/40 hover:border-emerald-300 dark:border-emerald-900 dark:bg-emerald-950/15 dark:shadow-emerald-950/20"
            : page.isActive
              ? "border-slate-200 hover:border-orange-200 hover:shadow-md dark:border-slate-700 dark:hover:border-orange-800"
              : "border-dashed border-slate-300 bg-slate-50/70 shadow-none hover:border-orange-200 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-orange-800"
      }`}
    >
      <div
        className={`absolute inset-x-4 top-0 h-0.5 rounded-b-full ${
          isDueToday
            ? "bg-amber-400"
            : showDimmed
              ? "bg-emerald-400"
              : page.isActive
                ? "bg-orange-500"
                : "bg-slate-300 dark:bg-slate-600"
        }`}
      />

      <div className="flex min-w-0 items-start justify-between gap-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              !effectiveReadOnly && onToggleActive(page.pageNumber)
            }
            disabled={effectiveReadOnly}
            aria-pressed={page.isActive}
            aria-label={
              page.isActive
                ? language === "en"
                  ? "Deactivate page"
                  : "Nonaktifkan halaman"
                : language === "en"
                  ? "Activate page"
                  : "Aktifkan halaman"
            }
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-xs outline-none transition-all focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] ${
              effectiveReadOnly
                ? "cursor-default"
                : "cursor-pointer hover:scale-105 active:scale-95"
            } ${
              page.isActive
                ? "border-orange-600 bg-orange-600 text-white shadow-orange-200/60 dark:border-orange-500 dark:bg-orange-600 dark:shadow-orange-950/40"
                : "border-slate-200 bg-slate-100 text-slate-500 hover:border-orange-200 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-orange-800 dark:hover:text-orange-400"
            }`}
            title={
              page.isActive
                ? language === "en"
                  ? "Active Page"
                  : "Halaman Aktif"
                : language === "en"
                  ? "Inactive Page"
                  : "Halaman Belum Aktif"
            }
          >
            {page.isActive ? (
              <Play className="ml-0.5 size-3.5 fill-white" />
            ) : (
              <Power className="size-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenMushafViewer(page.pageNumber)}
            className="group min-w-0 flex-1 cursor-pointer rounded-lg text-left outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905]"
            title={
              language === "en"
                ? "Click to open Mushaf"
                : "Klik untuk buka Mushaf"
            }
          >
            <div className="flex min-w-0 items-baseline gap-1.5">
              <span className="shrink-0 text-sm font-bold text-slate-950 transition-colors group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-400">
                {language === "en"
                  ? "Page"
                  : language === "id"
                    ? "Hal"
                    : "صفحة"}{" "}
                {page.pageNumber}
              </span>
              <span className="text-xs text-slate-300 dark:text-slate-600">
                /
              </span>
              <span className="truncate text-xs font-semibold text-slate-700 transition-colors group-hover:text-orange-700 dark:text-slate-200 dark:group-hover:text-orange-400">
                {page.surahNameEn}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {language === "en" ? "Verse" : language === "id" ? "Ayat" : "آية"}{" "}
              {page.ayahRange}
              <span className="ml-1.5 text-slate-400 dark:text-slate-500">
                Juz {page.juzNumber}
              </span>
            </p>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onOpenFeedbackModal(page)}
            className={`relative flex size-8 cursor-pointer items-center justify-center rounded-lg border shadow-xs outline-none transition-all hover:scale-105 active:scale-95 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] ${unresolvedIssuesCount > 0 ? "border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400" : "border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-orange-800 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"}`}
            title={language === "en" ? "Evaluation Notes" : "Catatan Evaluasi"}
          >
            <MessageSquare className="size-3.5" />
            {unresolvedIssuesCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full border border-white bg-rose-600 text-[8px] font-bold text-white shadow-sm dark:border-slate-900">
                {unresolvedIssuesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowAudio(!showAudio)}
            aria-pressed={showAudio}
            className={`relative flex size-8 cursor-pointer items-center justify-center rounded-lg border shadow-xs outline-none transition-all hover:scale-105 active:scale-95 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] ${
              hasAudio
                ? "border-indigo-300 bg-indigo-50 text-indigo-600 shadow-indigo-200/40 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:shadow-indigo-950/30"
                : showAudio
                  ? "border-indigo-300 bg-indigo-100 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200"
                  : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
            }`}
            title={
              language === "en"
                ? "Voice Recording (Self Tasmi')"
                : "Rekaman Suara Tasmi' Mandiri (24 Jam)"
            }
          >
            <Mic className="size-3.5" />
            {hasAudio && (
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenMushafViewer(page.pageNumber)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-700 shadow-xs outline-none transition-all hover:scale-105 hover:border-orange-300 hover:bg-orange-100 active:scale-95 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] dark:border-orange-900 dark:bg-orange-950/35 dark:text-orange-300 dark:hover:border-orange-800 dark:hover:bg-orange-950/60"
            title={
              language === "en" ? "View Printed Mushaf" : "Lihat Mushaf Cetak"
            }
          >
            <Eye className="size-4" />
          </button>
        </div>
      </div>

      {(isDueToday || isMapan) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {isDueToday && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {language === "en" ? "Due today" : "Jatuh tempo"}
            </span>
          )}
          {isMapan && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMapanModal(page);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800 shadow-xs outline-none transition-all hover:border-emerald-400 hover:bg-emerald-100 active:scale-95 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
              title={
                language === "en"
                  ? "Customize Mastered Murajaah Rhythm"
                  : "Atur Ritme Murajaah Mapan"
              }
            >
              <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>{language === "en" ? "Mastered" : "Mapan"}</span>
              {page.mapanSchedule?.mode === "weekly" && (
                <span className="font-medium opacity-80">• Mingguan</span>
              )}
              {page.mapanSchedule?.mode === "monthly" && (
                <span className="font-medium opacity-80">• Bulanan</span>
              )}
            </button>
          )}
        </div>
      )}

      {page.isActive ? (
        <div className="mt-3 border-t border-slate-200/80 pt-3 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-1.5">
            <div
              className="flex min-w-0 items-center gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50/70 px-2 py-1.5 text-slate-700 dark:border-amber-900/70 dark:bg-amber-950/25 dark:text-slate-300"
              title={
                language === "en"
                  ? `Reviewed: ${page.fsrsData.reps} times`
                  : `Sudah direview: ${page.fsrsData.reps} kali`
              }
            >
              <Flame className="size-3.5 shrink-0 text-amber-500" />
              <div className="min-w-0 leading-none">
                <span className="block truncate text-[9px] font-medium text-slate-500 dark:text-slate-400">
                  {language === "en" ? "Reviews" : "Review"}
                </span>
                <span className="mt-1 block text-[11px] font-bold">
                  {page.fsrsData.reps}×
                </span>
              </div>
            </div>

            <div
              className="flex min-w-0 items-center gap-1.5 rounded-xl border border-indigo-200/80 bg-indigo-50/70 px-2 py-1.5 text-slate-700 dark:border-indigo-900/70 dark:bg-indigo-950/25 dark:text-slate-300"
              title={
                language === "en"
                  ? `Stability: ${(page.fsrsData.stability || 0).toFixed(1)} days`
                  : `Stabilitas memori: ${(page.fsrsData.stability || 0).toFixed(1)} hari`
              }
            >
              <Brain className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <div className="min-w-0 leading-none">
                <span className="block truncate text-[9px] font-medium text-slate-500 dark:text-slate-400">
                  {language === "en" ? "Memory" : "Memori"}
                </span>
                <span className="mt-1 block text-[11px] font-bold">
                  {page.fsrsData.stability
                    ? page.fsrsData.stability >= 1
                      ? `${page.fsrsData.stability.toFixed(1)}h`
                      : `${(page.fsrsData.stability * 24).toFixed(0)}j`
                    : "0h"}
                </span>
              </div>
            </div>

            <div
              className={`flex min-w-0 items-center gap-1.5 rounded-xl border px-2 py-1.5 ${isDueToday ? "border-amber-300 bg-amber-100/80 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300" : "border-sky-200/80 bg-sky-50/70 text-slate-700 dark:border-sky-900/70 dark:bg-sky-950/25 dark:text-slate-300"}`}
              title={
                language === "en"
                  ? `Due Date: ${getFullDueDateStr()}`
                  : `Jatuh tempo: ${getFullDueDateStr()}`
              }
            >
              <CalendarClock
                className={`size-3.5 shrink-0 ${isDueToday ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400"}`}
              />
              <div className="min-w-0 leading-none">
                <span
                  className={`block truncate text-[9px] font-medium ${isDueToday ? "text-amber-700 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {language === "en" ? "Next" : "Berikutnya"}
                </span>
                <span className="mt-1 block truncate text-[10px] font-bold">
                  {formatAccurateDueDate()}
                </span>
              </div>
            </div>
          </div>

          {effectiveReadOnly ? (
            <div className="mt-2.5 flex justify-end">
              {isMapan ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10.5px] font-semibold text-indigo-700 shadow-xs dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Sparkles className="size-3 text-indigo-500" />
                  <span>{language === "en" ? "Mastered" : "Mapan"}</span>
                </span>
              ) : isDueToday ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-700 shadow-xs dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
                  <span>{language === "en" ? "Due Today" : "Jatuh Tempo"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {language === "en" ? "Reviewed" : "Sudah Direview"}
                  </span>
                </span>
              )}
            </div>
          ) : isDueToday ? (
            (() => {
              const intervals = predictQuranIntervals(
                page.fsrsData,
                page.mapanSchedule,
              );
              const isRating3Unlocked =
                (page.fsrsData.stability || 0) > 30 ||
                page.status === "mastered_for_now" ||
                !!page.mapanCelebrated;

              return (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {language === "en" ? "Quick review" : "Review cepat"}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                      {language === "en"
                        ? "Choose recall quality"
                        : "Pilih kualitas hafalan"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onInlineReview && onInlineReview(page.pageNumber, 1)
                      }
                      disabled={!onInlineReview}
                      className={`flex min-h-11 flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-center shadow-xs outline-none transition-all active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] disabled:cursor-not-allowed disabled:opacity-60 ${
                        isJustReviewed && justReviewedRating === 1
                          ? "cursor-default border-rose-600 bg-rose-600 text-white shadow-rose-200/70 dark:border-rose-500 dark:bg-rose-600 dark:shadow-rose-950/40"
                          : "cursor-pointer border-rose-300 bg-rose-50/90 font-bold text-rose-800 hover:border-rose-400 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
                      }`}
                      title={`1 • Again (${intervals.needReviewDays}${language === "en" ? "d" : "h"})`}
                    >
                      <span
                        className={`text-[9px] font-semibold leading-none ${isJustReviewed && justReviewedRating === 1 ? "text-white/80" : "text-rose-600 dark:text-rose-400"}`}
                      >
                        {intervals.needReviewDays}
                        {language === "en" ? "d" : "h"}
                      </span>
                      <span className="mt-1 text-[11px] font-bold leading-tight">
                        Again
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onInlineReview && onInlineReview(page.pageNumber, 2)
                      }
                      disabled={!onInlineReview}
                      className={`flex min-h-11 flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-center shadow-xs outline-none transition-all active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] disabled:cursor-not-allowed disabled:opacity-60 ${
                        isJustReviewed && justReviewedRating === 2
                          ? "cursor-default border-blue-600 bg-blue-600 text-white shadow-blue-200/70 dark:border-blue-500 dark:bg-blue-600 dark:shadow-blue-950/40"
                          : "cursor-pointer border-blue-300 bg-blue-50/90 font-bold text-blue-800 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70"
                      }`}
                      title={`2 • Hard (${intervals.hardDays}${language === "en" ? "d" : "h"})`}
                    >
                      <span
                        className={`text-[9px] font-semibold leading-none ${isJustReviewed && justReviewedRating === 2 ? "text-white/80" : "text-blue-600 dark:text-blue-400"}`}
                      >
                        {intervals.hardDays}
                        {language === "en" ? "d" : "h"}
                      </span>
                      <span className="mt-1 text-[11px] font-bold leading-tight">
                        Hard
                      </span>
                    </button>

                    {isRating3Unlocked ? (
                      <button
                        type="button"
                        onClick={() =>
                          onInlineReview && onInlineReview(page.pageNumber, 3)
                        }
                        disabled={!onInlineReview}
                        className={`animate-in fade-in flex min-h-11 flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-center shadow-xs outline-none transition-all active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] disabled:cursor-not-allowed disabled:opacity-60 ${
                          isJustReviewed && justReviewedRating === 3
                            ? "cursor-default border-emerald-600 bg-emerald-600 text-white shadow-emerald-200/70 dark:border-emerald-500 dark:bg-emerald-600 dark:shadow-emerald-950/40"
                            : "cursor-pointer border-emerald-300 bg-emerald-50/90 font-bold text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                        }`}
                        title={`3 • Mutqin (${intervals.goodDays}${language === "en" ? "d" : "h"})`}
                      >
                        <span
                          className={`text-[9px] font-semibold leading-none ${isJustReviewed && justReviewedRating === 3 ? "text-white/80" : "text-emerald-600 dark:text-emerald-400"}`}
                        >
                          {intervals.goodDays}
                          {language === "en" ? "d" : "h"}
                        </span>
                        <span className="mt-1 text-[11px] font-bold leading-tight">
                          Good
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex min-h-11 cursor-not-allowed select-none flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-100/80 px-2 py-1.5 text-slate-400 opacity-75 shadow-xs dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500"
                        title={
                          language === "en"
                            ? "Locked: Requires memory stability > 30 days"
                            : "Terkunci: Memerlukan stabilitas memori > 30 hari"
                        }
                      >
                        <Lock className="mb-1 size-3 text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] font-semibold leading-none">
                          Mutqin
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="mt-2.5 flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>{language === "en" ? "Reviewed" : "Sudah Direview"}</span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-3 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {language === "en" ? "Not activated" : "Belum diaktivasi"}
          </span>
          {!effectiveReadOnly && (
            <button
              type="button"
              onClick={() => onToggleActive(page.pageNumber)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-orange-600 bg-orange-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs shadow-orange-200/60 outline-none transition-all hover:border-orange-700 hover:bg-orange-700 active:scale-95 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905] dark:border-orange-500 dark:bg-orange-600 dark:shadow-orange-950/40 dark:hover:border-orange-400 dark:hover:bg-orange-500"
            >
              <Plus className="size-3" />
              <span>{language === "en" ? "Activate" : "Aktivasi"}</span>
            </button>
          )}
        </div>
      )}

      {showAudio && (
        <div className="mt-3 rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-2.5 dark:border-indigo-900/70 dark:bg-indigo-950/20">
          <AudioRecorderPlayer
            itemId={page.pageNumber}
            itemType="quran"
            itemLabel={`Hal ${page.pageNumber}`}
            language={language}
            compact={true}
            onHasRecordingChange={setHasAudio}
          />
        </div>
      )}
    </div>
  );
};
