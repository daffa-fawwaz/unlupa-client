import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Flame, TrendingUp } from "@/components/foundations/hugeicons";
import { useApp } from "../../context/AppContext";

type ActivityDay = {
  date: Date;
  dateKey: string;
  count: number;
  isFuture: boolean;
  isBeforeStart: boolean;
};

type TooltipState = {
  day: ActivityDay;
  x: number;
  y: number;
} | null;

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function safeDateKey(value: unknown): string | null {
  if (!value) return null;

  try {
    const date = new Date(value as string | number | Date);
    if (Number.isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

function formatDate(date: Date, language: string) {
  return date.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getIntensityClass(count: number, isUnavailable: boolean) {
  if (isUnavailable) return "bg-secondary/40 ring-secondary opacity-50";
  if (count === 0) return "bg-secondary ring-secondary";
  if (count >= 8) return "bg-brand-700 ring-brand-700";
  if (count >= 5) return "bg-brand-500 ring-brand-500";
  if (count >= 3) return "bg-brand-300 ring-brand-300";
  return "bg-brand-100 ring-brand-200";
}

export const ConsistencyJourneyWidget = () => {
  const {
    quranPages,
    items,
    currentStreak,
    language,
    totalActiveMaterials,
    totalMasteredMaterials,
  } = useApp();
  const [today, setToday] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      setToday((previousDate) =>
        safeDateKey(previousDate) === safeDateKey(currentDate)
          ? previousDate
          : currentDate,
      );
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const activityStartDate = useMemo(() => new Date(today.getFullYear(), 0, 1), [today]);
  const activityEndDate = useMemo(() => new Date(today.getFullYear(), 11, 31), [today]);

  const activityData = useMemo(() => {
    const countsByDate = new Map<string, number>();

    quranPages.forEach((page) => {
      page.reviewLogs?.forEach((log) => {
        const dateKey = safeDateKey(log.date);
        if (dateKey) countsByDate.set(dateKey, (countsByDate.get(dateKey) ?? 0) + 1);
      });

      const activationDate = safeDateKey(page.activatedAt);
      if (activationDate) countsByDate.set(activationDate, (countsByDate.get(activationDate) ?? 0) + 1);
    });

    items.forEach((item) => {
      item.reviewLogs?.forEach((log) => {
        const dateKey = safeDateKey(log.date);
        if (dateKey) countsByDate.set(dateKey, (countsByDate.get(dateKey) ?? 0) + 1);
      });
    });

    const gridStart = new Date(activityStartDate);
    gridStart.setDate(activityStartDate.getDate() - activityStartDate.getDay());

    const gridEnd = new Date(activityEndDate);
    gridEnd.setDate(activityEndDate.getDate() + (6 - activityEndDate.getDay()));

    const millisecondsPerDay = 86_400_000;
    const totalGridDays = Math.round((gridEnd.getTime() - gridStart.getTime()) / millisecondsPerDay) + 1;
    const weekCount = Math.ceil(totalGridDays / 7);

    const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
        const dateKey = safeDateKey(date) ?? "";

        return {
          date,
          dateKey,
          count: date < activityStartDate || date > activityEndDate ? 0 : (countsByDate.get(dateKey) ?? 0),
          isFuture: date > today || date > activityEndDate,
          isBeforeStart: date < activityStartDate,
        };
      }),
    );

    const visibleDays = weeks.flat().filter((day) => !day.isFuture && !day.isBeforeStart);
    const activeDaysCount = visibleDays.filter((day) => day.count > 0).length;
    const totalReviews = visibleDays.reduce((total, day) => total + day.count, 0);

    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      const representativeDay = week.find(
        (day) => day.date.getFullYear() === today.getFullYear() && day.date.getDate() <= 7,
      );
      if (!representativeDay) return;

      const month = representativeDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: monthLabels[month], weekIndex });
        lastMonth = month;
      }
    });

    return {
      weeks,
      labels,
      activeDaysCount,
      totalReviews,
      trackedDays: visibleDays.length,
    };
  }, [activityEndDate, activityStartDate, items, quranPages, today]);

  const memoryHealth = totalActiveMaterials > 0
    ? Math.min(100, Math.round((totalMasteredMaterials / totalActiveMaterials) * 100))
    : 0;

  return (
    <section className="rounded-3xl border border-secondary bg-primary p-4 shadow-xs sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-brand/20 bg-brand-50 text-brand-700">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-primary">
              {language === "en" ? "Consistency & Habit Tracker" : "Riwayat Keaktifan & Retensi"}
            </h3>
            <p className="mt-0.5 text-xs text-secondary">
              {language === "en" ? "Review activity from January to December" : "Aktivitas murajaah Januari sampai Desember"}{" "}
              {today.getFullYear()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end text-[11px] font-medium text-tertiary sm:self-auto">
          <span>{language === "en" ? "Less" : "Sedikit"}</span>
          <div className="flex items-center gap-1">
            {["bg-secondary", "bg-brand-100", "bg-brand-300", "bg-brand-500", "bg-brand-700"].map((color) => (
              <span key={color} className={`size-3 rounded-[3px] ring-1 ring-inset ring-secondary ${color}`} />
            ))}
          </div>
          <span>{language === "en" ? "More" : "Banyak"}</span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-3 scrollbar-thin">
        <div className="w-max min-w-full">
          <div className="relative ml-10 h-5">
            {activityData.labels.map(({ label, weekIndex }) => (
              <span
                key={`${label}-${weekIndex}`}
                className="absolute text-[11px] font-medium text-tertiary"
                style={{ left: `${weekIndex * 16}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="grid h-[104px] w-7 shrink-0 grid-rows-7 gap-1">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => (
                <span key={`${label}-${index}`} className="flex items-center text-[10px] font-medium text-tertiary">
                  {label}
                </span>
              ))}
            </div>

            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${activityData.weeks.length}, 12px)` }}
            >
              {activityData.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                  {week.map((day) => (
                    <button
                      key={day.dateKey}
                      type="button"
                      aria-label={`${formatDate(day.date, language)}: ${day.count} review`}
                      onMouseEnter={(event) => setTooltip({ day, x: event.clientX, y: event.clientY })}
                      onMouseMove={(event) => setTooltip({ day, x: event.clientX, y: event.clientY })}
                      onMouseLeave={() => setTooltip(null)}
                      onFocus={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setTooltip({ day, x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onBlur={() => setTooltip(null)}
                      className={`size-3 rounded-[3px] ring-1 ring-inset transition hover:scale-125 hover:ring-brand focus-visible:scale-125 focus-visible:outline-none ${getIntensityClass(day.count, day.isFuture || day.isBeforeStart)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-secondary pt-5 sm:grid-cols-4">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            {language === "en" ? "Current Streak" : "Istiqomah"}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <Flame className="size-4 fill-brand-600 text-brand-600" />
            <span className="text-lg font-semibold text-primary">{currentStreak}</span>
            <span className="text-[11px] text-tertiary">{language === "en" ? "days" : "hari"}</span>
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            {language === "en" ? "Active Days" : "Hari Aktif"}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-semibold text-brand-700">{activityData.activeDaysCount}</span>
            <span className="text-[11px] text-tertiary">/ {activityData.trackedDays} {language === "en" ? "days" : "hari"}</span>
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            {language === "en" ? "Total Reviews" : "Total Evaluasi"}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-semibold text-brand-700">{activityData.totalReviews}</span>
            <span className="text-[11px] text-tertiary">{language === "en" ? "sessions" : "sesi"}</span>
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-tertiary">
            {language === "en" ? "Memory Health" : "Stabilitas Memori"}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-lg font-semibold text-brand-700">{memoryHealth}%</span>
            <TrendingUp className="size-3.5 text-success" />
          </div>
        </div>
      </div>

      {tooltip && !tooltip.day.isFuture && !tooltip.day.isBeforeStart && (
        <div
          className="pointer-events-none fixed z-[300] w-44 -translate-x-1/2 -translate-y-full rounded-xl border border-secondary bg-primary p-3 shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          <p className="text-xs font-semibold capitalize text-primary">{formatDate(tooltip.day.date, language)}</p>
          <div className="my-2 border-t border-secondary" />
          <p className="text-xs text-secondary">
            <span className="font-semibold text-primary">{tooltip.day.count}</span>{" "}
            {language === "en" ? "reviews" : "sesi murajaah"}
          </p>
        </div>
      )}
    </section>
  );
};
