import React, { useState, useEffect } from "react";
import {
  isDue,
  QuranIntervalClusterKey,
  isReviewedToday,
} from "../../lib/fsrs";
import { useApp } from "../../context/AppContext";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { JUZ_LIST } from "../../data/quranData";
import { QuranPageItem } from "../../types";
import { QuranReviewModal } from "./QuranReviewModal";
import { MushafPageViewerModal } from "./MushafPageViewerModal";
import { MapanScheduleModal } from "./MapanScheduleModal";
import { QuranPageFeedbackModal } from "./QuranPageFeedbackModal";
import { QuranPageCard } from "./QuranPageCard";
import { QuranJuz30Tracker } from "./QuranJuz30Tracker";
import { IntervalPagesModal } from "./IntervalPagesModal";
import { ConnectedClassesModal } from "./ConnectedClassesModal";
import { QuranReviewCalendarModal } from "./QuranReviewCalendarModal";
import { UnifiedDueCard } from "../common/UnifiedDueCard";
import { getJuzOfflineStatus, cacheJuzOffline } from "../../lib/offlineStorage";
import { useQuranCatalog } from "@/features/alquran/hooks/useQuranCatalog";
import { quranPageService } from "@/features/alquran/services/quranPage.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  FileText,
  Search,
  ArrowLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Plus,
  CalendarCheck,
  LayoutGrid,
  List,
  CloudDownload,
  Loader2,
  Users,
} from "@/components/foundations/hugeicons";

