import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Eye, 
  ChevronDown,
  Plus,
  Search
} from "@/components/foundations/hugeicons";
import { motion, AnimatePresence } from 'motion/react';
import { QuranPageItem, BookItem } from '../../types';
import { getNonQuranIntervalDays, isDue } from '../../lib/fsrs';

interface Props {
  onOpenQuranReview?: (juzNumber?: number) => void;
  onOpenPersonalReview?: () => void;
  onOpenMushafViewer: (pageNumber: number) => void;
}

type MaterialFilter = 'all' | 'quran' | 'personal';

// Helper to format Date as local YYYY-MM-DD
function formatLocalDate(d: Date | string | number | null | undefined): string {
  if (!d) return '';
  try {
    const dateObj = d instanceof Date ? d : new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

export const VisualReviewCalendar: React.FC<Props> = ({
  onOpenQuranReview,
  onOpenPersonalReview,
  onOpenMushafViewer,
}) => {
  const { 
    quranPages, 
    items, 
    books, 
    language, 
    setActiveSpace 
  } = useApp();

  const [today, setToday] = useState(() => new Date());
  const todayStr = useMemo(() => formatLocalDate(today), [today]);

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0 - 11
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const filterType: MaterialFilter = 'all';
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentDate = new Date();
      setToday((previousDate) =>
        formatLocalDate(previousDate) === formatLocalDate(currentDate)
          ? previousDate
          : currentDate,
      );
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(todayStr);
  }, [today, todayStr]);

  const handleAddEvent = () => {
    setActiveSpace('quran');
  };

  const openQuranReview = (juzNumber?: number) => {
    if (onOpenQuranReview) onOpenQuranReview(juzNumber);
    else setActiveSpace('quran');
  };

  const openPersonalReview = () => {
    if (onOpenPersonalReview) onOpenPersonalReview();
    else setActiveSpace('personal');
  };

  const getSafeIntervalDays = (item: BookItem) => {
    const interval = getNonQuranIntervalDays(item.fsrsData);
    return Number.isFinite(interval) ? Math.max(0, interval) : 0;
  };

  const getSafeQuranStabilityDays = (page: QuranPageItem) => {
    const stability = Number(page.fsrsData?.stability);
    return Number.isFinite(stability) ? Math.max(0, Math.round(stability * 0.4025587)) : 0;
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Month and Day labels
  const monthNamesId = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = language === 'en' 
    ? monthNamesEn[currentMonth] 
    : monthNamesId[currentMonth];

  const weekDayLabels = language === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Calculate days in the displayed month and grid structure
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    // In JS: 0 is Sunday, 1 is Monday, ..., 6 is Saturday.
    const startingDayOfWeek = firstDayOfMonth.getDay();

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
        dateObj: dObj
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
        dateObj: dObj
      });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const remainingSlots = 7 - (days.length % 7);
    if (remainingSlots < 7) {
      for (let i = 1; i <= remainingSlots; i++) {
        const dObj = new Date(currentYear, currentMonth + 1, i);
        days.push({
          dateStr: formatLocalDate(dObj),
          dayNumber: i,
          isCurrentMonth: false,
          isToday: formatLocalDate(dObj) === todayStr,
          dateObj: dObj
        });
      }
    }

    return days;
  }, [currentYear, currentMonth, todayStr]);

  // Aggregate planned and completed review sessions by date
  const scheduleData = useMemo(() => {
    const plannedMap = new Map<string, {
      quran: QuranPageItem[];
      personal: { item: BookItem; bookTitle: string }[];
    }>();

    const completedMap = new Map<string, {
      quran: { page: QuranPageItem; rating: number }[];
      personal: { item: BookItem; rating: number; bookTitle: string }[];
    }>();

    const booksMap = new Map<string, string>();
    (books || []).forEach(b => booksMap.set(b.id, b.title));

    // 1. Process Active Quran Pages
    (quranPages || []).forEach(p => {
      if (!p.isActive) return;

      // Check planned next review
      const nextReview = p.fsrsData?.nextReview;
      if (nextReview) {
        const nextDate = new Date(nextReview);
        const nextStr = formatLocalDate(nextDate);

        // If nextReview is today or in the past (overdue), it counts towards TODAY's pending load
        if (nextDate <= today || isDue(nextReview, p.isActive)) {
          if (!plannedMap.has(todayStr)) {
            plannedMap.set(todayStr, { quran: [], personal: [] });
          }
          plannedMap.get(todayStr)!.quran.push(p);
        } else {
          // Future scheduled date
          if (!plannedMap.has(nextStr)) {
            plannedMap.set(nextStr, { quran: [], personal: [] });
          }
          plannedMap.get(nextStr)!.quran.push(p);
        }
      } else {
        // Activated but no review date yet -> due today
        if (!plannedMap.has(todayStr)) {
          plannedMap.set(todayStr, { quran: [], personal: [] });
        }
        plannedMap.get(todayStr)!.quran.push(p);
      }

      // Check recurrent weekly or monthly Mapan schedule
      if (p.mapanSchedule && p.mapanSchedule.mode !== 'fsrs') {
        if (p.mapanSchedule.mode === 'weekly' && typeof p.mapanSchedule.weeklyDay === 'number') {
          // Weekly schedule on a specific day of week
          const targetDay = p.mapanSchedule.weeklyDay; // 0 = Ahad, 1 = Senin, etc.
          calendarDays.forEach(calDay => {
            if (calDay.isCurrentMonth && calDay.dateObj > today) {
              if (calDay.dateObj.getDay() === targetDay) {
                if (!plannedMap.has(calDay.dateStr)) {
                  plannedMap.set(calDay.dateStr, { quran: [], personal: [] });
                }
                const entry = plannedMap.get(calDay.dateStr)!;
                if (!entry.quran.some(qp => qp.pageNumber === p.pageNumber)) {
                  entry.quran.push(p);
                }
              }
            }
          });
        } else if (p.mapanSchedule.mode === 'monthly' && typeof p.mapanSchedule.monthlyDate === 'number') {
          // Monthly schedule on a specific date
          const targetDateNum = p.mapanSchedule.monthlyDate;
          calendarDays.forEach(calDay => {
            if (calDay.isCurrentMonth && calDay.dayNumber === targetDateNum && calDay.dateObj > today) {
              if (!plannedMap.has(calDay.dateStr)) {
                plannedMap.set(calDay.dateStr, { quran: [], personal: [] });
              }
              const entry = plannedMap.get(calDay.dateStr)!;
              if (!entry.quran.some(qp => qp.pageNumber === p.pageNumber)) {
                entry.quran.push(p);
              }
            }
          });
        }
      }

      // Check review history (completed)
      (p.reviewLogs || []).forEach(log => {
        if (log.date) {
          const logDateStr = formatLocalDate(new Date(log.date));
          if (!completedMap.has(logDateStr)) {
            completedMap.set(logDateStr, { quran: [], personal: [] });
          }
          completedMap.get(logDateStr)!.quran.push({
            page: p,
            rating: log.rating || 3
          });
        }
      });
    });

    // 2. Process Personal Items
    (items || []).forEach(it => {
      if (!it.isActive) return;
      const bTitle = booksMap.get(it.bookId) || (language === 'en' ? 'Book Card' : 'Kartu Kitab');

      const nextReview = it.fsrsData?.nextReview;
      if (nextReview) {
        const nextDate = new Date(nextReview);
        const nextStr = formatLocalDate(nextDate);

        if (nextDate <= today || isDue(nextReview, it.isActive)) {
          if (!plannedMap.has(todayStr)) {
            plannedMap.set(todayStr, { quran: [], personal: [] });
          }
          plannedMap.get(todayStr)!.personal.push({ item: it, bookTitle: bTitle });
        } else {
          if (!plannedMap.has(nextStr)) {
            plannedMap.set(nextStr, { quran: [], personal: [] });
          }
          plannedMap.get(nextStr)!.personal.push({ item: it, bookTitle: bTitle });
        }
      } else {
        if (!plannedMap.has(todayStr)) {
          plannedMap.set(todayStr, { quran: [], personal: [] });
        }
        plannedMap.get(todayStr)!.personal.push({ item: it, bookTitle: bTitle });
      }

      // Check review history (completed)
      (it.reviewLogs || []).forEach(log => {
        if (log.date) {
          const logDateStr = formatLocalDate(new Date(log.date));
          if (!completedMap.has(logDateStr)) {
            completedMap.set(logDateStr, { quran: [], personal: [] });
          }
          completedMap.get(logDateStr)!.personal.push({
            item: it,
            rating: log.rating || 3,
            bookTitle: bTitle
          });
        }
      });
    });

    return { plannedMap, completedMap };
  }, [quranPages, items, books, language, today, todayStr, calendarDays]);

  // Selected date details
  const selectedDateDetails = useMemo(() => {
    const planned = scheduleData.plannedMap.get(selectedDateStr) || { quran: [], personal: [] };
    const completed = scheduleData.completedMap.get(selectedDateStr) || { quran: [], personal: [] };

    const filteredPlannedQuran = (filterType === 'all' || filterType === 'quran') ? planned.quran : [];
    const filteredPlannedPersonal = (filterType === 'all' || filterType === 'personal') ? planned.personal : [];

    const filteredCompletedQuran = (filterType === 'all' || filterType === 'quran') ? completed.quran : [];
    const filteredCompletedPersonal = (filterType === 'all' || filterType === 'personal') ? completed.personal : [];

    const totalPlanned = filteredPlannedQuran.length + filteredPlannedPersonal.length;
    const totalCompleted = filteredCompletedQuran.length + filteredCompletedPersonal.length;

    const isDateToday = selectedDateStr === todayStr;
    const selectedObj = new Date(selectedDateStr + 'T00:00:00');
    const isPast = selectedObj < new Date(todayStr + 'T00:00:00');
    const isFuture = selectedObj > new Date(todayStr + 'T00:00:00');

    // Format human-readable date title
    let formattedTitle = selectedDateStr;
    try {
      formattedTitle = selectedObj.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      // fallback
    }

    return {
      formattedTitle,
      isDateToday,
      isPast,
      isFuture,
      totalPlanned,
      totalCompleted,
      plannedQuran: filteredPlannedQuran,
      plannedPersonal: filteredPlannedPersonal,
      completedQuran: filteredCompletedQuran,
      completedPersonal: filteredCompletedPersonal,
    };
  }, [selectedDateStr, scheduleData, filterType, todayStr, language]);

  return (
    <section 
      data-no-swipe="true"
      className="overflow-hidden rounded-3xl border border-secondary bg-primary shadow-xs"
    >
      <div className="flex flex-col gap-4 border-b border-secondary p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-secondary bg-primary text-center shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">
              {currentMonthName.slice(0, 3)}
            </span>
            <span className="text-lg font-bold text-brand-700">{today.getDate()}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold tracking-tight text-primary md:text-xl">
                {currentMonthName} {currentYear}
              </h3>
              <span className="rounded-full border border-secondary bg-secondary px-2 py-0.5 text-xs font-medium text-secondary">
                {language === 'en' ? 'Review calendar' : 'Kalender review'}
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary md:text-sm">
              {language === 'en' ? 'Visual schedule of upcoming spaced reviews' : 'Jadwal visual murajaah terjadwal' }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <button className="rounded-xl border border-secondary bg-primary p-2 text-fg-quaternary transition hover:bg-primary_hover" aria-label="Search calendar">
            <Search className="size-4" />
          </button>

          <div className="col-span-3 flex items-center rounded-xl border border-secondary bg-primary shadow-xs sm:col-span-1">
            <button type="button" onClick={handlePrevMonth} className="flex h-10 w-10 items-center justify-center border-r border-secondary text-fg-quaternary transition hover:bg-primary_hover" title={language === 'en' ? 'Previous Month' : 'Bulan Sebelumnya'}>
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" onClick={handleGoToToday} className="h-10 min-w-28 px-3 text-sm font-semibold text-primary transition hover:bg-primary_hover">
              {language === 'en' ? 'Today' : 'Hari Ini'}
            </button>
            <button type="button" onClick={handleNextMonth} className="flex h-10 w-10 items-center justify-center border-l border-secondary text-fg-quaternary transition hover:bg-primary_hover" title={language === 'en' ? 'Next Month' : 'Bulan Berikutnya'}>
              <ChevronRight className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddEvent}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-solid px-3 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-solid_hover"
          >
            <Plus className="size-4" />
            {language === 'en' ? 'Add event' : 'Tambah event'}
          </button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-7 border-b border-secondary bg-secondary/40 text-center">
          {weekDayLabels.map((lbl) => (
            <div 
              key={lbl} 
              className="border-r border-secondary px-2 py-2 text-[11px] font-medium text-secondary last:border-r-0"
            >
              {lbl}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const planned = scheduleData.plannedMap.get(day.dateStr);
            const completed = scheduleData.completedMap.get(day.dateStr);

            const qPlannedCount = (filterType === 'all' || filterType === 'quran') ? (planned?.quran.length || 0) : 0;
            const pPlannedCount = (filterType === 'all' || filterType === 'personal') ? (planned?.personal.length || 0) : 0;
            const totalPlanned = qPlannedCount + pPlannedCount;

            const qCompletedCount = (filterType === 'all' || filterType === 'quran') ? (completed?.quran.length || 0) : 0;
            const pCompletedCount = (filterType === 'all' || filterType === 'personal') ? (completed?.personal.length || 0) : 0;
            const totalCompleted = qCompletedCount + pCompletedCount;

            const isSelected = day.dateStr === selectedDateStr;
            const isToday = day.isToday;

            return (
              <button
                key={day.dateStr}
                type="button"
                disabled={!day.isCurrentMonth}
                onClick={() => {
                  if (!day.isCurrentMonth) return;
                  setSelectedDateStr(day.dateStr);
                  setIsDetailsExpanded(true);
                }}
                className={`group relative flex min-h-18 flex-col border-r border-b border-secondary p-2 text-left transition last:border-r-0 sm:min-h-24 md:min-h-30 lg:min-h-36 ${
                  day.isCurrentMonth
                    ? 'bg-primary hover:bg-primary_hover'
                    : 'cursor-not-allowed bg-secondary text-tertiary opacity-60'
                } ${isSelected ? 'ring-2 ring-inset ring-brand z-10' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold ${
                    isToday
                      ? 'flex size-6 items-center justify-center rounded-full bg-brand-solid text-xs font-bold text-white shadow-xs'
                    : isSelected
                      ? 'text-brand-700 font-bold'
                    : day.isCurrentMonth
                      ? 'text-primary'
                      : 'text-tertiary'
                  }`}>
                    {day.dayNumber}
                  </span>

                  {totalCompleted > 0 && day.isCurrentMonth && (
                    <span 
                      title={`${totalCompleted} ${language === 'en' ? 'reviews completed' : 'sesi selesai'}`}
                      className="text-emerald-600 shrink-0"
                    >
                      <CheckCircle2 className="size-3.5 fill-emerald-100" />
                    </span>
                  )}
                </div>

                {day.isCurrentMonth && totalPlanned > 0 && (
                  <>
                    <div className="mt-3 hidden space-y-1.5 sm:block">
                      {qPlannedCount > 0 && (
                        <div className="truncate rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          {language === 'en' ? 'Quran review' : 'Review Quran'} <span className="ml-1 opacity-75">{qPlannedCount}</span>
                        </div>
                      )}
                      {pPlannedCount > 0 && (
                        <div className="truncate rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {language === 'en' ? 'Book review' : 'Review Kitab'} <span className="ml-1 opacity-75">{pPlannedCount}</span>
                        </div>
                      )}
                      {totalPlanned > 2 && <p className="text-xs font-medium text-secondary">{totalPlanned - 2} more...</p>}
                    </div>

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 sm:hidden">
                      {qPlannedCount > 0 && (
                        <span className="size-1.5 rounded-full bg-emerald-500" title={`${qPlannedCount} Quran`} />
                      )}
                      {pPlannedCount > 0 && (
                        <span className="size-1.5 rounded-full bg-blue-500" title={`${pPlannedCount} Kitab`} />
                      )}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-secondary bg-primary">
        <div 
          onClick={() => setIsDetailsExpanded(v => !v)}
          className="flex cursor-pointer items-center justify-between gap-3 p-4 transition-colors hover:bg-primary_hover"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-secondary bg-primary text-fg-quaternary shadow-xs">
              <CalendarIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="truncate text-sm font-semibold capitalize text-primary">
                  {selectedDateDetails.formattedTitle}
                </h4>
                {selectedDateDetails.isDateToday && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    {language === 'en' ? 'Today' : 'Hari Ini'}
                  </span>
                )}
                {selectedDateDetails.isFuture && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                    {language === 'en' ? 'Upcoming' : 'Terjadwal'}
                  </span>
                )}
                {selectedDateDetails.isPast && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary">
                    {language === 'en' ? 'Past Day' : 'Riwayat'}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-secondary">
                {selectedDateDetails.totalPlanned > 0
                  ? `${selectedDateDetails.totalPlanned} ${language === 'en' ? 'items planned for review' : 'hafalan terjadwal murajaah'}`
                  : selectedDateDetails.totalCompleted > 0
                  ? `${selectedDateDetails.totalCompleted} ${language === 'en' ? 'reviews completed' : 'sesi murajaah telah tuntas'}`
                  : (language === 'en' ? 'No reviews scheduled on this date' : 'Tidak ada jadwal murajaah pada tanggal ini')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedDateDetails.isDateToday && selectedDateDetails.totalPlanned > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedDateDetails.plannedQuran.length > 0) {
                    openQuranReview(selectedDateDetails.plannedQuran[0]?.juzNumber);
                  } else {
                    openPersonalReview();
                  }
                }}
                className="hidden items-center gap-1.5 rounded-xl bg-brand-solid px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-solid_hover active:scale-95 sm:inline-flex"
              >
                <span>{language === 'en' ? 'Open Space' : 'Buka Ruang'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-fg-quaternary hover:bg-primary_hover"
            >
              <ChevronDown className={`size-4 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expandable Items Content */}
        <AnimatePresence>
          {isDetailsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 border-t border-secondary bg-secondary/30 p-4"
            >
              {/* PLANNED REVIEWS */}
              {selectedDateDetails.totalPlanned > 0 && (
                <div className="space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-tertiary">
                    {language === 'en' ? 'Planned Material:' : 'Materi Terjadwal:'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Quran Pages */}
                    {selectedDateDetails.plannedQuran.map((p) => {
                      const stabilityDays = getSafeQuranStabilityDays(p);
                      const isMapan = p.status === 'mastered_for_now' || stabilityDays >= 30;

                      return (
                        <div 
                          key={p.pageNumber}
                          className="flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary p-3 shadow-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                Hal {p.pageNumber} • Juz {p.juzNumber}
                              </span>
                              {isMapan ? (
                                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                                  Mapan ({stabilityDays}d)
                                </span>
                              ) : (
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                                  Aktif ({stabilityDays}d)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              QS. {p.surahNameEn} ({p.ayahRange || 'Ayat'})
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => onOpenMushafViewer(p.pageNumber)}
                              title={language === 'en' ? 'View Page' : 'Lihat Halaman'}
                              className="cursor-pointer rounded-lg bg-secondary p-1.5 text-secondary hover:bg-primary_hover"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {selectedDateDetails.isDateToday && (
                              <button
                                type="button"
                                onClick={() => openQuranReview(p.juzNumber)}
                                title={language === 'en' ? 'Open Quran Space' : 'Buka Ruang Quran'}
                                className="cursor-pointer rounded-lg bg-brand-solid p-1.5 text-white hover:bg-brand-solid_hover"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Personal Cards */}
                    {selectedDateDetails.plannedPersonal.map(({ item: it, bookTitle }) => {
                      const stabilityDays = getSafeIntervalDays(it);

                      return (
                        <div 
                          key={it.id}
                          className="flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary p-3 shadow-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {bookTitle}
                              </span>
                              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800">
                                {stabilityDays}d
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {it.question || (language === 'en' ? 'Card Item' : 'Kartu Materi')}
                            </p>
                          </div>

                          {selectedDateDetails.isDateToday && (
                            <button
                              type="button"
                              onClick={openPersonalReview}
                              title={language === 'en' ? 'Open Personal Space' : 'Buka Ruang Pribadi'}
                                className="shrink-0 cursor-pointer rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* COMPLETED REVIEWS ON THIS DAY */}
              {selectedDateDetails.totalCompleted > 0 && (
                <div className="space-y-2 pt-2">
                   <span className="block text-[10px] font-bold uppercase tracking-wider text-tertiary">
                    {language === 'en' ? 'Evaluations Completed on this day:' : 'Riwayat Evaluasi Selesai:'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDateDetails.completedQuran.map(({ page: p, rating }, idx) => (
                      <div 
                        key={`${p.pageNumber}-${idx}`}
                         className="flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary p-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                            Hal {p.pageNumber} • {p.surahNameEn}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          rating === 3 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : rating === 2 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {rating === 3 ? 'Mutqin' : rating === 2 ? 'Cukup' : 'Ulang'}
                        </span>
                      </div>
                    ))}

                    {selectedDateDetails.completedPersonal.map(({ item: it, bookTitle }, idx) => (
                      <div 
                        key={`${it.id}-${idx}`}
                         className="flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary p-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                            {bookTitle}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{it.question}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                          Selesai
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ZERO STATE FOR SELECTED DATE */}
              {selectedDateDetails.totalPlanned === 0 && selectedDateDetails.totalCompleted === 0 && (
                <div className="space-y-1.5 py-6 text-center">
                  <p className="text-xs font-semibold text-secondary">
                    {language === 'en' 
                      ? 'No review sessions scheduled on this date.' 
                      : 'Tidak ada jadwal murajaah pada tanggal ini.'}
                  </p>
                  <p className="mx-auto max-w-sm text-[11px] text-tertiary">
                    {language === 'en'
                      ? 'Enjoy your free time, or use it for adding new memorization (Ziyadah) in Quran space.'
                      : 'Waktu luang optimal untuk menambah hafalan baru (Ziyadah) atau memperkuat bagian yang masih ragu.'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
