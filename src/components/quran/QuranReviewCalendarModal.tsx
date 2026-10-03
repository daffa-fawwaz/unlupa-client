import React, { useState, useMemo } from "react";
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Eye,
  Play,
  CalendarCheck,
} from "@/components/foundations/hugeicons";
import { QuranPageItem } from "../../types";
import { JUZ_LIST } from "../../data/quranData";
import { isDue } from "../../lib/fsrs";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quranPages: QuranPageItem[];
  language: string;
  initialJuzFilter?: number | null;
  onStartReview: (juzNumber?: number) => void;
  onOpenMushafViewer: (pageNumber: number) => void;
}

// Helper to format Date as local YYYY-MM-DD
function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const QuranReviewCalendarModal: React.FC<Props> = ({
  isOpen,
  onClose,
  quranPages,
  language,
  initialJuzFilter = null,
  onStartReview,
  onOpenMushafViewer,
}) => {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatLocalDate(today), [today]);

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0 - 11
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [juzFilter, setJuzFilter] = useState<number | "all">(
    initialJuzFilter || "all",
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "mapan" | "active">(
    "all",
  );

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(todayStr);
  };

  const monthNamesId = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthName =
    language === "en" ? monthNamesEn[currentMonth] : monthNamesId[currentMonth];

  const weekDayLabels =
    language === "en"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ahd"];

  // Calculate days in the displayed month and grid structure
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Sunday becomes 6

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      dateObj: Date;
    }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const dObj = new Date(currentYear, currentMonth - 1, dNum);
      days.push({
        dateStr: formatLocalDate(dObj),
        dayNumber: dNum,
        isCurrentMonth: false,
        isToday: formatLocalDate(dObj) === todayStr,
        dateObj: dObj,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dObj = new Date(currentYear, currentMonth, i);
      const dStr = formatLocalDate(dObj);
      days.push({
        dateStr: dStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        dateObj: dObj,
      });
    }

    // Next month padding to complete 7-column rows
    const remainingSlots = 7 - (days.length % 7);
    if (remainingSlots < 7) {
      for (let i = 1; i <= remainingSlots; i++) {
        const dObj = new Date(currentYear, currentMonth + 1, i);
        days.push({
          dateStr: formatLocalDate(dObj),
          dayNumber: i,
          isCurrentMonth: false,
          isToday: formatLocalDate(dObj) === todayStr,
          dateObj: dObj,
        });
      }
    }

    return days;
  }, [currentYear, currentMonth, todayStr]);

  // Aggregate Quran review schedules and completed logs
  const scheduleData = useMemo(() => {
    const plannedMap = new Map<string, QuranPageItem[]>();
    const completedMap = new Map<
      string,
      { page: QuranPageItem; rating: number }[]
    >();

    (quranPages || []).forEach((p) => {
      if (!p.isActive) return;

      // Filter by Juz if specified
      if (juzFilter !== "all" && p.juzNumber !== juzFilter) return;

      // Filter by Status if specified
      const stabilityDays = Math.round(
        (p.fsrsData?.stability || 0) * 0.4025587,
      );
      const isMapan = p.status === "mastered_for_now" || stabilityDays >= 30;
      if (statusFilter === "mapan" && !isMapan) return;
      if (statusFilter === "active" && isMapan) return;

      // Check planned next review
      const nextReview = p.fsrsData?.nextReview;
      if (nextReview) {
        const nextDate = new Date(nextReview);
        const nextStr = formatLocalDate(nextDate);

        if (nextDate <= today || isDue(nextReview, p.isActive)) {
          if (!plannedMap.has(todayStr)) plannedMap.set(todayStr, []);
          plannedMap.get(todayStr)!.push(p);
        } else {
          if (!plannedMap.has(nextStr)) plannedMap.set(nextStr, []);
          plannedMap.get(nextStr)!.push(p);
        }
      } else {
        if (!plannedMap.has(todayStr)) plannedMap.set(todayStr, []);
        plannedMap.get(todayStr)!.push(p);
      }

      // Check Mapan custom rhythms (weekly/monthly)
      if (p.mapanSchedule && p.mapanSchedule.mode !== "fsrs") {
        if (
          p.mapanSchedule.mode === "weekly" &&
          typeof p.mapanSchedule.weeklyDay === "number"
        ) {
          const targetDay = p.mapanSchedule.weeklyDay;
          calendarDays.forEach((calDay) => {
            if (
              calDay.isCurrentMonth &&
              calDay.dateObj > today &&
              calDay.dateObj.getDay() === targetDay
            ) {
              if (!plannedMap.has(calDay.dateStr))
                plannedMap.set(calDay.dateStr, []);
              const list = plannedMap.get(calDay.dateStr)!;
              if (!list.some((x) => x.pageNumber === p.pageNumber)) {
                list.push(p);
              }
            }
          });
        } else if (
          p.mapanSchedule.mode === "monthly" &&
          typeof p.mapanSchedule.monthlyDate === "number"
        ) {
          const targetDateNum = p.mapanSchedule.monthlyDate;
          calendarDays.forEach((calDay) => {
            if (
              calDay.isCurrentMonth &&
              calDay.dayNumber === targetDateNum &&
              calDay.dateObj > today
            ) {
              if (!plannedMap.has(calDay.dateStr))
                plannedMap.set(calDay.dateStr, []);
              const list = plannedMap.get(calDay.dateStr)!;
              if (!list.some((x) => x.pageNumber === p.pageNumber)) {
                list.push(p);
              }
            }
          });
        }
      }

      // Check historical review logs
      (p.reviewLogs || []).forEach((log) => {
        if (log.date) {
          const logDateStr = formatLocalDate(new Date(log.date));
          if (!completedMap.has(logDateStr)) completedMap.set(logDateStr, []);
          completedMap.get(logDateStr)!.push({
            page: p,
            rating: log.rating || 3,
          });
        }
      });
    });

    return { plannedMap, completedMap };
  }, [quranPages, juzFilter, statusFilter, today, todayStr, calendarDays]);

  // Monthly summary metrics for Quran
  const metrics = useMemo(() => {
    let scheduledInMonth = 0;
    let completedInMonth = 0;
    let peakDayCount = 0;

    calendarDays.forEach((day) => {
      if (!day.isCurrentMonth) return;
      const planned = scheduleData.plannedMap.get(day.dateStr) || [];
      const completed = scheduleData.completedMap.get(day.dateStr) || [];

      scheduledInMonth += planned.length;
      completedInMonth += completed.length;

      if (planned.length > peakDayCount) {
        peakDayCount = planned.length;
      }
    });

    const activeInScope = (quranPages || []).filter((p) => {
      if (!p.isActive) return false;
      if (juzFilter !== "all" && p.juzNumber !== juzFilter) return false;
      return true;
    });

    const mapanInScope = activeInScope.filter((p) => {
      const stabilityDays = Math.round(
        (p.fsrsData?.stability || 0) * 0.4025587,
      );
      return p.status === "mastered_for_now" || stabilityDays >= 30;
    });

    const retentionRate =
      activeInScope.length > 0
        ? Math.round((mapanInScope.length / activeInScope.length) * 100)
        : 0;

    return {
      scheduledInMonth,
      completedInMonth,
      peakDayCount,
      activeCount: activeInScope.length,
      mapanCount: mapanInScope.length,
      retentionRate,
    };
  }, [calendarDays, scheduleData, quranPages, juzFilter]);

  // Selected date details
  const selectedDetails = useMemo(() => {
    const planned = scheduleData.plannedMap.get(selectedDateStr) || [];
    const completed = scheduleData.completedMap.get(selectedDateStr) || [];

    const isDateToday = selectedDateStr === todayStr;
    const selectedObj = new Date(selectedDateStr + "T00:00:00");
    const isPast = selectedObj < new Date(todayStr + "T00:00:00");
    const isFuture = selectedObj > new Date(todayStr + "T00:00:00");

    let formattedTitle = selectedDateStr;
    try {
      formattedTitle = selectedObj.toLocaleDateString(
        language === "en" ? "en-US" : "id-ID",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      );
    } catch {
      // fallback
    }

    return {
      formattedTitle,
      isDateToday,
      isPast,
      isFuture,
      planned,
      completed,
    };
  }, [selectedDateStr, scheduleData, todayStr, language]);

  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => !open && onClose()}
      data-no-swipe="true"
    >
      <Modal className="max-w-6xl overflow-hidden rounded-3xl border border-brand-200 bg-primary">
        <Dialog
          id="quran-review-calendar-modal"
          aria-label={
            language === "en"
              ? "Quran review calendar"
              : "Kalender murajaah Al-Qur'an"
          }
          className="flex max-h-[92dvh] flex-col overflow-hidden"
        >
          <header className="relative flex shrink-0 items-center justify-between gap-3 overflow-hidden border-b border-brand-200 bg-[linear-gradient(135deg,var(--color-brand-50)_0%,var(--color-bg-primary)_74%)] px-4 py-4 sm:px-6 sm:py-5">
            <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-brand-200/35 blur-3xl" />
            <div className="relative flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#c2410c] bg-brand-solid text-white shadow-lg shadow-brand-500/20">
                <CalendarCheck className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold text-primary sm:text-xl">
                    {language === "en"
                      ? "Quran Review Calendar"
                      : "Kalender Murajaah Al-Qur'an"}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-primary/80 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                    <Sparkles className="size-3" />
                    {juzFilter === "all" ? "30 Juz" : `Juz ${juzFilter}`}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-secondary">
                  {language === "en"
                    ? "Adaptive review workload and completed Quran sessions in one timeline."
                    : "Jadwal adaptif dan riwayat murajaah Al-Qur'an dalam satu linimasa."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={
                language === "en" ? "Close calendar" : "Tutup kalender"
              }
              className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-secondary bg-primary text-fg-quaternary shadow-xs outline-none transition hover:border-brand-200 hover:text-brand-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905]"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-secondary/20 p-4 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)] lg:items-start">
              <div className="min-w-0 space-y-4">
                <section className="flex flex-col justify-between gap-3 rounded-2xl border border-secondary bg-primary p-3 shadow-xs sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex h-10 items-center gap-2 rounded-xl border border-secondary bg-secondary/50 px-3 text-xs font-semibold text-secondary">
                      <BookOpen className="size-4 text-brand-600" />
                      <span>Juz</span>
                      <select
                        value={juzFilter}
                        onChange={(event) => {
                          const value = event.target.value;
                          setJuzFilter(value === "all" ? "all" : Number(value));
                        }}
                        className="max-w-40 cursor-pointer bg-transparent font-semibold text-primary outline-none"
                      >
                        <option value="all">
                          {language === "en" ? "All 30 Juz" : "Semua 30 Juz"}
                        </option>
                        {JUZ_LIST.map((juz) => (
                          <option key={juz.juzNumber} value={juz.juzNumber}>
                            Juz {juz.juzNumber} · {juz.surahSpan}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex h-10 items-center rounded-xl border border-secondary bg-secondary/50 p-1 text-xs font-semibold">
                      {(["all", "active", "mapan"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status)}
                          className={`h-8 rounded-lg px-3 outline-none transition focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905] ${statusFilter === status ? "border border-brand-200 bg-primary text-brand-700 shadow-xs" : "border border-transparent text-secondary hover:text-primary"}`}
                        >
                          {status === "all"
                            ? language === "en"
                              ? "All"
                              : "Semua"
                            : status === "active"
                              ? language === "en"
                                ? "Active"
                                : "Aktif"
                              : "Mapan"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex h-10 items-center self-start rounded-xl border border-secondary bg-primary p-1 shadow-xs sm:self-auto">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="flex size-8 items-center justify-center rounded-lg text-fg-quaternary outline-none hover:bg-secondary hover:text-primary focus-visible:outline-[3px] focus-visible:outline-[#ef6905]"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToToday}
                      className="min-w-32 px-2 text-xs font-semibold text-primary outline-none hover:text-brand-700 focus-visible:outline-[3px] focus-visible:outline-[#ef6905]"
                    >
                      {currentMonthName} {currentYear}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="flex size-8 items-center justify-center rounded-lg text-fg-quaternary outline-none hover:bg-secondary hover:text-primary focus-visible:outline-[3px] focus-visible:outline-[#ef6905]"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    {
                      label: language === "en" ? "Scheduled" : "Terjadwal",
                      value: metrics.scheduledInMonth,
                      detail: language === "en" ? "pages" : "halaman",
                      tone: "brand",
                    },
                    {
                      label: language === "en" ? "Completed" : "Selesai",
                      value: metrics.completedInMonth,
                      detail: language === "en" ? "reviews" : "review",
                      tone: "success",
                    },
                    {
                      label: language === "en" ? "Peak load" : "Beban puncak",
                      value: metrics.peakDayCount,
                      detail: language === "en" ? "pages/day" : "hal/hari",
                      tone: "warning",
                    },
                    {
                      label: language === "en" ? "Mastery" : "Kemapanan",
                      value: `${metrics.retentionRate}%`,
                      detail: `${metrics.mapanCount}/${metrics.activeCount}`,
                      tone: "gray",
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className={`rounded-2xl border p-3 ${metric.tone === "brand" ? "border-brand-200 bg-brand-50/60" : metric.tone === "success" ? "border-[#a6f4c5] bg-[#ecfdf3] dark:border-[#085d3a] dark:bg-[#052e22]/35" : metric.tone === "warning" ? "border-[#fedf89] bg-[#fffaeb] dark:border-[#78350f] dark:bg-[#451a03]/30" : "border-secondary bg-primary"}`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${metric.tone === "brand" ? "text-brand-700" : metric.tone === "success" ? "text-[#067647] dark:text-[#47cd89]" : metric.tone === "warning" ? "text-[#b54708] dark:text-[#fdb022]" : "text-tertiary"}`}
                      >
                        {metric.label}
                      </p>
                      <p className="mt-1 text-xl font-semibold tabular-nums text-primary">
                        {metric.value}
                      </p>
                      <p className="mt-0.5 text-[10px] text-tertiary">
                        {metric.detail}
                      </p>
                    </div>
                  ))}
                </section>

                <section className="rounded-3xl border border-secondary bg-primary p-3 shadow-xs sm:p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-primary">
                        {currentMonthName} {currentYear}
                      </h3>
                      <p className="mt-0.5 text-xs text-secondary">
                        {language === "en"
                          ? "Select a date to inspect its review queue."
                          : "Pilih tanggal untuk melihat antrean murajaah."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-medium text-tertiary">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-brand-solid" />
                        {language === "en" ? "Scheduled" : "Terjadwal"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#079455]" />
                        {language === "en" ? "Completed" : "Selesai"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {weekDayLabels.map((label) => (
                      <div
                        key={label}
                        className="py-1 text-[10px] font-bold uppercase tracking-wider text-tertiary"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
                    {calendarDays.map((day) => {
                      const plannedCount =
                        scheduleData.plannedMap.get(day.dateStr)?.length ?? 0;
                      const completedCount =
                        scheduleData.completedMap.get(day.dateStr)?.length ?? 0;
                      const isSelected = day.dateStr === selectedDateStr;
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onClick={() => setSelectedDateStr(day.dateStr)}
                          className={`flex min-h-14 flex-col justify-between rounded-xl border p-1.5 text-left outline-none transition sm:min-h-18 sm:rounded-2xl sm:p-2 ${!day.isCurrentMonth ? "border-transparent bg-transparent opacity-35" : isSelected ? "border-[#ef6905] bg-brand-50 shadow-[0_0_0_2px_rgba(239,105,5,0.16)]" : plannedCount > 0 ? "border-brand-200 bg-brand-50/45 hover:border-brand-300" : "border-secondary bg-secondary/25 hover:border-brand-200"} focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#ef6905]`}
                        >
                          <div className="flex w-full items-center justify-between gap-1">
                            <span
                              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold sm:size-6 sm:text-xs ${day.isToday ? "bg-brand-solid text-white" : isSelected ? "text-brand-700" : day.isCurrentMonth ? "text-primary" : "text-tertiary"}`}
                            >
                              {day.dayNumber}
                            </span>
                            {completedCount > 0 && day.isCurrentMonth && (
                              <CheckCircle2 className="size-3 text-[#079455]" />
                            )}
                          </div>
                          {day.isCurrentMonth && plannedCount > 0 && (
                            <span className="mt-1 inline-flex self-start rounded-md bg-brand-solid px-1.5 py-0.5 text-[9px] font-bold text-white sm:text-[10px]">
                              {plannedCount}
                              <span className="ml-0.5 hidden sm:inline">
                                {" "}
                                hal
                              </span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="overflow-hidden rounded-3xl border border-brand-200 bg-[linear-gradient(145deg,var(--color-bg-primary)_0%,var(--color-brand-50)_100%)] shadow-xs lg:sticky lg:top-0">
                <div className="border-b border-brand-200 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarIcon className="size-4 text-brand-600" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      {language === "en" ? "Selected date" : "Tanggal terpilih"}
                    </span>
                    {selectedDetails.isDateToday && (
                      <span className="rounded-full bg-brand-solid px-2 py-0.5 text-[9px] font-bold text-white">
                        {language === "en" ? "Today" : "Hari ini"}
                      </span>
                    )}
                    {selectedDetails.isPast && !selectedDetails.isDateToday && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold text-tertiary">
                        {language === "en" ? "Past" : "Lampau"}
                      </span>
                    )}
                    {selectedDetails.isFuture && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[9px] font-semibold text-brand-700">
                        {language === "en" ? "Upcoming" : "Mendatang"}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold capitalize text-primary">
                    {selectedDetails.formattedTitle}
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-brand-200 bg-primary/80 p-3">
                      <p className="text-[10px] font-semibold text-secondary">
                        {language === "en" ? "Scheduled" : "Terjadwal"}
                      </p>
                      <p className="mt-1 text-xl font-semibold text-brand-700">
                        {selectedDetails.planned.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#a6f4c5] bg-[#ecfdf3] p-3 dark:border-[#085d3a] dark:bg-[#052e22]/35">
                      <p className="text-[10px] font-semibold text-[#067647] dark:text-[#47cd89]">
                        {language === "en" ? "Completed" : "Selesai"}
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#067647] dark:text-[#47cd89]">
                        {selectedDetails.completed.length}
                      </p>
                    </div>
                  </div>
                  {selectedDetails.isDateToday &&
                    selectedDetails.planned.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onStartReview(
                            juzFilter !== "all" ? juzFilter : undefined,
                          );
                        }}
                        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-solid px-4 text-xs font-semibold text-white shadow-md shadow-brand-500/20 outline-none hover:bg-brand-solid_hover focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#ef6905]"
                      >
                        <Play className="size-4 fill-current" />
                        {language === "en"
                          ? "Start Quran review"
                          : "Mulai murajaah"}
                      </button>
                    )}
                </div>

                <div className="max-h-[48dvh] space-y-4 overflow-y-auto p-4 sm:p-5 lg:max-h-[54dvh]">
                  {selectedDetails.planned.length > 0 && (
                    <section>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                        {language === "en"
                          ? "Review queue"
                          : "Antrean murajaah"}
                      </p>
                      <div className="space-y-2">
                        {selectedDetails.planned.map((page) => {
                          const stabilityDays = Math.round(
                            (page.fsrsData?.stability || 0) * 0.4025587,
                          );
                          const isMapan =
                            page.status === "mastered_for_now" ||
                            stabilityDays >= 30;
                          return (
                            <div
                              key={page.pageNumber}
                              className="flex items-center gap-3 rounded-2xl border border-secondary bg-primary p-3 shadow-xs"
                            >
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">
                                {page.pageNumber}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-primary">
                                  {page.surahNameEn} · Juz {page.juzNumber}
                                </p>
                                <p className="mt-0.5 truncate text-[10px] text-secondary">
                                  {page.ayahRange || "Ayat"} ·{" "}
                                  {isMapan ? "Mapan" : "Aktif"} {stabilityDays}d
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenMushafViewer(page.pageNumber)
                                }
                                aria-label={
                                  language === "en"
                                    ? "Open mushaf page"
                                    : "Buka halaman mushaf"
                                }
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-secondary bg-secondary/40 text-fg-quaternary outline-none hover:border-brand-200 hover:text-brand-700 focus-visible:outline-[3px] focus-visible:outline-[#ef6905]"
                              >
                                <Eye className="size-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {selectedDetails.completed.length > 0 && (
                    <section>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-tertiary">
                        {language === "en"
                          ? "Completed reviews"
                          : "Riwayat selesai"}
                      </p>
                      <div className="space-y-2">
                        {selectedDetails.completed.map(
                          ({ page, rating }, index) => (
                            <div
                              key={`${page.pageNumber}-${index}`}
                              className="flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary/80 p-2.5"
                            >
                              <p className="truncate text-xs font-medium text-primary">
                                Hal {page.pageNumber} · {page.surahNameEn}
                              </p>
                              <span
                                className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold ${rating === 3 ? "bg-[#dcfae6] text-[#067647]" : rating === 2 ? "bg-brand-50 text-brand-700" : "bg-[#fee4e2] text-[#b42318]"}`}
                              >
                                {rating === 3
                                  ? "Mutqin"
                                  : rating === 2
                                    ? "Cukup"
                                    : "Ulang"}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </section>
                  )}

                  {selectedDetails.planned.length === 0 &&
                    selectedDetails.completed.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-secondary bg-primary/60 px-4 py-10 text-center">
                        <CalendarCheck className="mx-auto size-8 text-fg-quaternary" />
                        <p className="mt-2 text-sm font-semibold text-primary">
                          {language === "en"
                            ? "No review activity"
                            : "Tidak ada aktivitas murajaah"}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-secondary">
                          {language === "en"
                            ? "There are no scheduled or completed pages for this date."
                            : "Belum ada halaman terjadwal atau selesai pada tanggal ini."}
                        </p>
                      </div>
                    )}
                </div>
              </aside>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