export const QuranSpace: React.FC = () => {
  const {
    quranPages,
    activateQuranPage,
    deactivateQuranPage,
    reviewQuranPage,
    language,
    joinClassByCode,
    myClasses,
    leaveClass,
    setActiveSpace,
    spaceResetCounter,
    isFeatureAllowed,
    openUpgradeModal,
    inspectingStudentId,
    isReadOnlyMode,
    isTeacherMode,
  } = useApp();

  const isReadOnly = Boolean(
    isReadOnlyMode || (isTeacherMode && inspectingStudentId),
  );

  // Navigation state between Screen 1 (Dashboard) and Screen 2 (Juz Page List)
  const [selectedJuzNumber, setSelectedJuzNumber] = useState<number | null>(
    null,
  );
  const [activeFilterTab, setActiveFilterTab] = useState<
    "all" | "due" | "active" | "mapan"
  >("all");
  const [viewDensity, setViewDensity] = useState<"grid" | "compact">("grid");
  const [juzSearchQuery, setJuzSearchQuery] = useState("");

  // Live Database Hook via useQuranCatalog (supports querying inspectingStudentId for teacher)
  const {
    juzList,
    isJuzListLoading,
    refetchJuzList,
    currentJuzData,
    isPagesLoading,
    refetchPages,
    activatePage,
  } = useQuranCatalog(selectedJuzNumber, inspectingStudentId);

  const handleTogglePageActive = async (pageNumber: number) => {
    if (isReadOnly) return;
    const target = displayedCatalogPages.find(
      (p) => p.pageNumber === pageNumber,
    );
    if (!target) return;
    if (target.isActive) {
      deactivateQuranPage(pageNumber);
    } else {
      const check = isFeatureAllowed("quran_juz", target.juzNumber);
      if (!check.allowed) {
        openUpgradeModal(
          check.reason,
          language === "en"
            ? `Free plan allows up to ${check.limit} active Juz concurrently. Upgrade to Unlupa Pro to memorize and review all 30 Juz simultaneously.`
            : `Akun Free dibatasi hingga ${check.limit} Juz aktif sekaligus. Upgrade ke Unlupa Pro untuk mengaktifkan seluruh 30 Juz tanpa batas.`,
        );
        return;
      }
      try {
        await activatePage(pageNumber);
        activateQuranPage(pageNumber);
      } catch (err) {
        console.warn("Backend activate failed, updating local state:", err);
        activateQuranPage(pageNumber);
      }
    }
  };

  // Reset to root dashboard if user clicks Quran space tab
  useEffect(() => {
    if (spaceResetCounter?.space === "quran" && spaceResetCounter.count > 0) {
      queueMicrotask(() => setSelectedJuzNumber(null));
    }
  }, [spaceResetCounter]);

  const [inputClassCode, setInputClassCode] = useState("");
  const [joinStatus, setJoinStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Offline caching status for current Juz
  const [juzOfflineStatus, setJuzOfflineStatus] = useState<{
    total: number;
    cached: number;
    isFullyCached: boolean;
  } | null>(null);
  const [isDownloadingJuz, setIsDownloadingJuz] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [isConnectedClassesOpen, setIsConnectedClassesOpen] = useState(false);

  useEffect(() => {
    if (!selectedJuzNumber) return;
    let isCurrent = true;
    void getJuzOfflineStatus(selectedJuzNumber).then((status) => {
      if (isCurrent) setJuzOfflineStatus(status);
    });
    return () => {
      isCurrent = false;
    };
  }, [selectedJuzNumber]);

  const handleDownloadJuz = async () => {
    if (!selectedJuzNumber || isDownloadingJuz) return;
    setIsDownloadingJuz(true);
    setDownloadProgress({ current: 0, total: 20 });
    await cacheJuzOffline(selectedJuzNumber, (current, total) => {
      setDownloadProgress({ current, total });
    });
    const updated = await getJuzOfflineStatus(selectedJuzNumber);
    setJuzOfflineStatus(updated);
    setIsDownloadingJuz(false);
    setDownloadProgress(null);
  };

  // Modals state
  const [reviewModalConfig, setReviewModalConfig] = useState<{
    isOpen: boolean;
    juzFilter: number | null;
  }>({
    isOpen: false,
    juzFilter: null,
  });
  const [previewPageNumber, setPreviewPageNumber] = useState<number | null>(
    null,
  );
  const [justReviewedPage, setJustReviewedPage] = useState<{
    pageNumber: number;
    rating: 1 | 2 | 3 | 4;
  } | null>(null);
  const [selectedMapanPage, setSelectedMapanPage] =
    useState<QuranPageItem | null>(null);
  const [isMapanModalOpen, setIsMapanModalOpen] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState<QuranPageItem | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isQuranCalendarOpen, setIsQuranCalendarOpen] = useState(false);
  const [intervalModalConfig, setIntervalModalConfig] = useState<{
    isOpen: boolean;
    clusterKey: QuranIntervalClusterKey | null;
    pages: QuranPageItem[];
  }>({ isOpen: false, clusterKey: null, pages: [] });

  // Gestur usap (swipe navigation) for Quran Space
  useSwipeGesture(null, {
    disabled: previewPageNumber !== null || reviewModalConfig.isOpen,
    onSwipeRight: () => {
      if (selectedJuzNumber !== null) {
        if (selectedJuzNumber > 1) {
          setSelectedJuzNumber(selectedJuzNumber - 1);
        } else {
          setSelectedJuzNumber(null);
        }
      } else {
        setActiveSpace("dashboard");
      }
    },
    onSwipeLeft: () => {
      if (selectedJuzNumber !== null) {
        if (selectedJuzNumber < 30) {
          setSelectedJuzNumber(selectedJuzNumber + 1);
        } else {
          setActiveSpace("personal");
        }
      } else {
        setActiveSpace("personal");
      }
    },
    threshold: 40,
    minRatio: 1.15,
  });

  const t = {
    overallProgress: {
      en: "OVERALL MEMORIZATION PROGRESS",
      id: "TOTAL PROGRES HAFALAN",
      ar: "التقدم العام في الحفظ",
    },
    pagesMapan: { en: "Mastered", id: "Mapan", ar: "متقن" },
    pagesDueToday: { en: "Due Today", id: "Jatuh Tempo", ar: "مراجعة" },
    activated: { en: "Active", id: "Aktif", ar: "مفعل" },
    notActivated: {
      en: "Not yet activated",
      id: "Belum diaktivasi",
      ar: "غير مفعل",
    },
    allCaughtUp: {
      en: "All caught up",
      id: "Semua sudah dimurajaah",
      ar: "تمت المراجعة بالكامل",
    },
    inJuz: { en: "In Juz", id: "Pada Juz", ar: "في الجزء" },
    acrossJuz: { en: "Across Juz", id: "Pada Juz", ar: "في الأجزاء" },
    due: { en: "due", id: "jatuh tempo", ar: "مراجعة" },
    review: { en: "Review", id: "Murajaah", ar: "مراجعة" },
    mapan: { en: "Mastered", id: "Mapan", ar: "متقن" },
    all: { en: "All", id: "Semua", ar: "الكل" },
    active: { en: "Active", id: "Aktif", ar: "نشط" },
  };

  const queryClient = useQueryClient();

  const effectiveJuzList =
    juzList.length > 0
      ? juzList.map((juz) => ({
          juzNumber: juz.juz_number,
          nameAr: juz.name_ar,
          nameEn: juz.name_en,
          startPage: juz.start_page,
          endPage: juz.end_page,
          totalPages: juz.total_pages,
          surahSpan: juz.surah_span,
          ayahSpan: juz.ayah_span,
          activeCount: juz.active_pages,
          masteredCount: juz.mastered_pages,
          dueCount: juz.due_today,
        }))
      : JUZ_LIST.map((juz) => {
          const activePages = quranPages.filter(
            (page) => page.juzNumber === juz.juzNumber && page.isActive,
          );
          return {
            ...juz,
            activeCount: activePages.length,
            masteredCount: activePages.filter((page) => pageHasMapan(page))
              .length,
            dueCount: activePages.filter((page) =>
              isDue(page.fsrsData?.nextReview, page.isActive),
            ).length,
          };
        });

  const selectedJuz = selectedJuzNumber
    ? effectiveJuzList.find((j) => j.juzNumber === selectedJuzNumber) ||
      JUZ_LIST.find((j) => j.juzNumber === selectedJuzNumber) ||
      null
    : null;

  // Transform backend catalog pages to QuranPageItem for QuranPageCard rendering
  const displayedCatalogPages: QuranPageItem[] =
    selectedJuzNumber && currentJuzData?.pages?.length
      ? currentJuzData.pages.map((p) => {
          const localPage = quranPages.find(
            (qp) => qp.pageNumber === p.mushaf_page,
          );
          const isAct = Boolean(p.is_activated || localPage?.isActive);
          const isMapan =
            p.activation_status === "mastered" ||
            (localPage && pageHasMapan(localPage)) ||
            (p.stability || 0) >= 30;

          return {
            pageNumber: p.mushaf_page,
            juzNumber: p.juz_number,
            surahNameEn: p.surah_name_en,
            surahNameAr: p.surah_name_ar,
            surahNumber: p.surah_number || 1,
            ayahRange: p.ayah_range,
            isActive: isAct,
            status: isMapan
              ? "mastered_for_now"
              : isAct
                ? "active"
                : "inactive",
            mapanCelebrated: isMapan || !!localPage?.mapanCelebrated,
            mapanSchedule: localPage?.mapanSchedule,
            fsrsData: {
              stability: p.stability || localPage?.fsrsData?.stability || 0,
              difficulty:
                p.difficulty || localPage?.fsrsData?.difficulty || 5.0,
              reps: p.review_count || localPage?.fsrsData?.reps || 0,
              lapses: localPage?.fsrsData?.lapses || 0,
              lastReview:
                p.last_review_at || localPage?.fsrsData?.lastReview || null,
              nextReview:
                p.next_review_at ||
                localPage?.fsrsData?.nextReview ||
                (isAct ? new Date().toISOString() : null),
              state: isMapan
                ? "mastered"
                : p.review_count > 0 || (localPage?.fsrsData?.reps ?? 0) > 0
                  ? "review"
                  : "new",
            },
            reviewLogs: localPage?.reviewLogs || [],
            issues: localPage?.issues || [],
          };
        })
      : selectedJuzNumber
        ? quranPages.filter((p) => p.juzNumber === selectedJuzNumber)
        : [];

  function pageHasMapan(page: QuranPageItem) {
    return (
      page.status === "mastered_for_now" ||
      (page.isActive &&
        (page.fsrsData.stability >= 74.5 ||
          Math.round(page.fsrsData.stability * 0.4025587) > 30))
    );
  }

  // Find all Juz numbers that have pages due today
  const dueJuzMap = new Map<number, number>();
  let totalDueToday = 0;
  let totalActive = 0;

  effectiveJuzList.forEach((j) => {
    totalActive += j.activeCount;
    if (j.dueCount > 0) {
      totalDueToday += j.dueCount;
      dueJuzMap.set(j.juzNumber, j.dueCount);
    }
  });
  const totalMastered = effectiveJuzList.reduce(
    (total, juz) => total + juz.masteredCount,
    0,
  );
  const filteredJuzList = effectiveJuzList.filter((juz) => {
    const query = juzSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      `juz ${juz.juzNumber}`.includes(query) ||
      String(juz.juzNumber).includes(query) ||
      (juz.surahSpan || "").toLowerCase().includes(query)
    );
  });
  const dueJuzNumbers = Array.from(dueJuzMap.keys()).sort((a, b) => a - b);

  // Handle direct review action on page card with standard FSRS rating 1-4
  const handleInlineReview = async (
    pageNumber: number,
    rating: 1 | 2 | 3 | 4,
  ) => {
    // 1. Optimistic update to AppContext for instant clearance from Daily Review / due badges
    if (reviewQuranPage) {
      reviewQuranPage(pageNumber, (rating === 4 ? 3 : rating) as 1 | 2 | 3);
    }

    try {
      // 2. Persist to backend and invalidate query caches
      await quranPageService.reviewPage({ page_number: pageNumber, rating });
      queryClient.invalidateQueries({ queryKey: ["quran-juzs"] });
      queryClient.invalidateQueries({ queryKey: ["quran-juz-pages"] });
      queryClient.invalidateQueries({ queryKey: ["quran-pages-progress"] });
      queryClient.invalidateQueries({ queryKey: ["quran-juz30-progress"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
      await refetchPages();
      await refetchJuzList();
    } catch (err) {
      console.warn("Backend review failed or offline:", err);
    }

    setJustReviewedPage({ pageNumber, rating });
    setTimeout(() => {
      setJustReviewedPage((prev) =>
        prev?.pageNumber === pageNumber ? null : prev,
      );
    }, 1800);
  };

  const displayedPages = displayedCatalogPages.filter((page) => {
    const isDuePage = isDue(page.fsrsData.nextReview, page.isActive);
    const isMapan = pageHasMapan(page);

    if (activeFilterTab === "due")
      return (
        isDuePage ||
        (page.isActive && isReviewedToday(page.fsrsData.lastReview))
      );
    if (activeFilterTab === "active") return page.isActive;
    if (activeFilterTab === "mapan") return isMapan;
    return true; // 'all'
  });

  // Calculate stats for current Juz in Screen 2
  const currentJuzActiveCount = displayedCatalogPages.some((p) => p.isActive)
    ? displayedCatalogPages.filter((p) => p.isActive).length
    : (currentJuzData?.active_pages ?? 0);
  const currentJuzDueCount = displayedCatalogPages.some((p) => p.isActive)
    ? displayedCatalogPages.filter((p) =>
        isDue(p.fsrsData.nextReview, p.isActive),
      ).length
    : (currentJuzData?.due_today ?? 0);
  const currentJuzMapanCount = displayedCatalogPages.some((p) => p.isActive)
    ? displayedCatalogPages.filter((p) => pageHasMapan(p)).length
    : (currentJuzData?.mastered_pages ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-24 [&_button]:outline-none [&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-[#ef6905] md:pb-16">
      {selectedJuzNumber === null && (
        <section className="relative overflow-hidden rounded-3xl border border-brand-200 bg-[linear-gradient(135deg,var(--color-bg-primary)_30%,var(--color-brand-50)_100%)] p-5 shadow-lg sm:p-6">
          <div className="pointer-events-none absolute -right-14 -top-16 size-52 rounded-full border border-brand-200/70" />
          <div className="pointer-events-none absolute -right-2 top-16 size-24 rounded-full bg-brand-100/60 blur-2xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#c2410c] bg-brand-solid text-white shadow-lg shadow-brand-500/25">
                <BookOpen className="size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                    {language === "en"
                      ? "Quran Room"
                      : language === "id"
                        ? "Ruang Al-Qur'an"
                        : "غرفة القرآن"}
                  </h1>
                  <span className="rounded-full border border-brand-200 bg-primary/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                    30 Juz
                  </span>
                </div>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-secondary">
                  {language === "en"
                    ? "Keep every memorized page strong with a focused, adaptive murojaah rhythm."
                    : "Jaga setiap halaman hafalan tetap kuat dengan ritme murojaah yang fokus dan adaptif."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-xl border border-secondary bg-primary/80 px-3 py-1.5 text-xs font-semibold text-secondary shadow-xs">
                    <strong className="text-primary">{totalActive}</strong>{" "}
                    {language === "en" ? "active pages" : "halaman aktif"}
                  </span>
                  <span className="rounded-xl border border-[#f59e0b] bg-[#fffbeb] px-3 py-1.5 text-xs font-semibold text-[#b54708] dark:bg-[#451a03]/30 dark:text-[#fdb022]">
                    <strong>{totalDueToday}</strong>{" "}
                    {language === "en" ? "due today" : "perlu murojaah"}
                  </span>
                  <span className="rounded-xl border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success-primary">
                    <strong>{totalMastered}</strong>{" "}
                    {language === "en" ? "mastered" : "mapan"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:max-w-md lg:justify-end">
              <button
                type="button"
                onClick={() => setIsConnectedClassesOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-secondary bg-primary px-3 text-xs font-semibold text-secondary shadow-xs transition hover:border-brand-200 hover:text-brand-700"
              >
                <Users className="size-4" />
                {language === "en" ? "Classes" : "Kelas"}
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  {myClasses.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsQuranCalendarOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 text-xs font-semibold text-brand-700 shadow-xs transition hover:bg-brand-100"
              >
                <CalendarCheck className="size-4" />
                {language === "en" ? "Calendar" : "Kalender"}
              </button>

              {!isReadOnly && (
                <div className="relative basis-full sm:basis-auto">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!inputClassCode.trim()) return;
                      const res = await joinClassByCode(inputClassCode.trim());
                      setJoinStatus({
                        type: res.success ? "success" : "error",
                        message: res.message,
                      });
                      if (res.success) setInputClassCode("");
                      setTimeout(() => setJoinStatus(null), 4000);
                    }}
                    className="flex h-10 items-center rounded-xl border border-secondary bg-primary p-0.5 shadow-xs transition focus-within:border-[#ef6905] focus-within:shadow-[0_0_0_3px_rgba(239,105,5,0.16)]"
                  >
                    <input
                      type="text"
                      aria-label={
                        language === "en" ? "Class code" : "Kode kelas"
                      }
                      placeholder={
                        language === "en"
                          ? "Class code"
                          : language === "id"
                            ? "Kode kelas"
                            : "رمز الفصل"
                      }
                      value={inputClassCode}
                      onChange={(e) =>
                        setInputClassCode(e.target.value.toUpperCase())
                      }
                      className="min-w-0 flex-1 bg-transparent px-2.5 text-xs font-bold uppercase tracking-wider text-primary outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal sm:w-24"
                    />
                    <button
                      type="submit"
                      disabled={!inputClassCode.trim()}
                      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-brand-solid px-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-solid_hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="size-3.5" />
                      {language === "en" ? "Join" : "Gabung"}
                    </button>
                  </form>
                  {joinStatus && (
                    <p
                      className={`absolute right-0 top-full z-20 mt-1 whitespace-nowrap text-[10px] font-semibold ${joinStatus.type === "success" ? "text-success-primary" : "text-error-primary"}`}
                    >
                      {joinStatus.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {selectedJuzNumber === null ? (
        <div className="space-y-4">
          <QuranJuz30Tracker
            quranPages={quranPages}
            language={language}
            targetJuzNumber={30}
            onSelectPage={(pageNumber) => setPreviewPageNumber(pageNumber)}
          />

          {/* Standard Minimalist Due Card (Unified Across All Rooms) - Hidden in Teacher / Read-Only Mode */}
          {!isReadOnly && (
            <UnifiedDueCard
              language={language}
              title={language === "en" ? "Daily Review" : "Kartu Jatuh Tempo"}
              dueCount={totalDueToday}
              totalActiveCount={totalActive}
              itemTypeLabel={language === "en" ? "pages" : "halaman"}
              primaryActionLabel={
                language === "en"
                  ? `All (${totalDueToday})`
                  : `Semua (${totalDueToday})`
              }
              pillGridCols={5}
              onStartAll={() =>
                setReviewModalConfig({ isOpen: true, juzFilter: null })
              }
              onOpenCalendar={() => setIsQuranCalendarOpen(true)}
              filterPills={dueJuzNumbers.map((juzNum) => ({
                id: juzNum,
                label: `J${juzNum}`,
                count: dueJuzMap.get(juzNum) || 0,
                onClick: () =>
                  setReviewModalConfig({ isOpen: true, juzFilter: juzNum }),
              }))}
              allCaughtUpTitle={
                language === "en"
                  ? "All Quran pages reviewed today!"
                  : "Semua hafalan Al-Qur'an sudah dimurajaah!"
              }
            />
          )}

          <section className="rounded-3xl border border-secondary bg-primary p-4 shadow-xs sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <LayoutGrid className="size-5 text-brand-600" />
                  <h2 className="text-lg font-semibold text-primary sm:text-xl">
                    {language === "en" ? "Explore 30 Juz" : "Jelajahi 30 Juz"}
                  </h2>
                </div>
                <p className="mt-1 text-sm text-secondary">
                  {language === "en"
                    ? "Open a juz to manage pages and review progress."
                    : "Buka juz untuk mengelola halaman dan progres murojaah."}
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-quaternary" />
                <input
                  type="search"
                  value={juzSearchQuery}
                  onChange={(e) => setJuzSearchQuery(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Search juz or surah..."
                      : "Cari juz atau surah..."
                  }
                  className="h-10 w-full rounded-xl border border-secondary bg-secondary/40 pl-9 pr-3 text-sm text-primary outline-none transition placeholder:text-placeholder focus:border-[#ef6905] focus:bg-primary focus:shadow-[0_0_0_3px_rgba(239,105,5,0.16)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {isJuzListLoading
                ? Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-2xl border border-secondary bg-secondary/50"
                    />
                  ))
                : filteredJuzList.map((juz) => {
                    const hasDue = juz.dueCount > 0;
                    const progress =
                      juz.totalPages > 0
                        ? Math.round((juz.activeCount / juz.totalPages) * 100)
                        : 0;
                    return (
                      <button
                        type="button"
                        key={juz.juzNumber}
                        onClick={() => {
                          setSelectedJuzNumber(juz.juzNumber);
                          setActiveFilterTab("all");
                        }}
                        aria-label={`${language === "en" ? "Open" : "Buka"} Juz ${juz.juzNumber}, ${juz.activeCount} ${language === "en" ? "active pages" : "halaman aktif"}`}
                        className={`group min-h-40 overflow-hidden rounded-2xl border p-4 text-left shadow-xs outline-none transition-all hover:-translate-y-0.5 hover:shadow-lg focus:border-[#ef6905] focus:shadow-[0_0_0_3px_rgba(239,105,5,0.16)] ${
                          hasDue
                            ? "border-[#f59e0b] bg-[#fffbeb]/50 hover:border-[#d97706] dark:bg-[#451a03]/20"
                            : "border-secondary bg-primary hover:border-brand-200"
                        }`}
                      >
                        <div className="flex h-full items-stretch gap-3.5">
                          <div
                            className={`flex size-11 shrink-0 items-center justify-center self-start rounded-xl text-sm font-bold ${hasDue ? "bg-[#fef3c7] text-[#b54708] dark:bg-[#78350f]/40 dark:text-[#fdb022]" : "bg-brand-50 text-brand-700"}`}
                          >
                            {String(juz.juzNumber).padStart(2, "0")}
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-primary transition-colors group-hover:text-brand-700">
                                  Juz {juz.juzNumber}
                                </h3>
                                <p className="mt-0.5 truncate text-xs text-secondary">
                                  {juz.surahSpan}
                                </p>
                              </div>
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-secondary bg-secondary/40 text-fg-quaternary transition-all group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700">
                                <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </div>

                            <div className="mt-2.5 flex min-h-6 flex-wrap items-center gap-1.5">
                              {hasDue && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#fef3c7] px-2 py-1 text-[10px] font-bold text-[#b54708] dark:bg-[#78350f]/40 dark:text-[#fdb022]">
                                  <span className="size-1.5 rounded-full bg-[#f59e0b]" />
                                  {juz.dueCount}{" "}
                                  {language === "en" ? "due" : "jatuh tempo"}
                                </span>
                              )}
                              {juz.masteredCount > 0 && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#ecfdf3] px-2 py-1 text-[10px] font-bold text-[#067647] dark:bg-[#052e22]/50 dark:text-[#47cd89]">
                                  <CheckCircle2 className="size-3" />
                                  {juz.masteredCount}{" "}
                                  {language === "en" ? "mastered" : "mapan"}
                                </span>
                              )}
                            </div>

                            <div className="mt-auto pt-3">
                              <div className="flex items-center justify-between gap-3 text-[11px]">
                                <span className="font-medium text-tertiary">
                                  {language === "en"
                                    ? "Active pages"
                                    : "Halaman aktif"}
                                </span>
                                <span className="shrink-0 font-semibold tabular-nums text-primary">
                                  {juz.activeCount}/{juz.totalPages} ·{" "}
                                  {progress}%
                                </span>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="h-full rounded-full bg-brand-solid transition-[width] duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
            </div>
            {filteredJuzList.length === 0 && !isJuzListLoading && (
              <div className="mt-3 rounded-2xl border border-dashed border-secondary bg-secondary/30 px-4 py-10 text-center">
                <Search className="mx-auto size-8 text-fg-quaternary" />
                <p className="mt-2 text-sm font-semibold text-primary">
                  {language === "en" ? "No juz found" : "Juz tidak ditemukan"}
                </p>
                <p className="mt-1 text-xs text-secondary">
                  {language === "en"
                    ? "Try another juz number or surah name."
                    : "Coba nomor juz atau nama surah lainnya."}
                </p>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-3xl border border-brand-200 bg-[linear-gradient(145deg,var(--color-bg-primary)_35%,var(--color-brand-50)_100%)] p-4 shadow-lg sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border border-brand-200/70" />
            <button
              type="button"
              onClick={() => {
                setSelectedJuzNumber(null);
                setActiveFilterTab("all");
              }}
              className="group relative inline-flex items-center gap-2 rounded-xl border border-secondary bg-primary px-3 py-2 text-xs font-semibold text-secondary shadow-xs transition hover:border-brand-200 hover:text-brand-700"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              {language === "en" ? "All Juz" : "Semua Juz"}
            </button>

            <div className="relative mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-solid text-lg font-bold text-white shadow-lg shadow-brand-500/25">
                  {String(selectedJuzNumber).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                    {language === "en"
                      ? "Quran collection"
                      : "Koleksi Al-Qur'an"}
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                    Juz {selectedJuzNumber}
                  </h1>
                  <p className="mt-1 text-sm text-secondary">
                    {selectedJuz?.surahSpan ||
                      (language === "en" ? "Quran pages" : "Halaman Al-Qur'an")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuranCalendarOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-secondary bg-primary px-3 text-xs font-semibold text-secondary shadow-xs transition hover:border-brand-200 hover:text-brand-700"
                >
                  <CalendarCheck className="size-4" />
                  {language === "en" ? "Schedule" : "Jadwal"}
                </button>

                {isDownloadingJuz ? (
                  <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#f59e0b] bg-[#fffbeb] px-3 text-xs font-semibold text-[#b54708] dark:bg-[#451a03]/30 dark:text-[#fdb022]">
                    <Loader2 className="size-4 animate-spin" />
                    {downloadProgress?.current}/{downloadProgress?.total}
                  </div>
                ) : juzOfflineStatus?.isFullyCached ? (
                  <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 text-xs font-semibold text-success-primary">
                    <CheckCircle2 className="size-4" />
                    {language === "en" ? "Offline ready" : "Siap offline"}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDownloadJuz}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-secondary bg-primary px-3 text-xs font-semibold text-secondary shadow-xs transition hover:border-brand-200 hover:text-brand-700"
                  >
                    <CloudDownload className="size-4" />
                    {language === "en" ? "Save offline" : "Simpan offline"}
                  </button>
                )}

                {!isReadOnly && currentJuzDueCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setReviewModalConfig({
                        isOpen: true,
                        juzFilter: selectedJuzNumber,
                      })
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-solid px-4 text-xs font-semibold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-solid_hover"
                  >
                    <Play className="size-4 fill-current" />
                    {language === "en"
                      ? `Start Review (${currentJuzDueCount})`
                      : language === "id"
                        ? `Mulai Murajaah (${currentJuzDueCount})`
                        : `بدء المراجعة (${currentJuzDueCount})`}
                  </button>
                )}
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-brand-200 pt-4 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveFilterTab("all")}
                className={`rounded-2xl border p-3 text-left transition ${activeFilterTab === "all" ? "border-[#ef6905] bg-brand-50 shadow-[0_0_0_2px_rgba(239,105,5,0.14)]" : "border-secondary bg-primary/80 hover:border-brand-200"}`}
              >
                <div
                  className={`text-xl font-semibold sm:text-2xl ${activeFilterTab === "all" ? "text-brand-700" : "text-primary"}`}
                >
                  {currentJuzActiveCount}/{selectedJuz?.totalPages}
                </div>
                <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  {t.activated[language]}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterTab("due")}
                className={`rounded-2xl border p-3 text-left transition ${activeFilterTab === "due" ? "border-[#f59e0b] bg-[#fffbeb] shadow-[0_0_0_2px_rgba(245,158,11,0.16)] dark:bg-[#451a03]/30" : "border-secondary bg-primary/80 hover:border-[#f59e0b]/50"}`}
              >
                <div
                  className={`text-xl font-semibold sm:text-2xl ${currentJuzDueCount > 0 ? "text-[#b54708] dark:text-[#fdb022]" : "text-primary"}`}
                >
                  {currentJuzDueCount}
                </div>
                <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  {t.pagesDueToday[language]}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterTab("mapan")}
                className={`rounded-2xl border p-3 text-left transition ${activeFilterTab === "mapan" ? "border-[#079455] bg-[#ecfdf3] shadow-[0_0_0_2px_rgba(7,148,85,0.14)] dark:bg-[#052e22]/35" : "border-secondary bg-primary/80 hover:border-[#079455]/40"}`}
              >
                <div
                  className={`text-xl font-semibold sm:text-2xl ${activeFilterTab === "mapan" ? "text-success-primary" : "text-primary"}`}
                >
                  {currentJuzMapanCount}
                </div>
                <div className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-tertiary">
                  {t.mapan[language]}
                </div>
              </button>
            </div>
          </section>

          {selectedJuzNumber === 30 && (
            <QuranJuz30Tracker
              quranPages={quranPages}
              language={language}
              targetJuzNumber={30}
              onSelectPage={(pageNumber) => setPreviewPageNumber(pageNumber)}
            />
          )}

          {/* Section Header: PAGES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 px-1">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  {language === "en"
                    ? "Pages in this Juz"
                    : "Halaman dalam Juz"}
                </h2>
                <p className="mt-0.5 text-xs text-secondary">
                  {displayedPages.length}{" "}
                  {language === "en" ? "pages shown" : "halaman ditampilkan"}
                </p>
              </div>
              <div className="flex items-center rounded-xl border border-secondary bg-secondary/50 p-1">
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setViewDensity("grid")}
                  className={`flex size-8 items-center justify-center rounded-lg transition ${viewDensity === "grid" ? "bg-primary text-brand-700 shadow-xs" : "text-fg-quaternary hover:text-primary"}`}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Compact view"
                  onClick={() => setViewDensity("compact")}
                  className={`flex size-8 items-center justify-center rounded-lg transition ${viewDensity === "compact" ? "bg-primary text-brand-700 shadow-xs" : "text-fg-quaternary hover:text-primary"}`}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>

            {/* Streamlined, Compact Page Cards in 2-Column Grid on Tablet/Desktop */}
            <div
              className={
                viewDensity === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-2.5"
                  : "space-y-2"
              }
            >
              {isPagesLoading
                ? Array.from({ length: 4 }, (_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-2xl border border-secondary bg-secondary/50"
                    />
                  ))
                : displayedPages.map((page) => (
                    <QuranPageCard
                      key={page.pageNumber}
                      page={page}
                      language={language}
                      isReadOnly={isReadOnly}
                      onToggleActive={(pageNumber) => {
                        handleTogglePageActive(pageNumber);
                      }}
                      onOpenMapanModal={(p) => {
                        setSelectedMapanPage(p);
                        setIsMapanModalOpen(true);
                      }}
                      onOpenFeedbackModal={(p) => {
                        setFeedbackPage(p);
                        setIsFeedbackModalOpen(true);
                      }}
                      onOpenMushafViewer={(pageNumber) => {
                        setPreviewPageNumber(pageNumber);
                      }}
                      onInlineReview={(pageNumber, rating) => {
                        handleInlineReview(pageNumber, rating);
                      }}
                      isJustReviewed={
                        justReviewedPage?.pageNumber === page.pageNumber
                      }
                      justReviewedRating={
                        justReviewedPage?.pageNumber === page.pageNumber
                          ? justReviewedPage.rating
                          : undefined
                      }
                    />
                  ))}
            </div>

            {!isPagesLoading && displayedPages.length === 0 && (
              <div className="rounded-2xl border border-dashed border-secondary bg-secondary/30 px-4 py-12 text-center">
                <FileText className="mx-auto size-9 text-fg-quaternary" />
                <p className="mt-2 text-sm font-semibold text-primary">
                  {language === "en"
                    ? "No pages in this filter"
                    : "Tidak ada halaman pada filter ini"}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveFilterTab("all")}
                  className="mt-3 text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  {language === "en"
                    ? "Show all pages"
                    : "Tampilkan semua halaman"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal (supports filtering by specific Juz) */}
      <QuranReviewModal
        isOpen={reviewModalConfig.isOpen}
        juzFilter={reviewModalConfig.juzFilter}
        onClose={() => setReviewModalConfig({ isOpen: false, juzFilter: null })}
        onSelectNextJuz={(nextJuz) =>
          setReviewModalConfig({ isOpen: true, juzFilter: nextJuz })
        }
      />

      {/* Fullscreen Mushaf Page Viewer Modal */}
      {previewPageNumber !== null && (
        <MushafPageViewerModal
          pageNumber={previewPageNumber}
          isOpen={true}
          onClose={() => setPreviewPageNumber(null)}
          onNavigatePage={(p) => setPreviewPageNumber(p)}
          onOpenFeedback={(p) => {
            const pageItem = quranPages.find((item) => item.pageNumber === p);
            if (pageItem) {
              setFeedbackPage(pageItem);
              setIsFeedbackModalOpen(true);
            }
          }}
        />
      )}

      {/* Mastered / Mapan Custom Rhythm Schedule Modal */}
      <MapanScheduleModal
        isOpen={isMapanModalOpen}
        onClose={() => {
          setIsMapanModalOpen(false);
          setSelectedMapanPage(null);
        }}
        page={selectedMapanPage}
      />

      {/* Stability Interval Clusters Modal */}
      <IntervalPagesModal
        isOpen={intervalModalConfig.isOpen}
        onClose={() =>
          setIntervalModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        clusterKey={intervalModalConfig.clusterKey}
        quranPages={quranPages}
        language={language}
        onToggleActive={(pageNumber) => {
          const target = quranPages.find((p) => p.pageNumber === pageNumber);
          if (target?.isActive) {
            deactivateQuranPage(pageNumber);
          } else {
            activateQuranPage(pageNumber);
          }
        }}
        onOpenMapanModal={(page) => {
          setSelectedMapanPage(page);
          setIsMapanModalOpen(true);
        }}
        onOpenFeedbackModal={(page) => {
          setFeedbackPage(page);
          setIsFeedbackModalOpen(true);
        }}
        onOpenMushafViewer={(pageNumber) => {
          setPreviewPageNumber(pageNumber);
        }}
        onInlineReview={(pageNumber, rating) => {
          handleInlineReview(pageNumber, rating);
        }}
        justReviewedPage={justReviewedPage}
      />

      {/* Quran Page Issue & Feedback Modal */}
      <QuranPageFeedbackModal
        key={`${isFeedbackModalOpen ? "open" : "closed"}-${feedbackPage?.pageNumber ?? "none"}`}
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setFeedbackPage(null);
        }}
        page={feedbackPage}
      />

      {/* Connected Classes Modal */}
      <ConnectedClassesModal
        isOpen={isConnectedClassesOpen}
        onClose={() => setIsConnectedClassesOpen(false)}
        language={language}
        connectedClasses={myClasses}
        onLeaveClass={leaveClass}
      />

      {/* Planned Quran Review Calendar Modal */}
      <QuranReviewCalendarModal
        key={`${isQuranCalendarOpen ? "open" : "closed"}-${selectedJuzNumber ?? "all"}`}
        isOpen={isQuranCalendarOpen}
        onClose={() => setIsQuranCalendarOpen(false)}
        quranPages={quranPages}
        language={language}
        initialJuzFilter={selectedJuzNumber}
        onStartReview={(juz) =>
          setReviewModalConfig({ isOpen: true, juzFilter: juz || null })
        }
        onOpenMushafViewer={(pageNumber) => setPreviewPageNumber(pageNumber)}
      />
    </div>
  );
};
